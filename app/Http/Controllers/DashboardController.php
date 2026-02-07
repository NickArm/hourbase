<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Project;
use App\Models\Task;
use App\Models\TimeEntry;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $userId = auth()->id();

        // Get stats
        $activeClients = Client::where('user_id', $userId)
            ->where('archived', false)
            ->where('status', 'active')
            ->count();

        $activeProjects = Project::forUser($userId)
            ->where('archived', false)
            ->whereIn('status', ['planning', 'in_progress'])
            ->count();

        $tasksToDo = Task::forUser($userId)
            ->where('archived', false)
            ->whereIn('status', ['to_do', 'in_progress'])
            ->count();

        // Get hours this week
        $startOfWeek = Carbon::now()->startOfWeek();
        $endOfWeek = Carbon::now()->endOfWeek();

        $hoursThisWeek = TimeEntry::where('user_id', $userId)
            ->whereBetween('date', [$startOfWeek, $endOfWeek])
            ->sum('hours');

        // Get recent time entries
        $recentTimeEntries = TimeEntry::with(['task.project.client'])
            ->where('user_id', $userId)
            ->orderBy('date', 'desc')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($entry) {
                return [
                    'id' => $entry->id,
                    'hours' => $entry->hours,
                    'date' => $entry->date->format('Y-m-d'),
                    'task' => [
                        'id' => $entry->task->id,
                        'name' => $entry->task->name,
                        'project' => [
                            'id' => $entry->task->project->id,
                            'name' => $entry->task->project->name,
                            'client' => [
                                'id' => $entry->task->project->client->id,
                                'name' => $entry->task->project->client->name,
                            ],
                        ],
                    ],
                ];
            });

        // Get tasks for quick entry modal
        $tasks = Task::with(['project.client'])
            ->forUser($userId)
            ->where('archived', false)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => [
                'activeClients' => $activeClients,
                'activeProjects' => $activeProjects,
                'tasksToDo' => $tasksToDo,
                'hoursThisWeek' => round($hoursThisWeek, 1),
            ],
            'recentTimeEntries' => $recentTimeEntries,
            'tasks' => $tasks,
        ]);
    }
}
