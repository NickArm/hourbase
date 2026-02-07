<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $projects = Project::with(['client'])
            ->forUser()
            ->where('archived', false)
            ->withCount('tasks')
            ->orderBy('name')
            ->get();

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $clients = Client::where('user_id', auth()->id())
            ->where('archived', false)
            ->where('status', 'active')
            ->orderBy('name')
            ->get();

        return Inertia::render('Projects/Create', [
            'clients' => $clients,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'estimated_hours' => 'nullable|numeric|min:0',
            'status' => 'required|in:planning,in_progress,on_hold,completed',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        // Verify client belongs to user
        $client = Client::where('id', $validated['client_id'])
            ->where('user_id', auth()->id())
            ->firstOrFail();

        Project::create($validated);

        return redirect()->route('projects.index')
            ->with('success', 'Project created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        // Verify project belongs to user
        $project->loadMissing('client');
        if ($project->client->user_id !== auth()->id()) {
            abort(403);
        }

        $project->load(['tasks' => function ($query) {
            $query->orderBy('created_at', 'desc');
        }]);

        return Inertia::render('Projects/Show', [
            'project' => $project,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        // Verify project belongs to user
        $project->loadMissing('client');
        if ($project->client->user_id !== auth()->id()) {
            abort(403);
        }

        $clients = Client::where('user_id', auth()->id())
            ->where('archived', false)
            ->where('status', 'active')
            ->orderBy('name')
            ->get();

        return Inertia::render('Projects/Edit', [
            'project' => $project->load('client'),
            'clients' => $clients,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project)
    {
        // Verify project belongs to user
        $project->loadMissing('client');
        if ($project->client->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'estimated_hours' => 'nullable|numeric|min:0',
            'status' => 'required|in:planning,in_progress,on_hold,completed',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        // Verify client belongs to user
        $client = Client::where('id', $validated['client_id'])
            ->where('user_id', auth()->id())
            ->firstOrFail();

        $project->update($validated);

        return redirect()->route('projects.index')
            ->with('success', 'Project updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        // Verify project belongs to user
        $project->loadMissing('client');
        if ($project->client->user_id !== auth()->id()) {
            abort(403);
        }

        $project->update([
            'archived' => true,
            'archived_at' => now(),
        ]);

        return redirect()->route('projects.index')
            ->with('success', 'Project archived successfully.');
    }
}
