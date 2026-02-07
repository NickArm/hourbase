<?php

namespace Tests\Feature;

use App\Models\Client;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private Client $client;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->client = Client::factory()->create(['user_id' => $this->user->id]);
    }

    public function test_user_can_create_project(): void
    {
        $this->actingAs($this->user);

        $projectData = [
            'client_id' => $this->client->id,
            'name' => 'Test Project',
            'description' => 'Test description',
            'estimated_hours' => 100,
            'status' => 'planning',
            'start_date' => '2026-01-01',
            'end_date' => '2026-12-31',
        ];

        $response = $this->post(route('projects.store'), $projectData);

        $response->assertRedirect(route('projects.index'));
        $this->assertDatabaseHas('projects', [
            'name' => 'Test Project',
            'client_id' => $this->client->id,
        ]);
    }

    public function test_user_can_update_project(): void
    {
        $this->actingAs($this->user);

        $project = Project::factory()->create(['client_id' => $this->client->id]);

        $updatedData = [
            'client_id' => $this->client->id,
            'name' => 'Updated Project',
            'description' => 'Updated description',
            'estimated_hours' => 150,
            'status' => 'in_progress',
            'start_date' => '2026-01-01',
            'end_date' => '2026-12-31',
        ];

        $response = $this->put(route('projects.update', $project), $updatedData);

        $response->assertRedirect(route('projects.index'));
        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'name' => 'Updated Project',
            'status' => 'in_progress',
        ]);
    }

    public function test_project_end_date_must_be_after_start_date(): void
    {
        $this->actingAs($this->user);

        $projectData = [
            'client_id' => $this->client->id,
            'name' => 'Test Project',
            'status' => 'planning',
            'start_date' => '2026-12-31',
            'end_date' => '2026-01-01',
        ];

        $response = $this->post(route('projects.store'), $projectData);

        $response->assertSessionHasErrors(['end_date']);
    }

    public function test_user_cannot_create_project_for_other_users_client(): void
    {
        $this->actingAs($this->user);

        $otherUser = User::factory()->create();
        $otherClient = Client::factory()->create(['user_id' => $otherUser->id]);

        $projectData = [
            'client_id' => $otherClient->id,
            'name' => 'Test Project',
            'status' => 'planning',
        ];

        $response = $this->post(route('projects.store'), $projectData);

        $response->assertStatus(404);
    }
}
