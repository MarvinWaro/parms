<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Location;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function index(): Response
    {
        // Fetch only active (not soft-deleted) locations
        $locations = Location::query()
            ->oldest('created_at')  // This orders oldest first (ascending)
            ->get(['id', 'location']);

        return Inertia::render('location/index', [
            'locations' => $locations,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'location' => ['required', 'string', 'min:3', 'max:255'],
        ]);

        Location::create($validated);

        // Redirect back to index so the new row appears
        return redirect()->back()
            ->with('success', 'Location created.');
    }

    public function update(Request $request, Location $location)
    {
        $validated = $request->validate([
            'location' => ['required', 'string', 'min:3', 'max:255'],
        ]);

        $location->update($validated);

        return redirect()->route('location.index')
            ->with('success', 'Location updated.');
    }

    // OPTIONAL: stub for later
    public function destroy(Location $location)
    {
        $location->delete(); // soft delete
        return redirect()->route('location.index')
            ->with('success', 'Location deleted.');
    }
}
