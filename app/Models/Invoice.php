<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $fillable = [
        'user_id',
        'client_id',
        'invoice_number',
        'mydata_invoice_number',
        'date',
        'due_date',
        'status',
        'subtotal',
        'vat_rate',
        'vat_amount',
        'total_amount',
        'currency',
        'notes',
        'footer_notes',
        'payment_method',
        'payment_reference',
        'payment_date',
    ];

    protected $casts = [
        'date' => 'date',
        'due_date' => 'date',
        'payment_date' => 'date',
        'subtotal' => 'decimal:2',
        'vat_rate' => 'decimal:2',
        'vat_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
    ];

    /**
     * Get the client that owns the invoice.
     */
    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    /**
     * Get the items for the invoice.
     */
    public function items()
    {
        return $this->hasMany(InvoiceItem::class);
    }

    /**
     * Get the tasks for the invoice.
     */
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::updated(function ($invoice) {
            if ($invoice->status === 'canceled') {
                // Clear invoice association from all tasks
                $invoice->tasks()->update([
                    'invoice_id' => null,
                    'invoice_status' => null,
                ]);
            } else {
                // Update all tasks linked to this invoice with the current status
                $invoice->tasks()->update(['invoice_status' => $invoice->status]);
            }
        });
    }
}
