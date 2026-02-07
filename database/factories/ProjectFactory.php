<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'client_id' => \App\Models\Client::factory(),
            'name' => fake()->sentence(3),
            'description' => fake()->paragraph(),
            'estimated_hours' => fake()->numberBetween(20, 200),
            'status' => fake()->randomElement(['planning', 'in_progress', 'on_hold', 'completed']),
            'start_date' => fake()->dateTimeBetween('-1 month', 'now'),
            'end_date' => fake()->dateTimeBetween('now', '+3 months'),
            'archived' => false,
        ];
    }
}
