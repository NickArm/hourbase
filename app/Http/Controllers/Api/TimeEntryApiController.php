<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TimeEntry;
use Illuminate\Http\Request;

class TimeEntryApiController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $timeEntries = TimeEntry::with(['task.project.client'])
            ->where('user_id', $userId)
            ->orderBy('date', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(50);

        return response()->json($timeEntries);
    }

    public function show(Request $request, TimeEntry $timeEntry)
    {
        $userId = $request->user()->id;

        if ((int) $timeEntry->user_id !== (int) $userId) {
            abort(403);
        }

        $timeEntry->load(['task.project.client', 'user']);

        return response()->json($timeEntry);
    }
}
