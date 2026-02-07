<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Project;
use App\Models\Tag;
use App\Models\Task;
use App\Models\TimeEntry;
use App\Models\User;
use Illuminate\Database\Seeder;

class DemoDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::where('email', 'demo@example.com')->first();

        if (! $user) {
            $this->command->error('Demo user not found. Run AdminUserSeeder first.');

            return;
        }

        // Create Tags
        $tags = [
            'Frontend' => '#3B82F6',
            'Backend' => '#10B981',
            'Design' => '#F59E0B',
            'Bug Fix' => '#EF4444',
            'Feature' => '#8B5CF6',
        ];

        $tagModels = [];
        foreach ($tags as $name => $color) {
            $tagModels[$name] = Tag::create([
                'user_id' => $user->id,
                'name' => $name,
                'color' => $color,
            ]);
        }

        // Create Clients
        $acmeClient = Client::create([
            'user_id' => $user->id,
            'name' => 'Acme Corporation',
            'email' => 'contact@acme.com',
            'phone' => '+30 210 1234567',
            'address' => '1 Acme Street',
            'city' => 'Athens',
            'postal_code' => '105 63',
            'country' => 'Greece',
            'tax_id' => 'EL123456789',
            'description' => 'Large corporate client',
        ]);

        $techClient = Client::create([
            'user_id' => $user->id,
            'name' => 'TechStart Inc',
            'email' => 'hello@techstart.io',
            'phone' => '+30 210 9876543',
            'address' => '42 Innovation Ave',
            'city' => 'Thessaloniki',
            'postal_code' => '546 22',
            'country' => 'Greece',
            'tax_id' => 'EL987654321',
            'description' => 'Startup client - fast-paced projects',
        ]);

        $localClient = Client::create([
            'user_id' => $user->id,
            'name' => 'Local Shop',
            'email' => 'info@localshop.gr',
            'phone' => '+30 211 5555555',
            'address' => '7 Market Street',
            'city' => 'Patras',
            'postal_code' => '262 21',
            'country' => 'Greece',
            'tax_id' => 'EL555555555',
        ]);

        // Create Projects for Acme
        $websiteProject = Project::create([
            'client_id' => $acmeClient->id,
            'name' => 'Corporate Website Redesign',
            'description' => 'Complete redesign of corporate website with modern UI/UX',
            'estimated_hours' => 120,
            'start_date' => '2026-01-15',
            'end_date' => '2026-04-15',
            'status' => 'in_progress',
        ]);

        $mobileProject = Project::create([
            'client_id' => $acmeClient->id,
            'name' => 'Mobile App Development',
            'description' => 'Native iOS and Android mobile application',
            'estimated_hours' => 200,
            'start_date' => '2026-02-01',
            'end_date' => '2026-06-30',
            'status' => 'in_progress',
        ]);

        // Create Projects for TechStart
        $dashboardProject = Project::create([
            'client_id' => $techClient->id,
            'name' => 'Analytics Dashboard',
            'description' => 'Real-time analytics and reporting dashboard',
            'estimated_hours' => 80,
            'start_date' => '2026-01-20',
            'end_date' => '2026-03-20',
            'status' => 'in_progress',
        ]);

        $apiProject = Project::create([
            'client_id' => $techClient->id,
            'name' => 'REST API Development',
            'description' => 'RESTful API with authentication and rate limiting',
            'estimated_hours' => 60,
            'start_date' => '2026-01-10',
            'end_date' => '2026-02-28',
            'status' => 'completed',
        ]);

        // Create Project for Local Shop
        $ecommerceProject = Project::create([
            'client_id' => $localClient->id,
            'name' => 'E-commerce Platform',
            'description' => 'Online store with payment integration',
            'estimated_hours' => 150,
            'start_date' => '2026-03-01',
            'end_date' => '2026-07-31',
            'status' => 'planning',
        ]);

        // Create Tasks for Website Project
        $task1 = Task::create([
            'project_id' => $websiteProject->id,
            'name' => 'Design Homepage Mockup',
            'description' => 'Create high-fidelity mockup for the new homepage',
            'external_url' => 'https://www.figma.com/file/example-homepage-design',
            'billable' => true,
            'estimated_hours' => 8,
            'due_date' => '2026-01-25',
            'status' => 'done',
        ]);
        $task1->tags()->attach([$tagModels['Design']->id]);

        $task2 = Task::create([
            'project_id' => $websiteProject->id,
            'name' => 'Implement Responsive Navigation',
            'description' => 'Build mobile-friendly navigation menu',
            'external_url' => 'https://github.com/acme/website/issues/12',
            'billable' => true,
            'estimated_hours' => 6,
            'due_date' => '2026-02-05',
            'status' => 'in_progress',
        ]);
        $task2->tags()->attach([$tagModels['Frontend']->id, $tagModels['Feature']->id]);

        $task3 = Task::create([
            'project_id' => $websiteProject->id,
            'name' => 'Setup Contact Form Backend',
            'description' => 'Create API endpoint for contact form submissions',
            'billable' => true,
            'estimated_hours' => 4,
            'due_date' => '2026-02-10',
            'status' => 'to_do',
        ]);
        $task3->tags()->attach([$tagModels['Backend']->id]);

        // Create Tasks for Mobile App
        $task4 = Task::create([
            'project_id' => $mobileProject->id,
            'name' => 'User Authentication Flow',
            'description' => 'Implement login, signup, and password reset',
            'external_url' => 'https://www.notion.so/acme/auth-flow-spec',
            'billable' => true,
            'estimated_hours' => 12,
            'due_date' => '2026-02-15',
            'status' => 'in_progress',
        ]);
        $task4->tags()->attach([$tagModels['Backend']->id, $tagModels['Feature']->id]);

        $task5 = Task::create([
            'project_id' => $mobileProject->id,
            'name' => 'Fix Splash Screen on Android',
            'description' => 'Splash screen not displaying correctly on some devices',
            'external_url' => 'https://github.com/acme/mobile-app/issues/45',
            'billable' => false,
            'estimated_hours' => 2,
            'due_date' => '2026-02-08',
            'status' => 'done',
        ]);
        $task5->tags()->attach([$tagModels['Bug Fix']->id]);

        // Create Tasks for Dashboard Project
        $task6 = Task::create([
            'project_id' => $dashboardProject->id,
            'name' => 'Design Chart Components',
            'description' => 'Create reusable chart components with Chart.js',
            'billable' => true,
            'estimated_hours' => 10,
            'due_date' => '2026-02-01',
            'status' => 'done',
        ]);
        $task6->tags()->attach([$tagModels['Frontend']->id, $tagModels['Feature']->id]);

        $task7 = Task::create([
            'project_id' => $dashboardProject->id,
            'name' => 'Real-time Data Updates',
            'description' => 'Implement WebSocket connection for live data',
            'external_url' => 'https://trello.com/c/realtime-updates',
            'billable' => true,
            'estimated_hours' => 8,
            'due_date' => '2026-02-12',
            'status' => 'in_progress',
        ]);
        $task7->tags()->attach([$tagModels['Backend']->id]);

        // Create Tasks for API Project (completed)
        $task8 = Task::create([
            'project_id' => $apiProject->id,
            'name' => 'API Documentation',
            'description' => 'Write comprehensive API documentation with examples',
            'billable' => true,
            'estimated_hours' => 6,
            'due_date' => '2026-02-20',
            'status' => 'done',
        ]);
        $task8->tags()->attach([$tagModels['Backend']->id]);

        // Create Time Entries
        TimeEntry::create([
            'task_id' => $task1->id,
            'user_id' => $user->id,
            'date' => '2026-01-22',
            'hours' => 4.5,
            'notes' => 'Initial mockup design and client feedback',
            'billable' => true,
        ]);

        TimeEntry::create([
            'task_id' => $task1->id,
            'user_id' => $user->id,
            'date' => '2026-01-23',
            'hours' => 3.5,
            'notes' => 'Revisions based on client feedback',
            'billable' => true,
        ]);

        TimeEntry::create([
            'task_id' => $task2->id,
            'user_id' => $user->id,
            'date' => '2026-02-03',
            'hours' => 3.0,
            'notes' => 'Built mobile navigation structure',
            'billable' => true,
        ]);

        TimeEntry::create([
            'task_id' => $task2->id,
            'user_id' => $user->id,
            'date' => '2026-02-04',
            'hours' => 2.5,
            'notes' => 'Added animations and transitions',
            'billable' => true,
        ]);

        TimeEntry::create([
            'task_id' => $task4->id,
            'user_id' => $user->id,
            'date' => '2026-02-06',
            'hours' => 5.0,
            'notes' => 'Implemented login and signup endpoints',
            'billable' => true,
        ]);

        TimeEntry::create([
            'task_id' => $task5->id,
            'user_id' => $user->id,
            'date' => '2026-02-07',
            'hours' => 2.0,
            'notes' => 'Fixed splash screen timing issue',
            'billable' => false,
        ]);

        TimeEntry::create([
            'task_id' => $task6->id,
            'user_id' => $user->id,
            'date' => '2026-01-28',
            'hours' => 6.0,
            'notes' => 'Created bar and line chart components',
            'billable' => true,
        ]);

        TimeEntry::create([
            'task_id' => $task6->id,
            'user_id' => $user->id,
            'date' => '2026-01-29',
            'hours' => 4.0,
            'notes' => 'Added pie chart and customization options',
            'billable' => true,
        ]);

        TimeEntry::create([
            'task_id' => $task7->id,
            'user_id' => $user->id,
            'date' => '2026-02-05',
            'hours' => 4.5,
            'notes' => 'Set up WebSocket server and connection handling',
            'billable' => true,
        ]);

        TimeEntry::create([
            'task_id' => $task8->id,
            'user_id' => $user->id,
            'date' => '2026-02-18',
            'hours' => 6.0,
            'notes' => 'Wrote API documentation with Postman examples',
            'billable' => true,
        ]);

        // Create Invoices
        $invoice1 = Invoice::create([
            'user_id' => $user->id,
            'client_id' => $acmeClient->id,
            'invoice_number' => 'INV-2026-001',
            'date' => '2026-01-31',
            'due_date' => '2026-02-28',
            'subtotal' => 800.00,
            'vat_rate' => 24.00,
            'vat_amount' => 192.00,
            'total_amount' => 992.00,
            'status' => 'paid',
            'notes' => 'Thank you for your business!',
            'payment_date' => '2026-02-15',
        ]);

        InvoiceItem::create([
            'invoice_id' => $invoice1->id,
            'task_id' => $task1->id,
            'hours' => 8.0,
            'rate' => 80.00,
            'amount' => 640.00,
        ]);

        InvoiceItem::create([
            'invoice_id' => $invoice1->id,
            'task_id' => $task5->id,
            'hours' => 2.0,
            'rate' => 80.00,
            'amount' => 160.00,
        ]);

        $invoice2 = Invoice::create([
            'user_id' => $user->id,
            'client_id' => $techClient->id,
            'invoice_number' => 'INV-2026-002',
            'date' => '2026-02-05',
            'due_date' => '2026-03-05',
            'subtotal' => 1600.00,
            'vat_rate' => 24.00,
            'vat_amount' => 384.00,
            'total_amount' => 1984.00,
            'status' => 'sent',
            'notes' => 'Payment terms: Net 30 days',
        ]);

        InvoiceItem::create([
            'invoice_id' => $invoice2->id,
            'task_id' => $task6->id,
            'hours' => 10.0,
            'rate' => 80.00,
            'amount' => 800.00,
        ]);

        InvoiceItem::create([
            'invoice_id' => $invoice2->id,
            'task_id' => $task8->id,
            'hours' => 6.0,
            'rate' => 80.00,
            'amount' => 480.00,
        ]);

        InvoiceItem::create([
            'invoice_id' => $invoice2->id,
            'task_id' => $task7->id,
            'hours' => 4.0,
            'rate' => 80.00,
            'amount' => 320.00,
        ]);

        $invoice3 = Invoice::create([
            'user_id' => $user->id,
            'client_id' => $acmeClient->id,
            'invoice_number' => 'INV-2026-003',
            'date' => '2026-02-10',
            'due_date' => '2026-03-10',
            'subtotal' => 440.00,
            'vat_rate' => 24.00,
            'vat_amount' => 105.60,
            'total_amount' => 545.60,
            'status' => 'draft',
            'notes' => 'Invoice for February work',
        ]);

        InvoiceItem::create([
            'invoice_id' => $invoice3->id,
            'task_id' => $task2->id,
            'hours' => 5.5,
            'rate' => 80.00,
            'amount' => 440.00,
        ]);

        $this->command->info('✅ Demo data created successfully!');
        $this->command->info('');
        $this->command->info('📊 Summary:');
        $this->command->info('   - 3 Clients');
        $this->command->info('   - 5 Projects');
        $this->command->info('   - 8 Tasks with tags');
        $this->command->info('   - 10 Time Entries');
        $this->command->info('   - 3 Invoices with items');
        $this->command->info('   - 5 Tags');
    }
}
