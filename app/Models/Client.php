<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'email',
        'phone',
        'hourly_rate',
        'status',
        'company_name',
        'tax_id',
        'address',
        'city',
        'postal_code',
        'country',
        'contact_person',
        'payment_terms',
        'archived',
        'archived_at',
    ];

    protected $casts = [
        'hourly_rate' => 'decimal:2',
        'archived' => 'boolean',
        'archived_at' => 'datetime',
    ];

    /**
     * Get the user that owns the client.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the projects for the client.
     */
    public function projects()
    {
        return $this->hasMany(Project::class);
    }

    /**
     * Get the invoices for the client.
     */
    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }
}
