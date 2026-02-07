<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use App\Models\TrelloIntegration;
use App\Services\TrelloService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TrelloImportController extends Controller
{
    protected TrelloService $trelloService;

    public function __construct(TrelloService $trelloService)
    {
        $this->trelloService = $trelloService;
    }

    /**
     * Get Trello authorization URL
     */
    public function authorize()
    {
        $redirectUri = route('trello.callback');
        $authUrl = $this->trelloService->getAuthorizationUrl($redirectUri);

        return redirect($authUrl);
    }

    /**
     * Handle OAuth callback from Trello
     */
    public function callback(Request $request)
    {
        $token = $request->query('token');
        if (! $token) {
            return redirect()->route('settings.index')
                ->with('error', 'Ο OAuth callback δεν περιέχει token');
        }

        try {
            // Verify token is valid
            if (! $this->trelloService->verifyToken($token)) {
                return redirect()->route('settings.index')
                    ->with('error', 'Το token είναι ανέγκυρο');
            }

            // Get user info from Trello
            $trelloUser = $this->trelloService->getCurrentUser($token);

            // Store or update integration
            $integration = TrelloIntegration::updateOrCreate(
                [
                    'user_id' => Auth::id(),
                    'trello_user_id' => $trelloUser['id'],
                ],
                [
                    'trello_username' => $trelloUser['username'],
                    'access_token_encrypted' => encrypt($token),
                    'access_token' => 'encrypted',
                ]
            );

            return redirect()->route('settings.index')
                ->with('success', "Συνδέθηκες με το Trello ως {$trelloUser['username']}");
        } catch (\Exception $e) {
            return redirect()->route('settings.index')
                ->with('error', 'Σφάλμα κατά τη σύνδεση: '.$e->getMessage());
        }
    }

    /**
     * Disconnect Trello integration
     */
    public function disconnect()
    {
        TrelloIntegration::where('user_id', Auth::id())->delete();

        return redirect()->route('settings.index')
            ->with('success', 'Η σύνδεση με το Trello διαγράφηκε');
    }

    /**
     * Get boards for import selection
     */
    public function getBoards()
    {
        try {
            $integration = TrelloIntegration::where('user_id', Auth::id())
                ->firstOrFail();

            $token = decrypt($integration->access_token_encrypted);
            $boards = $this->trelloService->getBoards($token);

            return response()->json($boards);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * Get lists from a board
     */
    public function getLists(Request $request)
    {
        try {
            $boardId = $request->query('board_id');
            if (! $boardId) {
                return response()->json(['error' => 'Board ID is required'], 400);
            }

            $integration = TrelloIntegration::where('user_id', Auth::id())
                ->firstOrFail();

            $token = decrypt($integration->access_token_encrypted);
            $lists = $this->trelloService->getBoardLists($boardId, $token);

            return response()->json($lists);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    /**
     * Import cards from a Trello list as tasks
     */
    public function importCards(Request $request)
    {
        $validated = $request->validate([
            'board_id' => 'required|string',
            'list_id' => 'required|string',
            'project_id' => 'required|integer|exists:projects,id',
            'import_labels' => 'boolean',
            'import_due_date' => 'boolean',
        ]);

        try {
            $integration = TrelloIntegration::where('user_id', Auth::id())
                ->firstOrFail();

            // Verify project belongs to user
            $project = Project::with('client')
                ->forUser()
                ->findOrFail($validated['project_id']);

            $token = decrypt($integration->access_token_encrypted);
            $cards = $this->trelloService->getListCards($validated['list_id'], $token);

            $importedCount = 0;
            DB::transaction(function () use ($cards, $project, $validated, &$importedCount) {
                foreach ($cards as $card) {
                    $taskData = [
                        'project_id' => $project->id,
                        'name' => $card['name'],
                        'description' => $card['desc'] ?? null,
                        'status' => 'to_do',
                        'billable' => true,
                        'archived' => false,
                    ];

                    // Import due date if enabled
                    if ($validated['import_due_date'] && ! empty($card['due'])) {
                        $taskData['due_date'] = $card['due'];
                    }

                    $task = Task::create($taskData);
                    $importedCount++;

                    // Import labels as tags if enabled
                    if ($validated['import_labels'] && ! empty($card['labels'])) {
                        // This would require mapping Trello labels to your tags
                        // For now, we'll skip this part
                    }
                }
            });

            // Update integration with last synced info
            $integration->update([
                'board_id' => $validated['board_id'],
                'list_id' => $validated['list_id'],
                'last_synced_at' => now(),
            ]);

            return redirect()->route('settings.index')
                ->with('success', "{$importedCount} κάρτες εισήχθησαν με επιτυχία!");
        } catch (\Exception $e) {
            return redirect()->route('settings.index')
                ->with('error', 'Σφάλμα κατά την εισαγωγή: '.$e->getMessage());
        }
    }
}
