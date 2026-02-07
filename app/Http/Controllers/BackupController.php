<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Project;
use App\Models\Tag;
use App\Models\Task;
use App\Models\TimeEntry;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Facades\Excel;

class BackupController extends Controller
{
    /**
     * Download full backup of all user data as JSON
     */
    public function download()
    {
        $user = Auth::user();

        // Collect all user data
        $backup = [
            'created_at' => now()->toIso8601String(),
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'settings' => $user->only([
                    'default_hourly_rate', 'currency', 'vat_rate',
                    'company_name', 'tax_id', 'address', 'city',
                    'postal_code', 'country', 'phone', 'business_email',
                    'bank_details', 'logo_url',
                ]),
            ],
            'clients' => Client::where('user_id', $user->id)->get(),
            'projects' => Project::forUser($user->id)->with('client')->get(),
            'tasks' => Task::forUser($user->id)->with(['tags', 'project.client'])->get(),
            'time_entries' => TimeEntry::where('user_id', $user->id)->get(),
            'invoices' => Invoice::where('user_id', $user->id)->with('items')->get(),
            'tags' => Tag::whereHas('user', function ($q) use ($user) {
                $q->where('id', $user->id);
            })->get(),
        ];

        $filename = 'backup-'.now()->format('Y-m-d-His').'.json';

