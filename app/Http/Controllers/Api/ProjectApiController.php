<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectApiController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $projects = Project::with('client')
            ->forUser($userId)
            ->where('archived', false)
            ->withCount('tasks')
            ->orderBy('name')
            ->paginate(50);

        return response()->json($projects);
    }

    public function show(Request $request, Project $project)
    {
        $userId = $request->user()->id;

        $project->loadMissing('client');
        if ((int) $project->client->user_id !== (int) $userId) {
            abort(403);
        }

        $project->load(['client', 'tasks' => function ($query) {
            $query->orderBy('created_at', 'desc');
        }]);

        return response()->json($project);
    }
}
