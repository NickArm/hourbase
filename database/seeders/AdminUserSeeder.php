<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'armenisnick@gmail.com'],
            [
                'name' => 'Armenis Nick',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'is_active' => true,
                'currency' => 'EUR',
                'vat_rate' => 24,
                'default_hourly_rate' => 0,
            ]
        );

        User::firstOrCreate(
            ['email' => 'demo@example.com'],
            [
                'name' => 'Demo User',
                'password' => Hash::make('Password'),
                'role' => 'user',
                'is_active' => true,
                'currency' => 'EUR',
                'vat_rate' => 24,
                'default_hourly_rate' => 45,
            ]
        );
    }
}
