<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StaffDashboardController extends Controller
{
    /**
     * Display the staff dashboard.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('staff-dashboard', [
            'auth' => [
                'user' => $request->user(),
            ],
            // Add any additional data you want to pass to the React component
            // 'recentProperties' => Property::latest()->limit(5)->get(),
            // 'stats' => [
            //     'total_properties' => Property::count(),
            //     'pending_tasks' => Task::where('status', 'pending')->count(),
            // ],
        ]);
    }
}
