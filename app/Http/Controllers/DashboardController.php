<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Property;
use App\Models\Location;
use App\Models\Condition;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request): Response
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

        // Get activity date range from request (default to last 7 days)
        $fromDate = $request->get('from_date', Carbon::today()->subDays(6)->format('Y-m-d'));
        $toDate = $request->get('to_date', Carbon::today()->format('Y-m-d'));

        // Analytics Data
        $analytics = $this->getAnalyticsData($fromDate, $toDate);

        return Inertia::render('dashboard', [
            'users' => $users,
            'analytics' => $analytics,
            'filters' => [
                'from_date' => $fromDate,
                'to_date' => $toDate,
            ],
        ]);
    }

    private function getAnalyticsData(string $fromDate, string $toDate): array
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

        // Recent activities for date range (limit 50 total, ordered by latest)
        $startDate = Carbon::parse($fromDate)->startOfDay();
        $endDate = Carbon::parse($toDate)->endOfDay();

        $recentActivities = Property::with(['user', 'location'])
            ->whereBetween('created_at', [$startDate, $endDate])
            ->latest()
            ->limit(50)
            ->get()
            ->map(function ($property) {
                return [
                    'id' => $property->id,
                    'item_name' => $property->item_name,
                    'property_number' => $property->property_number,
                    'user' => $property->user->name ?? 'Unassigned',
                    'location' => $property->location->location ?? 'No Location',
                    'created_at' => $property->created_at->format('M j, Y g:i A'),
                    'created_date' => $property->created_at->format('Y-m-d'),
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
