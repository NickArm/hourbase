<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'name',
        'description',
        'estimated_hours',
        'status',
        'start_date',
        'end_date',
        'archived',
        'archived_at',
    ];

    protected $casts = [
        'estimated_hours' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
        'archived' => 'boolean',
        'archived_at' => 'datetime',
    ];

    /**
     * Get the client that owns the project.
     */
    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    /**
     * Get the tasks for the project.
     */
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    /**
     * Scope a query to only include projects belonging to a specific user.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  int|null  $userId
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeForUser($query, $userId = null)
    {
        $userId = $userId ?? auth()->id();

        return $query->whereHas('client', function ($q) use ($userId) {
            $q->where('user_id', $userId);
        });
    }
}
