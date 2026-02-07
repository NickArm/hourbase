<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'project_id' => \App\Models\Project::factory(),
            'name' => fake()->sentence(4),
            'description' => fake()->paragraph(),
            'external_url' => fake()->url(),
            'billable' => fake()->boolean(80),
            'estimated_hours' => fake()->numberBetween(1, 40),
            'due_date' => fake()->dateTimeBetween('now', '+1 month'),
            'status' => fake()->randomElement(['to_do', 'in_progress', 'done']),
            'archived' => false,
        ];
    }
}
