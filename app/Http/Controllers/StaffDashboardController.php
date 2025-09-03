<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Property;
use App\Models\Condition;
use Illuminate\Support\Facades\Auth;

class StaffDashboardController extends Controller
{
    /**
     * Display the staff dashboard.
     */
    public function index(Request $request): Response
    {
        $user = Auth::user();

        // Get properties assigned to this staff member
        $properties = Property::with(['location', 'condition'])
            ->where('user_id', $user->id)
            ->latest()
            ->take(5) // Show only recent 5 properties on dashboard
            ->get()
            ->map(function ($property) {
                return [
                    'id' => $property->id,
                    'property_number' => $property->property_number,
                    'item_name' => $property->item_name,
                    'location' => $property->location->location ?? 'N/A',
                    'condition' => $property->condition->condition ?? 'N/A',
                    'qr_code_url' => $property->getQRCodeUrl(),
                    'created_at' => $property->created_at->format('M j, Y'),
                ];
            });

        // Get statistics for this staff member
        $totalProperties = Property::where('user_id', $user->id)->count();

        // Get properties by condition
        $propertiesByCondition = Property::where('user_id', $user->id)
            ->with('condition')
            ->get()
            ->groupBy(function($property) {
                return $property->condition->condition ?? 'Unknown';
            })
            ->map(function($group) {
                return $group->count();
            });

        // Get recent activity (properties updated in last 7 days)
        $recentActivity = Property::where('user_id', $user->id)
            ->where('updated_at', '>=', now()->subDays(7))
            ->count();

        return Inertia::render('staff-dashboard', [
            'auth' => [
                'user' => $user,
            ],
            'properties' => $properties,
            'stats' => [
                'total_properties' => $totalProperties,
                'properties_by_condition' => $propertiesByCondition,
                'recent_activity' => $recentActivity,
            ],
        ]);
    }
}
