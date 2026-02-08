<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientApiController;
use App\Http\Controllers\Api\InvoiceApiController;
use App\Http\Controllers\Api\ProjectApiController;
use App\Http\Controllers\Api\TagApiController;
use App\Http\Controllers\Api\TaskApiController;
use App\Http\Controllers\Api\TimeEntryApiController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/clients', [ClientApiController::class, 'index']);
    Route::get('/clients/{client}', [ClientApiController::class, 'show']);

    Route::get('/projects', [ProjectApiController::class, 'index']);
    Route::get('/projects/{project}', [ProjectApiController::class, 'show']);

    Route::get('/tasks', [TaskApiController::class, 'index']);
    Route::get('/tasks/{task}', [TaskApiController::class, 'show']);

    Route::get('/time-entries', [TimeEntryApiController::class, 'index']);
    Route::get('/time-entries/{timeEntry}', [TimeEntryApiController::class, 'show']);

    Route::get('/invoices', [InvoiceApiController::class, 'index']);
    Route::get('/invoices/{invoice}', [InvoiceApiController::class, 'show']);

    Route::get('/tags', [TagApiController::class, 'index']);
    Route::get('/tags/{tag}', [TagApiController::class, 'show']);
});
