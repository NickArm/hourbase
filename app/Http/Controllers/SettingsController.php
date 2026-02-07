<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\TrelloIntegration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SettingsController extends Controller
{
    /**
     * Display the settings page.
     */
    public function index()
    {
        $user = auth()->user();
        $trelloIntegration = TrelloIntegration::where('user_id', $user->id)->first();
        $projects = Project::forUser()
            ->with('client')
            ->where('archived', false)
            ->orderBy('name')
            ->get();

        return Inertia::render('Settings/Index', [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'default_hourly_rate' => $user->default_hourly_rate,
                'currency' => $user->currency,
                'vat_rate' => $user->vat_rate,
                'company_name' => $user->company_name,
                'tax_id' => $user->tax_id,
                'address' => $user->address,
                'city' => $user->city,
                'postal_code' => $user->postal_code,
                'country' => $user->country,
                'phone' => $user->phone,
                'business_email' => $user->business_email,
                'logo_url' => $user->logo_url,
                'bank_details' => $user->bank_details,
            ],
            'trelloIntegration' => $trelloIntegration ? [
                'isConnected' => $trelloIntegration->isConnected(),
                'trello_username' => $trelloIntegration->trello_username,
                'last_synced_at' => $trelloIntegration->last_synced_at,
            ] : null,
            'projects' => $projects,
        ]);
    }

    /**
     * Update user settings.
     */
    public function update(Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'default_hourly_rate' => 'nullable|numeric|min:0|max:99999.99',
            'currency' => 'nullable|string|in:EUR,USD,GBP',
            'vat_rate' => 'nullable|numeric|min:0|max:100',
            'company_name' => 'nullable|string|max:255',
            'tax_id' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:500',
            'city' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'business_email' => 'nullable|email|max:255',
            'bank_details' => 'nullable|string|max:1000',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Handle logo upload
        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($user->logo_url) {
                Storage::disk('public')->delete($user->logo_url);
            }

            $path = $request->file('logo')->store('logos', 'public');
            $validated['logo_url'] = $path;
        }

        $user->update($validated);

        return redirect()->route('settings.index')
            ->with('success', 'Settings updated successfully.');
    }
}
