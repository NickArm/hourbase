<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;

class InvoiceApiController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $invoices = Invoice::with(['client', 'items'])
            ->where('user_id', $userId)
            ->orderBy('date', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(50);

        return response()->json($invoices);
    }

    public function show(Request $request, Invoice $invoice)
    {
        $userId = $request->user()->id;

        if ((int) $invoice->user_id !== (int) $userId) {
            abort(403);
        }

        $invoice->load(['client', 'items']);

        return response()->json($invoice);
    }
}
