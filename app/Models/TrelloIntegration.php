<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrelloIntegration extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'trello_user_id',
        'trello_username',
        'access_token',
        'access_token_encrypted',
        'board_id',
        'list_id',
        'last_synced_at',
        'import_settings',
    ];

    protected $casts = [
        'import_settings' => 'json',
        'last_synced_at' => 'datetime',
    ];

    /**
     * Get the user that owns the Trello integration.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if this integration is currently connected/valid
     */
    public function isConnected(): bool
    {
        return ! is_null($this->access_token) && ! is_null($this->trello_user_id);
    }

    /**
     * Get the decrypted access token
     */
    public function getDecryptedToken(): string
    {
        return decrypt($this->access_token_encrypted ?? $this->access_token);
    }

    /**
     * Set the encrypted access token
     */
    public function setEncryptedToken(string $token): void
    {
        $this->access_token_encrypted = encrypt($token);
        $this->access_token = 'encrypted';
        $this->save();
    }
}
