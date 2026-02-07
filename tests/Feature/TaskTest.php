<?php

namespace Tests\Feature;

use App\Models\Client;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private Client $client;

    private Project $project;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->client = Client::factory()->create(['user_id' => $this->user->id]);
        $this->project = Project::factory()->create(['client_id' => $this->client->id]);
    }

    public function test_user_can_create_task(): void
    {
        $this->actingAs($this->user);

        $taskData = [
            'project_id' => $this->project->id,
            'name' => 'Test Task',
            'description' => 'Test description',
            'external_url' => 'https://example.com/task',
            'billable' => true,
            'estimated_hours' => 5,
            'due_date' => '2026-12-31',
            'status' => 'to_do',
        ];

        $response = $this->post(route('tasks.store'), $taskData);

        $response->assertRedirect(route('tasks.index'));
        $this->assertDatabaseHas('tasks', [
            'name' => 'Test Task',
            'project_id' => $this->project->id,
        ]);
    }

    public function test_task_external_url_must_be_valid(): void
    {
        $this->actingAs($this->user);

        $taskData = [
            'project_id' => $this->project->id,
            'name' => 'Test Task',
            'external_url' => 'not-a-valid-url',
            'status' => 'to_do',
        ];

        $response = $this->post(route('tasks.store'), $taskData);

        $response->assertSessionHasErrors(['external_url']);
    }

    public function test_user_can_update_task_status(): void
    {
        $this->actingAs($this->user);

        $task = Task::factory()->create([
            'project_id' => $this->project->id,
            'status' => 'to_do',
        ]);

        $updatedData = [
            'project_id' => $this->project->id,
            'name' => $task->name,
            'status' => 'done',
        ];

        $response = $this->put(route('tasks.update', $task), $updatedData);

        $response->assertRedirect(route('tasks.index'));
        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'status' => 'done',
        ]);
    }

    public function test_user_cannot_access_other_users_tasks(): void
    {
        $this->actingAs($this->user);

        $otherUser = User::factory()->create();
        $otherClient = Client::factory()->create(['user_id' => $otherUser->id]);
        $otherProject = Project::factory()->create(['client_id' => $otherClient->id]);
        $otherTask = Task::factory()->create(['project_id' => $otherProject->id]);

        $response = $this->get(route('tasks.edit', $otherTask));

        $response->assertStatus(403);
    }
}
