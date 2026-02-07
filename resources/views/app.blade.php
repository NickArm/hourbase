<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="Modern time tracking for freelancers. Link tasks from any tool, track hours, and create invoices instantly. Simple, fast, efficient.">
        <meta name="keywords" content="time tracking software, freelance time tracker, project time tracking, invoice generator, billable hours tracker, time tracking app for freelancers, notion time tracking, trello time tracking, track time by project, freelance invoicing software, client billing software, hourly rate calculator, time entry software, project management time tracker">
        <meta name="theme-color" content="#0F172A">
        <meta property="og:site_name" content="Hourbase">
        <meta property="og:type" content="website">
        <meta property="og:title" content="Hourbase — Track time. Link work. Get paid.">
        <meta property="og:description" content="Modern time tracking for freelancers. Link tasks from any tool, track hours, and create invoices instantly. Simple, fast, efficient.">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="Hourbase — Track time. Link work. Get paid.">
        <meta name="twitter:description" content="Modern time tracking for freelancers. Link tasks from any tool, track hours, and create invoices instantly. Simple, fast, efficient.">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
