<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $invoices = Invoice::with('client')
            ->where('user_id', auth()->id())
            ->orderBy('date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Invoices/Index', [
            'invoices' => $invoices,
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

        $user = auth()->user();

        return Inertia::render('Invoices/Create', [
            'clients' => $clients,
            'defaultVatRate' => $user->vat_rate ?? 24,
            'defaultCurrency' => $user->currency ?? 'EUR',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'invoice_number' => 'required|string|max:255',
            'mydata_invoice_number' => 'nullable|string|max:255',
            'date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:date',
            'status' => 'required|in:draft,issued,paid,canceled',
            'subtotal' => 'required|numeric|min:0',
            'vat_rate' => 'required|numeric|min:0|max:100',
            'vat_amount' => 'required|numeric|min:0',
            'total_amount' => 'required|numeric|min:0',
            'currency' => 'required|in:EUR,USD,GBP',
            'notes' => 'nullable|string',
            'footer_notes' => 'nullable|string',
            'payment_method' => 'nullable|string|max:255',
            'payment_reference' => 'nullable|string|max:255',
            'payment_date' => 'nullable|date',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string|max:500',
            'items.*.quantity' => 'required|numeric|min:0',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.total' => 'required|numeric|min:0',
        ]);

        // Verify client belongs to user
        $client = Client::where('id', $validated['client_id'])
            ->where('user_id', auth()->id())
            ->firstOrFail();

        $items = $validated['items'];
        unset($validated['items']);

        $validated['user_id'] = auth()->id();

        $invoice = Invoice::create($validated);

        foreach ($items as $item) {
            $invoice->items()->create($item);
        }

        return redirect()->route('invoices.index')
            ->with('success', 'Invoice created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Invoice $invoice)
    {
        // Verify invoice belongs to user
        $userId = auth()->id();
        if (! $userId || (int) $invoice->user_id !== (int) $userId) {
            abort(403);
        }

        $invoice->load(['client', 'items']);

        return Inertia::render('Invoices/Show', [
            'invoice' => $invoice,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Invoice $invoice)
    {
        // Verify invoice belongs to user
        $userId = auth()->id();
        if (! $userId || (int) $invoice->user_id !== (int) $userId) {
            abort(403);
        }

        $clients = Client::where('user_id', auth()->id())
            ->where('archived', false)
            ->where('status', 'active')
            ->orderBy('name')
            ->get();

        $user = auth()->user();

        return Inertia::render('Invoices/Edit', [
            'invoice' => $invoice->load(['client', 'items']),
            'clients' => $clients,
            'defaultVatRate' => $user->vat_rate ?? 24,
            'defaultCurrency' => $user->currency ?? 'EUR',
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Invoice $invoice)
    {
        // Verify invoice belongs to user
        $userId = auth()->id();
        if (! $userId || (int) $invoice->user_id !== (int) $userId) {
            abort(403);
        }

        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'invoice_number' => 'required|string|max:255',
            'mydata_invoice_number' => 'nullable|string|max:255',
            'date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:date',
            'status' => 'required|in:draft,issued,paid,canceled',
            'subtotal' => 'required|numeric|min:0',
            'vat_rate' => 'required|numeric|min:0|max:100',
            'vat_amount' => 'required|numeric|min:0',
            'total_amount' => 'required|numeric|min:0',
            'currency' => 'required|in:EUR,USD,GBP',
            'notes' => 'nullable|string',
            'footer_notes' => 'nullable|string',
            'payment_method' => 'nullable|string|max:255',
            'payment_reference' => 'nullable|string|max:255',
            'payment_date' => 'nullable|date',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string|max:500',
            'items.*.quantity' => 'required|numeric|min:0',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.total' => 'required|numeric|min:0',
        ]);

        // Verify client belongs to user
        $client = Client::where('id', $validated['client_id'])
            ->where('user_id', auth()->id())
            ->firstOrFail();

        $items = $validated['items'];
        unset($validated['items']);

        $invoice->update($validated);

        // Delete existing items and create new ones
        $invoice->items()->delete();
        foreach ($items as $item) {
            $invoice->items()->create($item);
        }

        return redirect()->route('invoices.index')
            ->with('success', 'Invoice updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Invoice $invoice)
    {
        // Verify invoice belongs to user
        $userId = auth()->id();
        if (! $userId || (int) $invoice->user_id !== (int) $userId) {
            abort(403);
        }

        $invoice->delete();

        return redirect()->route('invoices.index')
            ->with('success', 'Invoice deleted successfully.');
    }

    /**
     * Create an invoice from selected tasks
     */
    public function createFromTasks(Request $request)
    {
        \Log::info('createFromTasks called', [
            'task_ids' => $request->task_ids,
            'all_data' => $request->all(),
        ]);

        $validated = $request->validate([
            'task_ids' => 'required|array|min:1',
            'task_ids.*' => 'exists:tasks,id',
        ]);

        \Log::info('Validation passed');

        $user = auth()->user();

        \Log::info('User billing info check', [
            'company_name' => $user->company_name,
            'address' => $user->address,
            'city' => $user->city,
            'postal_code' => $user->postal_code,
            'country' => $user->country,
            'tax_id' => $user->tax_id,
        ]);

        // Check if user has all required billing information
        if (! $user->company_name || ! $user->address || ! $user->city || ! $user->postal_code || ! $user->country || ! $user->tax_id) {
            \Log::warning('User missing billing info');

            return redirect()->back()->with('error', 'Παρακαλώ συμπληρώστε τα στοιχεία χρέωσης σας στις Ρυθμίσεις πριν δημιουργήσετε τιμολόγιο');
        }

        \Log::info('Loading tasks');

        // Load tasks with relationships
        $tasks = \App\Models\Task::with(['project.client', 'timeEntries'])
            ->whereIn('id', $validated['task_ids'])
            ->forUser()
            ->get();

        \Log::info('Tasks loaded', ['count' => $tasks->count()]);

        if ($tasks->isEmpty()) {
            \Log::warning('No tasks found');

            return redirect()->back()->with('error', 'Δεν βρέθηκαν έγκυρα tasks');
        }

        // Check if all tasks belong to the same client
        $clientIds = $tasks->pluck('project.client.id')->unique();
        \Log::info('Client IDs check', ['client_ids' => $clientIds->toArray()]);

        if ($clientIds->count() !== 1) {
            \Log::warning('Multiple clients detected');

            return redirect()->back()->with('error', 'Όλα τα tasks πρέπει να ανήκουν στον ίδιο πελάτη');
        }

        $client = $tasks->first()->project->client;

        \Log::info('Client info check', [
            'name' => $client->name,
            'company_name' => $client->company_name,
            'tax_id' => $client->tax_id,
            'address' => $client->address,
            'city' => $client->city,
            'postal_code' => $client->postal_code,
            'country' => $client->country,
        ]);

        // Check if client has all required information
        if (! $client->company_name || ! $client->tax_id || ! $client->address || ! $client->city || ! $client->postal_code || ! $client->country) {
            \Log::warning('Client missing billing info');

            return redirect()->back()->with('error', 'Ο πελάτης "'.$client->name.'" δεν έχει συμπληρωμένα όλα τα στοιχεία χρέωσης (company name, tax ID, address, city, postal code, country). Παρακαλώ ενημερώστε τα στοιχεία του πελάτη από τη σελίδα Clients.');
        }

        // Check if any task is already in an invoice
        $tasksInInvoice = $tasks->where('invoice_id', '!=', null);
        \Log::info('Checking if tasks already in invoice', ['count' => $tasksInInvoice->count()]);

        if ($tasksInInvoice->isNotEmpty()) {
            \Log::warning('Tasks already in invoice');

            return redirect()->back()->with('error', 'Κάποια tasks βρίσκονται ήδη σε τιμολόγιο και δεν μπορούν να προστεθούν ξανά');
        }

        // Determine hourly rate (client rate takes precedence over user default)
        $hourlyRate = $client->hourly_rate ?? $user->default_hourly_rate ?? 50;

        \Log::info('Creating invoice', ['hourly_rate' => $hourlyRate]);

        // Create invoice
        $invoice = Invoice::create([
            'user_id' => $user->id,
            'client_id' => $client->id,
            'invoice_number' => 'INV-'.date('Ymd').'-'.str_pad(Invoice::where('user_id', $user->id)->count() + 1, 4, '0', STR_PAD_LEFT),
            'date' => now()->toDateString(),
            'due_date' => now()->addDays(30)->toDateString(),
            'status' => 'draft',
            'vat_rate' => $user->vat_rate ?? 24,
            'currency' => $user->currency ?? 'EUR',
            'notes' => null,
        ]);

        \Log::info('Invoice created', ['invoice_id' => $invoice->id]);

        // Create invoice items from tasks
        foreach ($tasks as $task) {
            $hours = $task->timeEntries->sum('hours');
            $amount = $hours * $hourlyRate;

            \Log::info('Creating invoice item', [
                'task_id' => $task->id,
                'hours' => $hours,
                'amount' => $amount,
            ]);

            $invoice->items()->create([
                'description' => $task->name,
                'quantity' => $hours,
                'unit_price' => $hourlyRate,
                'amount' => $amount,
            ]);

            // Update task with invoice reference
            $task->update([
                'invoice_id' => $invoice->id,
                'invoice_status' => 'draft',
            ]);
        }

        \Log::info('Redirecting to invoice edit', ['invoice_id' => $invoice->id]);

        return redirect()->route('invoices.edit', $invoice->id)
            ->with('success', 'Το τιμολόγιο δημιουργήθηκε επιτυχώς');
    }
}
