<?php

use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\BackupController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TimeEntryController;
use App\Http\Controllers\TrelloImportController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware(['auth', 'active'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Settings
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
    Route::post('/settings', [SettingsController::class, 'update'])->name('settings.update');

    // Backup & Export
    Route::get('/backup/download', [BackupController::class, 'download'])->name('backup.download');
    Route::post('/backup/restore', [BackupController::class, 'restore'])->name('backup.restore');
    Route::get('/export/data', [BackupController::class, 'export'])->name('export.data');

    // Resource routes
    Route::resource('clients', ClientController::class);
    Route::resource('projects', ProjectController::class);
    Route::resource('tasks', TaskController::class);
    Route::resource('time-entries', TimeEntryController::class);
    Route::resource('tags', TagController::class);
    Route::resource('invoices', InvoiceController::class);

    // Tag suggestions
    Route::get('/tags/suggestions', [TagController::class, 'suggestions'])->name('tags.suggestions');

    // Bulk task operations
    Route::post('/tasks/bulk-assign-tags', [TaskController::class, 'bulkAssignTags'])->name('tasks.bulk-assign-tags');

    // Invoice from tasks
    Route::post('/invoices/create-from-tasks', [InvoiceController::class, 'createFromTasks'])->name('invoices.create-from-tasks');

    // Trello import routes
    Route::get('/trello/authorize', [TrelloImportController::class, 'authorize'])->name('trello.authorize');
    Route::get('/trello/callback', [TrelloImportController::class, 'callback'])->name('trello.callback');
    Route::post('/trello/disconnect', [TrelloImportController::class, 'disconnect'])->name('trello.disconnect');
    Route::get('/trello/boards', [TrelloImportController::class, 'getBoards'])->name('trello.boards');
    Route::get('/trello/lists', [TrelloImportController::class, 'getLists'])->name('trello.lists');
    Route::post('/trello/import', [TrelloImportController::class, 'importCards'])->name('trello.import');

    // Reports routes
    Route::get('/reports/time-tracking', [ReportsController::class, 'timeTracking'])->name('reports.time-tracking');
    Route::get('/reports/projects', [ReportsController::class, 'projects'])->name('reports.projects');
    Route::get('/reports/clients', [ReportsController::class, 'clients'])->name('reports.clients');
});

Route::middleware(['auth', 'active', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/users', [UserManagementController::class, 'index'])->name('users.index');
    Route::post('/users', [UserManagementController::class, 'store'])->name('users.store');
    Route::patch('/users/{user}/toggle-active', [UserManagementController::class, 'toggleActive'])->name('users.toggle-active');
    Route::delete('/users/{user}', [UserManagementController::class, 'destroy'])->name('users.destroy');
});

require __DIR__.'/auth.php';
