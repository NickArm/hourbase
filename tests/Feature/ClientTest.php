<?php

namespace Tests\Feature;

use App\Models\Client;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClientTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_user_can_view_clients_index(): void
    {
        $this->actingAs($this->user);

        $response = $this->get(route('clients.index'));

        $response->assertStatus(200);
    }

    public function test_user_can_create_client(): void
    {
        $this->actingAs($this->user);

        $clientData = [
            'name' => 'Test Client',
            'email' => 'test@example.com',
            'phone' => '1234567890',
            'status' => 'active',
        ];

        $response = $this->post(route('clients.store'), $clientData);

        $response->assertRedirect(route('clients.index'));
        $this->assertDatabaseHas('clients', [
            'name' => 'Test Client',
            'email' => 'test@example.com',
            'user_id' => $this->user->id,
        ]);
    }

    public function test_user_can_update_client(): void
    {
        $this->actingAs($this->user);

        $client = Client::factory()->create(['user_id' => $this->user->id]);

        $updatedData = [
            'name' => 'Updated Client Name',
            'email' => 'updated@example.com',
            'phone' => '0987654321',
            'status' => 'active',
        ];

        $response = $this->put(route('clients.update', $client), $updatedData);

        $response->assertRedirect(route('clients.index'));
        $this->assertDatabaseHas('clients', [
            'id' => $client->id,
            'name' => 'Updated Client Name',
            'email' => 'updated@example.com',
        ]);
    }

    public function test_user_can_archive_client(): void
    {
        $this->actingAs($this->user);

        $client = Client::factory()->create(['user_id' => $this->user->id]);

        $response = $this->delete(route('clients.destroy', $client));

        $response->assertRedirect(route('clients.index'));
        $this->assertDatabaseHas('clients', [
            'id' => $client->id,
            'archived' => true,
        ]);
    }

    public function test_user_cannot_view_other_users_clients(): void
    {
        $this->actingAs($this->user);

        $otherUser = User::factory()->create();
        $otherClient = Client::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->get(route('clients.edit', $otherClient));

        $response->assertStatus(403);
    }

    public function test_client_creation_requires_name(): void
    {
        $this->actingAs($this->user);

        $response = $this->post(route('clients.store'), [
            'email' => 'test@example.com',
            'status' => 'active',
        ]);

        $response->assertSessionHasErrors(['name']);
    }
}
