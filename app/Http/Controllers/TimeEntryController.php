<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TimeEntry;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TimeEntryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $timeEntries = TimeEntry::with(['task.project.client', 'user'])
            ->where('user_id', auth()->id())
            ->orderBy('date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('TimeEntries/Index', [
            'timeEntries' => $timeEntries,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $tasks = Task::with(['project.client'])
            ->forUser()
            ->where('archived', false)
            ->orderBy('name')
            ->get();

        $taskId = $request->query('task_id');

        return Inertia::render('TimeEntries/Create', [
            'tasks' => $tasks,
            'task_id' => $taskId,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'task_id' => 'required|exists:tasks,id',
            'date' => 'required|date',
            'hours' => 'required|numeric|min:0.25|max:24',
            'notes' => 'nullable|string|max:1000',
        ]);

        // Check if task is paid
        $task = Task::findOrFail($validated['task_id']);
        if ($task->paid) {
            return redirect()->back()
                ->with('error', 'Δεν μπορείτε να προσθέσετε time entries σε task που είναι ήδη πληρωμένο.');
        }

        $validated['user_id'] = auth()->id();

        TimeEntry::create($validated);

        return redirect()->route('time-entries.index')
            ->with('success', 'Time entry created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(TimeEntry $timeEntry)
    {
        // Verify time entry belongs to user
        if ($timeEntry->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('TimeEntries/Show', [
            'timeEntry' => $timeEntry->load(['task.project.client', 'user']),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TimeEntry $timeEntry)
    {
        // Verify time entry belongs to user
        if ($timeEntry->user_id !== auth()->id()) {
            abort(403);
        }

        $tasks = Task::with(['project.client'])
            ->forUser()
            ->where('archived', false)
            ->orderBy('name')
            ->get();

        return Inertia::render('TimeEntries/Edit', [
            'timeEntry' => $timeEntry->load(['task.project.client']),
            'tasks' => $tasks,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TimeEntry $timeEntry)
    {
        // Verify time entry belongs to user
        if ($timeEntry->user_id !== auth()->id()) {
            abort(403);
        }

        // Check if task is paid
        $timeEntry->loadMissing('task');
        if ($timeEntry->task->paid) {
            return redirect()->back()
                ->with('error', 'Δεν μπορείτε να επεξεργαστείτε time entries για task που είναι ήδη πληρωμένο.');
        }

        $validated = $request->validate([
            'task_id' => 'required|exists:tasks,id',
            'date' => 'required|date',
            'hours' => 'required|numeric|min:0.25|max:24',
            'notes' => 'nullable|string|max:1000',
        ]);

        $timeEntry->update($validated);

        return redirect()->route('time-entries.index')
            ->with('success', 'Time entry updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TimeEntry $timeEntry)
    {
        // Verify time entry belongs to user
        if ($timeEntry->user_id !== auth()->id()) {
            abort(403);
        }

        $timeEntry->delete();

        return redirect()->route('time-entries.index')
            ->with('success', 'Time entry deleted successfully.');
    }
}
