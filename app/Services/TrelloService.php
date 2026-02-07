<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Http;

class TrelloService
{
    private const TRELLO_API_URL = 'https://api.trello.com/1';

    private const TRELLO_OAUTH_URL = 'https://trello.com/app-key';

    private string $apiKey;

    private string $apiSecret;

    public function __construct()
    {
        $this->apiKey = config('services.trello.key');
        $this->apiSecret = config('services.trello.secret');
    }

    /**
     * Get the OAuth authorization URL for Trello
     */
    public function getAuthorizationUrl(string $redirectUri): string
    {
        $params = [
            'key' => $this->apiKey,
            'name' => config('app.name'),
            'scope' => 'read,write',
            'response_type' => 'token',
            'redirect_uri' => $redirectUri,
            'expiration' => 'never',
        ];

        return 'https://trello.com/app-key/authorize?'.http_build_query($params);
    }

    /**
     * Get user's boards list
     */
    public function getBoards(string $accessToken): array
    {
        try {
            $response = Http::get(self::TRELLO_API_URL.'/members/me/boards', [
                'key' => $this->apiKey,
                'token' => $accessToken,
                'fields' => 'id,name,url',
            ]);

            if ($response->failed()) {
                throw new Exception('Failed to fetch Trello boards: '.$response->body());
            }

            return $response->json();
        } catch (Exception $e) {
            throw new Exception('Error fetching Trello boards: '.$e->getMessage());
        }
    }

    /**
     * Get lists in a specific board
     */
    public function getBoardLists(string $boardId, string $accessToken): array
    {
        try {
            $response = Http::get(self::TRELLO_API_URL."/boards/{$boardId}/lists", [
                'key' => $this->apiKey,
                'token' => $accessToken,
                'fields' => 'id,name,closed',
            ]);

            if ($response->failed()) {
                throw new Exception('Failed to fetch Trello lists: '.$response->body());
            }

            return $response->json();
        } catch (Exception $e) {
            throw new Exception('Error fetching Trello lists: '.$e->getMessage());
        }
    }

    /**
     * Get cards from a specific list
     */
    public function getListCards(string $listId, string $accessToken): array
    {
        try {
            $response = Http::get(self::TRELLO_API_URL."/lists/{$listId}/cards", [
                'key' => $this->apiKey,
                'token' => $accessToken,
                'fields' => 'id,name,desc,due,dueComplete,labels,members',
            ]);

            if ($response->failed()) {
                throw new Exception('Failed to fetch Trello cards: '.$response->body());
            }

            return $response->json();
        } catch (Exception $e) {
            throw new Exception('Error fetching Trello cards: '.$e->getMessage());
        }
    }

    /**
     * Get current user info from Trello
     */
    public function getCurrentUser(string $accessToken): array
    {
        try {
            $response = Http::get(self::TRELLO_API_URL.'/members/me', [
                'key' => $this->apiKey,
                'token' => $accessToken,
                'fields' => 'id,username,fullName,email',
            ]);

            if ($response->failed()) {
                throw new Exception('Failed to fetch Trello user: '.$response->body());
            }

            return $response->json();
        } catch (Exception $e) {
            throw new Exception('Error fetching Trello user: '.$e->getMessage());
        }
    }

    /**
     * Verify if access token is valid
     */
    public function verifyToken(string $accessToken): bool
    {
        try {
            $response = Http::get(self::TRELLO_API_URL.'/members/me', [
                'key' => $this->apiKey,
                'token' => $accessToken,
                'fields' => 'id',
            ]);

            return $response->successful();
        } catch (Exception) {
            return false;
        }
    }
}
