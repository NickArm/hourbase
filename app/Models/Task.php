<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'name',
        'description',
        'external_url',
        'billable',
        'paid',
        'estimated_hours',
        'due_date',
        'status',
        'archived',
        'archived_at',
        'invoice_id',
        'invoice_status',
    ];

    protected $casts = [
        'billable' => 'boolean',
        'paid' => 'boolean',
        'estimated_hours' => 'decimal:2',
        'due_date' => 'date',
        'archived' => 'boolean',
        'archived_at' => 'datetime',
    ];

    /**
     * Get the project that owns the task.
     */
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * Get the time entries for the task.
     */
    public function timeEntries()
    {
        return $this->hasMany(TimeEntry::class);
    }

    /**
     * Get the tags for the task.
     */
    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'tag_task');
    }

    /**
     * Get the invoice that owns the task.
     */
    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }

    /**
     * Scope a query to only include tasks belonging to a specific user.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  int|null  $userId
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeForUser($query, $userId = null)
    {
        $userId = $userId ?? auth()->id();

        return $query->whereHas('project.client', function ($q) use ($userId) {
            $q->where('user_id', $userId);
        });
    }
}