        return response()->json($backup)
            ->header('Content-Type', 'application/json')
            ->header('Content-Disposition', 'attachment; filename="'.$filename.'"');
    }

    /**
     * Restore backup from uploaded JSON file
     */
    public function restore(Request $request)
    {
        $request->validate([
            'backup_file' => 'required|file|mimes:json|max:51200', // 50MB max
        ]);

        try {
            $file = $request->file('backup_file');
            $json = file_get_contents($file->getRealPath());
            $backup = json_decode($json, true);

            if (! $backup || ! isset($backup['user'])) {
                return redirect()->back()->with('error', 'Invalid backup file format');
            }

            $user = Auth::user();

            DB::transaction(function () use ($backup, $user) {
                // Delete existing data
                Invoice::where('user_id', $user->id)->delete();
                TimeEntry::where('user_id', $user->id)->delete();
                Task::forUser($user->id)->delete();
                Project::forUser($user->id)->delete();
                Client::where('user_id', $user->id)->delete();
                Tag::whereHas('user', function ($q) use ($user) {
                    $q->where('id', $user->id);
                })->delete();

                // Restore data
                if (isset($backup['clients'])) {
                    foreach ($backup['clients'] as $clientData) {
                        Client::create(array_merge($clientData, ['user_id' => $user->id]));
                    }
                }

                if (isset($backup['tags'])) {
                    foreach ($backup['tags'] as $tagData) {
                        $tag = Tag::create($tagData);
                        $tag->user()->attach($user->id);
                    }
                }

                if (isset($backup['projects'])) {
                    foreach ($backup['projects'] as $projectData) {
                        $tags = $projectData['tags'] ?? [];
                        unset($projectData['tags']);

                        $project = Project::create($projectData);

                        if (! empty($tags)) {
                            $tagIds = collect($tags)->pluck('id')->toArray();
                            $project->tags()->sync($tagIds);
                        }
                    }
                }

                if (isset($backup['tasks'])) {
                    foreach ($backup['tasks'] as $taskData) {
                        $tags = $taskData['tags'] ?? [];
                        unset($taskData['tags']);

                        $task = Task::create($taskData);

                        if (! empty($tags)) {
                            $tagIds = collect($tags)->pluck('id')->toArray();
                            $task->tags()->sync($tagIds);
                        }
                    }
                }

                if (isset($backup['time_entries'])) {
                    foreach ($backup['time_entries'] as $entryData) {
                        TimeEntry::create(array_merge($entryData, ['user_id' => $user->id]));
                    }
                }

                if (isset($backup['invoices'])) {
                    foreach ($backup['invoices'] as $invoiceData) {
                        $items = $invoiceData['items'] ?? [];
                        unset($invoiceData['items']);

                        $invoice = Invoice::create(array_merge($invoiceData, ['user_id' => $user->id]));

                        foreach ($items as $itemData) {
                            InvoiceItem::create(array_merge($itemData, ['invoice_id' => $invoice->id]));
                        }
                    }
                }

                // Update user settings
                if (isset($backup['user']['settings'])) {
                    $user->update($backup['user']['settings']);
                }
            });

            return redirect()->route('settings.index')->with('success', 'Backup restored successfully');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to restore backup: '.$e->getMessage());
        }
    }

    /**
     * Export specific data type to Excel
     */
    public function export(Request $request)
    {
        $type = $request->get('type', 'clients');
        $user = Auth::user();
        $filename = $type.'-export-'.now()->format('Y-m-d-His').'.xlsx';

        switch ($type) {
            case 'clients':
                return $this->exportClients($user, $filename);

            case 'projects':
                return $this->exportProjects($user, $filename);

            case 'invoices':
                return $this->exportInvoices($user, $filename);

            case 'time-entries':
                return $this->exportTimeEntries($user, $filename);

            default:
                return redirect()->back()->with('error', 'Invalid export type');
        }
    }

    private function exportClients($user, $filename)
    {
        $clients = Client::where('user_id', $user->id)->get()->map(function ($client) {
            return [
                'ID' => $client->id,
                'Name' => $client->name,
                'Company Name' => $client->company_name,
                'Email' => $client->email,
                'Phone' => $client->phone,
                'Tax ID' => $client->tax_id,
                'Address' => $client->address,
                'City' => $client->city,
                'Postal Code' => $client->postal_code,
                'Country' => $client->country,
                'Hourly Rate' => $client->hourly_rate,
                'Archived' => $client->archived ? 'Yes' : 'No',
                'Created' => $client->created_at->format('Y-m-d H:i:s'),
            ];
        });

        return Excel::download(new class($clients) implements FromCollection, WithHeadings
        {
            protected $data;

            public function __construct($data)
            {
                $this->data = $data;
            }

            public function collection()
            {
                return $this->data;
            }

            public function headings(): array
            {
                return $this->data->isNotEmpty() ? array_keys($this->data->first()) : [];
            }
        }, $filename);
    }

    private function exportProjects($user, $filename)
    {
        $projects = Project::forUser($user->id)->with(['client', 'tasks'])->get();

        // Create sheets for projects and tasks
        return Excel::download(new class($projects) implements WithMultipleSheets
        {
            protected $projects;

            public function __construct($projects)
            {
                $this->projects = $projects;
            }

            public function sheets(): array
            {
                $sheets = [];

                // Projects sheet
                $projectsData = $this->projects->map(function ($project) {
                    return [
                        'ID' => $project->id,
                        'Client' => $project->client->name,
                        'Name' => $project->name,
                        'Description' => $project->description,
                        'Status' => $project->status,
                        'Archived' => $project->archived ? 'Yes' : 'No',
                        'Created' => $project->created_at->format('Y-m-d H:i:s'),
                    ];
                });

                $sheets[] = new class($projectsData, 'Projects') implements FromCollection, WithHeadings, WithTitle
                {
                    protected $data;

                    protected $sheetTitle;

                    public function __construct($data, $title)
                    {
                        $this->data = $data;
                        $this->sheetTitle = $title;
                    }

                    public function collection()
                    {
                        return $this->data;
                    }

                    public function headings(): array
                    {
                        return $this->data->isNotEmpty() ? array_keys($this->data->first()) : [];
                    }

                    public function title(): string
                    {
                        return $this->sheetTitle;
                    }
                };

                // Tasks sheet
                $tasksData = collect();
                foreach ($this->projects as $project) {
                    foreach ($project->tasks as $task) {
                        $tasksData->push([
                            'Task ID' => $task->id,
                            'Project' => $project->name,
                            'Task Name' => $task->name,
                            'Description' => $task->description,
                            'Status' => $task->status,
                            'Billable' => $task->billable ? 'Yes' : 'No',
                            'Paid' => $task->paid ? 'Yes' : 'No',
                            'Estimated Hours' => $task->estimated_hours,
                            'Due Date' => $task->due_date ? $task->due_date->format('Y-m-d') : '',
                            'Archived' => $task->archived ? 'Yes' : 'No',
                        ]);
                    }
                }

                $sheets[] = new class($tasksData, 'Tasks') implements FromCollection, WithHeadings, WithTitle
                {
                    protected $data;

                    protected $sheetTitle;

                    public function __construct($data, $title)
                    {
                        $this->data = $data;
                        $this->sheetTitle = $title;
                    }

                    public function collection()
                    {
                        return $this->data;
                    }

                    public function headings(): array
                    {
                        return $this->data->isNotEmpty() ? array_keys($this->data->first()) : [];
                    }

                    public function title(): string
                    {
                        return $this->sheetTitle;
                    }
                };

                return $sheets;
            }
        }, $filename);
    }

    private function exportInvoices($user, $filename)
    {
        $invoices = Invoice::where('user_id', $user->id)->with(['client', 'items'])->get()->map(function ($invoice) {
            return [
                'Invoice Number' => $invoice->invoice_number,
                'Client' => $invoice->client->name,
                'Date' => $invoice->date->format('Y-m-d'),
                'Due Date' => $invoice->due_date->format('Y-m-d'),
                'Status' => ucfirst($invoice->status),
                'Subtotal' => $invoice->subtotal,
                'VAT Rate' => $invoice->vat_rate.'%',
                'VAT Amount' => $invoice->vat_amount,
                'Total Amount' => $invoice->total_amount,
                'Currency' => $invoice->currency,
                'Payment Method' => $invoice->payment_method,
                'Payment Date' => $invoice->payment_date ? $invoice->payment_date->format('Y-m-d') : '',
                'Created' => $invoice->created_at->format('Y-m-d H:i:s'),
            ];
        });

        return Excel::download(new class($invoices) implements FromCollection, WithHeadings
        {
            protected $data;

            public function __construct($data)
            {
                $this->data = $data;
            }

            public function collection()
            {
                return $this->data;
            }

            public function headings(): array
            {
                return $this->data->isNotEmpty() ? array_keys($this->data->first()) : [];
            }
        }, $filename);
    }

    private function exportTimeEntries($user, $filename)
    {
        $entries = TimeEntry::where('user_id', $user->id)->with(['task.project.client'])->get()->map(function ($entry) {
            return [
                'ID' => $entry->id,
                'Date' => $entry->date->format('Y-m-d'),
                'Client' => $entry->task->project->client->name ?? 'N/A',
                'Project' => $entry->task->project->name ?? 'N/A',
                'Task' => $entry->task->name,
                'Hours' => $entry->hours,
                'Notes' => $entry->notes,
                'Created' => $entry->created_at->format('Y-m-d H:i:s'),
            ];
        });

        return Excel::download(new class($entries) implements FromCollection, WithHeadings
        {
            protected $data;

            public function __construct($data)
            {
                $this->data = $data;
            }

            public function collection()
            {
                return $this->data;
            }

            public function headings(): array
            {
                return $this->data->isNotEmpty() ? array_keys($this->data->first()) : [];
            }
        }, $filename);
    }
}
