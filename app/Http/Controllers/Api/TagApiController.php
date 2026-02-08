<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\Request;

class TagApiController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $tags = Tag::where('user_id', $userId)
            ->withCount('tasks')
            ->orderBy('name')
            ->paginate(50);

        return response()->json($tags);
    }

    public function show(Request $request, Tag $tag)
    {
        $userId = $request->user()->id;

        if ((int) $tag->user_id !== (int) $userId) {
            abort(403);
        }

        $tag->load(['tasks.project.client']);

        return response()->json($tag);
    }
}
