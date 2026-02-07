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
        $needsRebuild = false;

        if (! Schema::hasTable('invoice_items')) {
            $needsRebuild = true;
        } else {
            $requiredColumns = ['invoice_id', 'task_id', 'hours', 'rate', 'amount'];
            foreach ($requiredColumns as $column) {
                if (! Schema::hasColumn('invoice_items', $column)) {
                    $needsRebuild = true;
                    break;
                }
            }
        }

        if ($needsRebuild) {
            Schema::dropIfExists('invoice_items');

            Schema::create('invoice_items', function (Blueprint $table) {
                $table->id();
                $table->foreignId('invoice_id')->constrained()->cascadeOnDelete();
                $table->foreignId('task_id')->constrained()->cascadeOnDelete();
                $table->decimal('hours', 5, 2);
                $table->decimal('rate', 10, 2);
                $table->decimal('amount', 10, 2);
                $table->unique(['task_id']);
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoice_items');
    }
};
