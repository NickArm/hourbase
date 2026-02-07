<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (! Schema::hasTable('invoice_items')) {
            return;
        }

        Schema::table('invoice_items', function (Blueprint $table) {
            if (! Schema::hasColumn('invoice_items', 'invoice_id')) {
                $table->unsignedBigInteger('invoice_id')->after('id');
                $table->foreign('invoice_id')->references('id')->on('invoices')->cascadeOnDelete();
            }

            if (! Schema::hasColumn('invoice_items', 'task_id')) {
                $table->unsignedBigInteger('task_id')->after('invoice_id');
                $table->foreign('task_id')->references('id')->on('tasks')->cascadeOnDelete();
            }

            if (! Schema::hasColumn('invoice_items', 'hours')) {
                $table->decimal('hours', 5, 2)->after('task_id');
            }

            if (! Schema::hasColumn('invoice_items', 'rate')) {
                $table->decimal('rate', 10, 2)->after('hours');
            }

            if (! Schema::hasColumn('invoice_items', 'amount')) {
                $table->decimal('amount', 10, 2)->after('rate');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('invoice_items', function (Blueprint $table) {
            if (Schema::hasColumn('invoice_items', 'amount')) {
                $table->dropColumn('amount');
            }
            if (Schema::hasColumn('invoice_items', 'rate')) {
                $table->dropColumn('rate');
            }
            if (Schema::hasColumn('invoice_items', 'hours')) {
                $table->dropColumn('hours');
            }
            if (Schema::hasColumn('invoice_items', 'task_id')) {
                $table->dropForeign(['task_id']);
                $table->dropColumn('task_id');
            }
            if (Schema::hasColumn('invoice_items', 'invoice_id')) {
                $table->dropForeign(['invoice_id']);
                $table->dropColumn('invoice_id');
            }
        });
    }
};
