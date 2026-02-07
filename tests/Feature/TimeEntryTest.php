<?php

namespace Tests\Feature;

use App\Models\Client;
use App\Models\Project;
use App\Models\Task;
use App\Models\TimeEntry;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TimeEntryTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private Client $client;

    private Project $project;

    private Task $task;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->client = Client::factory()->create(['user_id' => $this->user->id]);
        $this->project = Project::factory()->create(['client_id' => $this->client->id]);
        $this->task = Task::factory()->create(['project_id' => $this->project->id]);
    }

    public function test_user_can_create_time_entry(): void
    {
        $this->actingAs($this->user);

        $timeEntryData = [
            'task_id' => $this->task->id,
            'date' => '2026-02-05',
            'hours' => 3.5,
            'notes' => 'Worked on feature implementation',
        ];

        $response = $this->post(route('time-entries.store'), $timeEntryData);

        $response->assertRedirect(route('time-entries.index'));
        $this->assertDatabaseHas('time_entries', [
            'task_id' => $this->task->id,
            'user_id' => $this->user->id,
            'hours' => 3.5,
        ]);
    }

    public function test_time_entry_hours_must_be_between_025_and_24(): void
    {
        $this->actingAs($this->user);

        // Test too low
        $response = $this->post(route('time-entries.store'), [
            'task_id' => $this->task->id,
            'date' => '2026-02-05',
            'hours' => 0.1,
            'notes' => 'Test',
        ]);
        $response->assertSessionHasErrors(['hours']);

        // Test too high
        $response = $this->post(route('time-entries.store'), [
            'task_id' => $this->task->id,
            'date' => '2026-02-05',
            'hours' => 25,
            'notes' => 'Test',
        ]);
        $response->assertSessionHasErrors(['hours']);
    }

    public function test_user_can_update_time_entry(): void
    {
        $this->actingAs($this->user);

        $timeEntry = TimeEntry::factory()->create([
            'task_id' => $this->task->id,
            'user_id' => $this->user->id,
            'hours' => 2.0,
        ]);

        $updatedData = [
            'task_id' => $this->task->id,
            'date' => $timeEntry->date,
            'hours' => 4.5,
            'notes' => 'Updated notes',
        ];

        $response = $this->put(route('time-entries.update', $timeEntry), $updatedData);

        $response->assertRedirect(route('time-entries.index'));
        $this->assertDatabaseHas('time_entries', [
            'id' => $timeEntry->id,
            'hours' => 4.5,
            'notes' => 'Updated notes',
        ]);
    }

    public function test_user_cannot_edit_other_users_time_entries(): void
    {
        $this->actingAs($this->user);

        $otherUser = User::factory()->create();
        $otherTimeEntry = TimeEntry::factory()->create([
            'task_id' => $this->task->id,
            'user_id' => $otherUser->id,
        ]);

        $response = $this->get(route('time-entries.edit', $otherTimeEntry));

        $response->assertStatus(403);
    }
}
