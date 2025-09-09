<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Property;
use App\Models\Location;
use App\Models\Condition;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // Get users for the table
        $users = User::select('id', 'name', 'email', 'role', 'created_at')
            ->orderByRaw("CASE WHEN role = 'admin' THEN 0 ELSE 1 END")
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'created_at' => $user->created_at->format('M j, Y'),
                    'avatar' => $this->generateAvatar($user->name),
                ];
            });

        // Analytics Data
        $analytics = $this->getAnalyticsData();

        return Inertia::render('dashboard', [
            'users' => $users,
            'analytics' => $analytics,
        ]);
    }

    private function getAnalyticsData(): array
    {
        // Basic Counts
        $totalProperties = Property::count();
        $totalUsers = User::where('role', 'staff')->count();
        $totalLocations = Location::count();
        $totalValue = Property::sum('acquisition_cost') ?? 0;

        // Previous month comparisons
        $lastMonth = Carbon::now()->subMonth();
        $propertiesLastMonth = Property::where('created_at', '>=', $lastMonth)->count();
        $usersLastMonth = User::where('role', 'staff')->where('created_at', '>=', $lastMonth)->count();

        // Calculate percentage changes
        $propertyGrowth = $totalProperties > 0 ?
            round((($propertiesLastMonth / max($totalProperties - $propertiesLastMonth, 1)) * 100), 1) : 0;
        $userGrowth = $totalUsers > 0 ?
            round((($usersLastMonth / max($totalUsers - $usersLastMonth, 1)) * 100), 1) : 0;

        // Properties by condition (for pie chart)
        $propertiesByCondition = DB::table('properties')
            ->join('conditions', 'properties.condition_id', '=', 'conditions.id')
            ->select('conditions.condition as name', DB::raw('count(*) as count'))
            ->whereNull('properties.deleted_at')
            ->groupBy('conditions.id', 'conditions.condition')
            ->get()
            ->map(function ($item, $index) {
                $colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];
                return [
                    'condition' => $item->name,
                    'count' => $item->count,
                    'fill' => $colors[$index % count($colors)]
                ];
            });

        // Properties by location (for radar chart)
        $propertiesByLocation = DB::table('properties')
            ->join('locations', 'properties.location_id', '=', 'locations.id')
            ->select('locations.location as location', DB::raw('count(*) as count'))
            ->whereNull('properties.deleted_at')
            ->groupBy('locations.id', 'locations.location')
            ->orderBy('count', 'desc')
            ->limit(6)
            ->get()
            ->map(function ($item) {
                return [
                    'location' => $item->location,
                    'total' => $item->count,
                    'percentage' => 0 // Will calculate after we have all data
                ];
            });

        // Calculate percentages for location data
        $totalLocationProperties = $propertiesByLocation->sum('total');
        $propertiesByLocation = $propertiesByLocation->map(function ($item) use ($totalLocationProperties) {
            $item['percentage'] = $totalLocationProperties > 0 ?
                round(($item['total'] / $totalLocationProperties) * 100, 1) : 0;
            return $item;
        });

        // Properties added over time (for area chart) - Last 90 days
        $propertiesOverTime = [];
        for ($i = 89; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $count = Property::whereDate('created_at', $date->format('Y-m-d'))->count();

            $propertiesOverTime[] = [
                'date' => $date->format('Y-m-d'),
                'properties' => $count,
                'cumulative' => 0 // Will calculate running total
            ];
        }

        // Calculate cumulative total
        $runningTotal = Property::where('created_at', '<', Carbon::now()->subDays(89))->count();
        foreach ($propertiesOverTime as &$day) {
            $runningTotal += $day['properties'];
            $day['cumulative'] = $runningTotal;
        }

        // Recent activities (last 10 properties)
        $recentActivities = Property::with(['user', 'location'])
            ->latest()
            ->limit(10)
            ->get()
            ->map(function ($property) {
                return [
                    'id' => $property->id,
                    'item_name' => $property->item_name,
                    'property_number' => $property->property_number,
                    'user' => $property->user->name ?? 'Unassigned',
                    'location' => $property->location->location ?? 'No Location',
                    'created_at' => $property->created_at->diffForHumans(),
                ];
            });

        // Fund distribution
        $fundDistribution = DB::table('properties')
            ->select('fund', DB::raw('count(*) as count'), DB::raw('sum(acquisition_cost) as total_value'))
            ->whereNull('deleted_at')
            ->whereNotNull('fund')
            ->groupBy('fund')
            ->get()
            ->map(function ($item) {
                return [
                    'fund' => $item->fund,
                    'count' => $item->count,
                    'total_value' => $item->total_value ?? 0,
                ];
            });

        return [
            'totals' => [
                'properties' => $totalProperties,
                'users' => $totalUsers,
                'locations' => $totalLocations,
                'total_value' => $totalValue,
                'property_growth' => $propertyGrowth,
                'user_growth' => $userGrowth,
            ],
            'properties_by_condition' => $propertiesByCondition,
            'properties_by_location' => $propertiesByLocation,
            'properties_over_time' => $propertiesOverTime,
            'recent_activities' => $recentActivities,
            'fund_distribution' => $fundDistribution,
        ];
    }

    private function generateAvatar(string $name): string
    {
        $initials = collect(explode(' ', $name))
            ->map(fn($word) => strtoupper(substr($word, 0, 1)))
            ->take(2)
            ->implode('');

        return $initials;
    }
}
