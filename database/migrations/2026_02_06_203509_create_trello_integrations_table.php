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
        Schema::create('trello_integrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('trello_user_id')->unique(); // Trello member ID
            $table->string('trello_username');
            $table->string('access_token');
            $table->text('access_token_encrypted')->nullable();
            $table->string('board_id')->nullable(); // Selected board for import
            $table->string('list_id')->nullable(); // Selected list for import
            $table->timestamp('last_synced_at')->nullable();
            $table->json('import_settings')->nullable(); // JSON for custom import options
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trello_integrations');
    }
};
