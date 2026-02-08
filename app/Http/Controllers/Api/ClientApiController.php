<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;

class ClientApiController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $clients = Client::where('user_id', $userId)
            ->where('archived', false)
            ->withCount('projects')
            ->orderBy('name')
            ->paginate(50);

        return response()->json($clients);
    }

    public function show(Request $request, Client $client)
    {
        $userId = $request->user()->id;

        if ((int) $client->user_id !== (int) $userId) {
            abort(403);
        }

        $client->load(['projects' => function ($query) {
            $query->orderBy('created_at', 'desc');
        }]);

        return response()->json($client);
    }
}
