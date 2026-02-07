<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Legacy placeholder. The actual invoice_items table is created in
        // 2026_02_05_103636_create_invoice_items_table.php to ensure invoices
        // are created first (FK constraint order).
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No-op (table is managed by the later migration).
    }
};
