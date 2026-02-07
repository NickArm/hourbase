<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TagController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tags = Tag::where('user_id', auth()->id())
            ->withCount('tasks')
            ->orderBy('name')
            ->get();

        return Inertia::render('Tags/Index', [
            'tags' => $tags,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Tags/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'color' => 'required|string|regex:/^#[0-9A-F]{6}$/i',
        ]);

        $validated['user_id'] = auth()->id();

        Tag::create($validated);

        return redirect()->route('tags.index')
            ->with('success', 'Tag created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Tag $tag)
    {
        // Verify tag belongs to user
        if ($tag->user_id !== auth()->id()) {
            abort(403);
        }

        $tag->load(['tasks.project.client']);

        return Inertia::render('Tags/Show', [
            'tag' => $tag,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Tag $tag)
    {
        // Verify tag belongs to user
        if ($tag->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('Tags/Edit', [
            'tag' => $tag,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Tag $tag)
    {
        // Verify tag belongs to user
        if ($tag->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'color' => 'required|string|regex:/^#[0-9A-F]{6}$/i',
        ]);

        $tag->update($validated);

        return redirect()->route('tags.index')
            ->with('success', 'Tag updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tag $tag)
    {
        // Verify tag belongs to user
        if ($tag->user_id !== auth()->id()) {
            abort(403);
        }

        $tag->delete();

        return redirect()->route('tags.index')
            ->with('success', 'Tag deleted successfully.');
    }

    /**
     * Get tag suggestions for a task based on usage patterns
     */
    public function suggestions(Request $request)
    {
        $projectId = $request->query('project_id');
        $search = $request->query('search', '');

        // Get all user's tags
        $query = Tag::where('user_id', auth()->id());

        // Filter by search term
        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        // Get tags with usage count
        $tags = $query->withCount('tasks')->orderByDesc('tasks_count')->get();

        // If project_id provided, prioritize tags used in that project
        if ($projectId) {
            $projectTags = DB::table('tag_task')
                ->join('tasks', 'tag_task.task_id', '=', 'tasks.id')
                ->where('tasks.project_id', $projectId)
                ->pluck('tag_task.tag_id')
                ->toArray();

            $tags = $tags->sort(function ($a, $b) use ($projectTags) {
                $aInProject = in_array($a->id, $projectTags) ? 1 : 0;
                $bInProject = in_array($b->id, $projectTags) ? 1 : 0;

                if ($aInProject !== $bInProject) {
                    return $bInProject - $aInProject;
                }

                return $b->tasks_count - $a->tasks_count;
            })->values();
        }

        return response()->json($tags->take(10));
    }
}
