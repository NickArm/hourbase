<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskApiController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $tasks = Task::with(['project.client', 'tags', 'timeEntries'])
            ->forUser($userId)
            ->where('archived', false)
            ->orderBy('created_at', 'desc')
            ->paginate(50);

        return response()->json($tasks);
    }

    public function show(Request $request, Task $task)
    {
        $userId = $request->user()->id;

        $task->loadMissing('project.client');
        if ((int) $task->project->client->user_id !== (int) $userId) {
            abort(403);
        }

        $task->load(['project.client', 'tags', 'timeEntries']);

        return response()->json($task);
    }
}
