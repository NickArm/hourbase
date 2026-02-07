<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TimeEntry>
 */
class TimeEntryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'task_id' => \App\Models\Task::factory(),
            'user_id' => \App\Models\User::factory(),
            'date' => fake()->dateTimeBetween('-1 week', 'now'),
            'hours' => fake()->randomFloat(2, 0.25, 8),
            'notes' => fake()->sentence(),
            'billable' => fake()->boolean(80),
        ];
    }
}
