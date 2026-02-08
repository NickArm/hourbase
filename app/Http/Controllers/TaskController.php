<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Tag;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tasks = Task::with(['project.client', 'tags', 'timeEntries'])
            ->forUser()
            ->where('archived', false)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Tasks/Index', [
            'tasks' => $tasks,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $projects = Project::with('client')
            ->forUser()
            ->where('archived', false)
            ->orderBy('name')
            ->get();

        $tags = Tag::where('user_id', auth()->id())
            ->orderBy('name')
            ->get();

        return Inertia::render('Tasks/Create', [
            'projects' => $projects,
            'tags' => $tags,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'external_url' => 'nullable|url|max:500',
            'billable' => 'boolean',
            'estimated_hours' => 'nullable|numeric|min:0',
            'due_date' => 'nullable|date',
            'status' => 'required|in:to_do,in_progress,done',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id',
        ]);

        // Verify project belongs to user
        $project = Project::with('client')
            ->whereHas('client', function ($query) {
                $query->where('user_id', auth()->id());
            })
            ->findOrFail($validated['project_id']);

        $tags = $validated['tags'] ?? [];
        unset($validated['tags']);

        $task = Task::create($validated);

        if (! empty($tags)) {
            $task->tags()->attach($tags);
        }

        return redirect()->route('tasks.index')
            ->with('success', 'Task created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        // Verify task belongs to user
        $task->loadMissing('project.client');
        $userId = auth()->id();
        if (! $userId || (int) $task->project->client->user_id !== (int) $userId) {
            abort(403);
        }

        $task->load(['tags', 'timeEntries.user']);

        return Inertia::render('Tasks/Show', [
            'task' => $task,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {
        // Verify task belongs to user
        $task->loadMissing('project.client');
        $userId = auth()->id();
        if (! $userId || (int) $task->project->client->user_id !== (int) $userId) {
            abort(403);
        }

        $projects = Project::with('client')
            ->whereHas('client', function ($query) {
                $query->where('user_id', auth()->id())
                    ->where('archived', false);
            })
            ->where('archived', false)
            ->orderBy('name')
            ->get();

        $tags = Tag::where('user_id', auth()->id())
            ->orderBy('name')
            ->get();

        return Inertia::render('Tasks/Edit', [
            'task' => $task->load(['project.client', 'tags', 'timeEntries']),
            'projects' => $projects,
            'tags' => $tags,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task)
    {
        // Verify task belongs to user
        $task->loadMissing('project.client');
        $userId = auth()->id();
        if (! $userId || (int) $task->project->client->user_id !== (int) $userId) {
            abort(403);
        }

        // Prevent updating paid tasks (except to unpay them)
        if ($task->paid && ! $request->input('paid', true)) {
            // Allow unpaying
        } elseif ($task->paid) {
            return redirect()->back()
                ->with('error', 'Δεν μπορείτε να τροποποιήσετε ένα task που είναι ήδη πληρωμένο.');
        }

        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'external_url' => 'nullable|url|max:500',
            'billable' => 'boolean',
            'paid' => 'boolean',
            'estimated_hours' => 'nullable|numeric|min:0',
            'due_date' => 'nullable|date',
            'status' => 'required|in:to_do,in_progress,done',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id',
        ]);

        // Verify project belongs to user
        $project = Project::with('client')
            ->whereHas('client', function ($query) {
                $query->where('user_id', auth()->id());
            })
            ->findOrFail($validated['project_id']);

        $tags = $validated['tags'] ?? [];
        unset($validated['tags']);

        $task->update($validated);

        $task->tags()->sync($tags);

        return redirect()->route('tasks.index')
            ->with('success', 'Task updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        // Verify task belongs to user
        $task->loadMissing('project.client');
        $userId = auth()->id();
        if (! $userId || (int) $task->project->client->user_id !== (int) $userId) {
            abort(403);
        }

        $task->update([
            'archived' => true,
            'archived_at' => now(),
        ]);

        return redirect()->route('tasks.index')
            ->with('success', 'Task archived successfully.');
    }

    /**
     * Bulk assign tags to multiple tasks
     */
    public function bulkAssignTags(Request $request)
    {
        $validated = $request->validate([
            'task_ids' => 'required|array|min:1',
            'task_ids.*' => 'integer|exists:tasks,id',
            'tag_ids' => 'required|array|min:1',
            'tag_ids.*' => 'integer|exists:tags,id',
            'action' => 'required|in:assign,remove',
        ]);

        // Verify all tasks belong to user
        $tasks = Task::whereIn('id', $validated['task_ids'])
            ->with('project.client')
            ->get();

        foreach ($tasks as $task) {
            $userId = auth()->id();
            if (! $userId || (int) $task->project->client->user_id !== (int) $userId) {
                abort(403);
            }
        }

        // Verify all tags belong to user
        $tags = Tag::whereIn('id', $validated['tag_ids'])
            ->where('user_id', auth()->id())
            ->get();

        if ($tags->count() !== count($validated['tag_ids'])) {
            abort(403);
        }

        // Bulk assign or remove tags
        if ($validated['action'] === 'assign') {
            foreach ($tasks as $task) {
                $task->tags()->syncWithoutDetaching($validated['tag_ids']);
            }
            $message = 'Tags assigned to '.count($tasks).' task(s) successfully.';
        } else {
            foreach ($tasks as $task) {
                $task->tags()->detach($validated['tag_ids']);
            }
            $message = 'Tags removed from '.count($tasks).' task(s) successfully.';
        }

        return response()->json(['message' => $message], 200);
    }
}
