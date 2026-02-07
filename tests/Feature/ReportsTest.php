<?php

namespace Tests\Feature;

use App\Models\Client;
use App\Models\Project;
use App\Models\Task;
use App\Models\TimeEntry;
use App\Models\User;
use Tests\TestCase;

class ReportsTest extends TestCase
{
    private $user;

    private $client;

    private $project;

    private $task;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->client = Client::factory()->create(['user_id' => $this->user->id]);
        $this->project = Project::factory()->create(['client_id' => $this->client->id]);
        $this->task = Task::factory()->create(['project_id' => $this->project->id]);
    }

    public function test_user_can_view_time_tracking_report()
    {
        TimeEntry::factory()
            ->count(3)
            ->create([
                'task_id' => $this->task->id,
                'user_id' => $this->user->id,
                'hours' => 5,
            ]);

        $response = $this->actingAs($this->user)
            ->get(route('reports.time-tracking'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Reports/TimeTracking')
            ->has('stats')
            ->where('stats.totalHoursMonth', 15)
        );
    }

    public function test_user_can_view_projects_report()
    {
        TimeEntry::factory()
            ->count(2)
            ->create([
                'task_id' => $this->task->id,
                'user_id' => $this->user->id,
                'hours' => 4,
            ]);

        $response = $this->actingAs($this->user)
            ->get(route('reports.projects'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Reports/Projects')
            ->has('projects')
            ->has('stats')
        );
    }

    public function test_user_can_view_clients_report()
    {
        TimeEntry::factory()
            ->create([
                'task_id' => $this->task->id,
                'user_id' => $this->user->id,
                'hours' => 8,
                'billable' => true,
            ]);

        $response = $this->actingAs($this->user)
            ->get(route('reports.clients'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Reports/Clients')
            ->has('clients')
            ->has('stats')
        );
    }

    public function test_guest_cannot_view_reports()
    {
        $response = $this->get(route('reports.time-tracking'));

        $response->assertRedirect(route('login'));
    }

    public function test_user_only_sees_own_data_in_reports()
    {
        $otherUser = User::factory()->create();
        $otherClient = Client::factory()->create(['user_id' => $otherUser->id]);
        $otherProject = Project::factory()->create(['client_id' => $otherClient->id]);
        $otherTask = Task::factory()->create(['project_id' => $otherProject->id]);

        TimeEntry::factory()
            ->create([
                'task_id' => $otherTask->id,
                'user_id' => $otherUser->id,
                'hours' => 10,
            ]);

        TimeEntry::factory()
            ->create([
                'task_id' => $this->task->id,
                'user_id' => $this->user->id,
                'hours' => 5,
            ]);

        $response = $this->actingAs($this->user)
            ->get(route('reports.projects'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->where('stats.totalProjects', 1)
        );
    }
}
