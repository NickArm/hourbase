<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Project;
use App\Models\TimeEntry;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportsController extends Controller
{
    /**
     * Display time tracking analytics
     */
    public function timeTracking(Request $request)
    {
        $userId = auth()->id();

        // Get date range from request
        $startDate = $request->query('start_date')
            ? Carbon::parse($request->query('start_date'))
            : Carbon::now()->startOfMonth();
        $endDate = $request->query('end_date')
            ? Carbon::parse($request->query('end_date'))
            : Carbon::now()->endOfMonth();

        // Hours per day
        $hoursPerDay = TimeEntry::where('user_id', $userId)
            ->whereBetween('date', [$startDate, $endDate])
            ->selectRaw('DATE(date) as date, SUM(hours) as total_hours')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($entry) {
                return [
                    'date' => Carbon::parse($entry->date)->format('M d'),
                    'hours' => round($entry->total_hours, 2),
                ];
            });

        // Hours per week - SQLite compatible using strftime
        $hoursPerWeek = TimeEntry::where('user_id', $userId)
            ->whereBetween('date', [$startDate, $endDate])
            ->selectRaw("strftime('%Y-%W', date) as week, SUM(hours) as total_hours")
            ->groupBy('week')
            ->orderBy('week')
            ->get()
            ->map(function ($entry) {
                return [
                    'week' => 'Week '.substr($entry->week, -2),
                    'hours' => round($entry->total_hours, 2),
                ];
            });

        // Hours per project
        $hoursPerProject = TimeEntry::where('user_id', $userId)
            ->whereBetween('date', [$startDate, $endDate])
            ->join('tasks', 'time_entries.task_id', '=', 'tasks.id')
            ->join('projects', 'tasks.project_id', '=', 'projects.id')
            ->selectRaw('projects.name, SUM(time_entries.hours) as total_hours')
            ->groupBy('projects.id', 'projects.name')
            ->orderByRaw('SUM(time_entries.hours) DESC')
            ->get()
            ->map(function ($entry) {
                return [
                    'name' => $entry->name,
                    'hours' => round($entry->total_hours, 2),
                ];
            });

        // Hours per client
        $hoursPerClient = TimeEntry::where('time_entries.user_id', $userId)
            ->whereBetween('date', [$startDate, $endDate])
            ->join('tasks', 'time_entries.task_id', '=', 'tasks.id')
            ->join('projects', 'tasks.project_id', '=', 'projects.id')
            ->join('clients', 'projects.client_id', '=', 'clients.id')
            ->selectRaw('clients.name, SUM(time_entries.hours) as total_hours')
            ->groupBy('clients.id', 'clients.name')
            ->orderByRaw('SUM(time_entries.hours) DESC')
            ->get()
            ->map(function ($entry) {
                return [
                    'name' => $entry->name,
                    'hours' => round($entry->total_hours, 2),
                ];
            });

        // Summary stats
        $totalHours = TimeEntry::where('user_id', $userId)
            ->whereBetween('date', [$startDate, $endDate])
            ->sum('hours');

        $workingDays = $startDate->diffInDays($endDate) > 0
            ? ceil($startDate->diffInDays($endDate) / 7 * 5)
            : 1;
        $averagePerDay = $totalHours > 0 ? round($totalHours / $workingDays, 2) : 0;

        return Inertia::render('Reports/TimeTracking', [
            'hoursPerDay' => $hoursPerDay,
            'hoursPerWeek' => $hoursPerWeek,
            'hoursPerProject' => $hoursPerProject,
            'hoursPerClient' => $hoursPerClient,
            'stats' => [
                'totalHours' => round($totalHours, 2),
                'averagePerDay' => $averagePerDay,
            ],
            'dateRange' => [
                'startDate' => $startDate->format('Y-m-d'),
                'endDate' => $endDate->format('Y-m-d'),
            ],
        ]);
    }

    /**
     * Display project analytics
     */
    public function projects()
    {
        $userId = auth()->id();

        // Get all user's projects with stats
        $projects = Project::forUser($userId)
            ->with(['tasks' => function ($query) {
                $query->where('archived', false);
            }])
            ->get()
            ->map(function ($project) {
                $tasks = $project->tasks;
                $completedTasks = $tasks->where('status', 'done')->count();
                $totalTasks = $tasks->count();

                $totalHours = $tasks->sum(function ($task) {
                    return $task->timeEntries->sum('hours');
                });

                return [
                    'id' => $project->id,
                    'name' => $project->name,
                    'client' => $project->client?->name ?? 'Unknown',
                    'status' => $project->status,
                    'completedTasks' => $completedTasks,
                    'totalTasks' => $totalTasks,
                    'progress' => $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100, 1) : 0,
                    'estimatedHours' => $project->estimated_hours ?? 0,
                    'actualHours' => round($totalHours, 2),
                    'hoursDifference' => round(($project->estimated_hours ?? 0) - $totalHours, 2),
                ];
            })
            ->sortByDesc('actualHours')
            ->values();

        // Summary stats
        $totalProjects = $projects->count();
        $completedProjects = $projects->where('progress', 100)->count();
        $activeProjects = $projects->whereIn('status', ['in_progress', 'planning'])->count();

        return Inertia::render('Reports/Projects', [
            'projects' => $projects,
            'stats' => [
                'totalProjects' => $totalProjects,
                'completedProjects' => $completedProjects,
                'activeProjects' => $activeProjects,
            ],
        ]);
    }

    /**
     * Display client analytics
     */
    public function clients()
    {
        $userId = auth()->id();

        // Get all user's clients with stats
        $clients = Client::where('user_id', $userId)
            ->with(['projects' => function ($query) {
                $query->where('archived', false);
            }])
            ->get()
            ->map(function ($client) {
                $projects = $client->projects ?? collect();
                $totalHours = $projects->sum(function ($project) {
                    return $project->tasks?->sum(function ($task) {
                        return $task->timeEntries?->sum('hours') ?? 0;
                    }) ?? 0;
                });

                $billableHours = $projects->sum(function ($project) {
                    return $project->tasks->sum(function ($task) {
                        return $task->timeEntries->where('billable', true)->sum('hours');
                    });
                });

                $estimatedRevenue = ($billableHours * ($client->hourly_rate ?? 0));

                return [
                    'id' => $client->id,
                    'name' => $client->name,
                    'status' => $client->status,
                    'projectCount' => $projects->count(),
                    'totalHours' => round($totalHours, 2),
                    'billableHours' => round($billableHours, 2),
                    'hourlyRate' => $client->hourly_rate ?? 0,
                    'estimatedRevenue' => round($estimatedRevenue, 2),
                ];
            })
            ->sortByDesc('totalHours')
            ->values();

        // Summary stats
        $totalClients = $clients->count();
        $activeClients = $clients->where('status', 'active')->count();
        $totalHours = $clients->sum('totalHours');
        $totalRevenue = $clients->sum('estimatedRevenue');

        return Inertia::render('Reports/Clients', [
            'clients' => $clients,
            'stats' => [
                'totalClients' => $totalClients,
                'activeClients' => $activeClients,
                'totalHours' => round($totalHours, 2),
                'totalRevenue' => round($totalRevenue, 2),
            ],
        ]);
    }
}
