<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        require_once database_path('seeders/AdminUserSeeder.php');

        $this->call([
            AdminUserSeeder::class,
            DemoDataSeeder::class,
        ]);
    }
}
