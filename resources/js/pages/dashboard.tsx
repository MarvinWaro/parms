import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, router } from '@inertiajs/react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, DollarSign, Package, AlertCircle, Calendar, Banknote } from 'lucide-react';
import { useState } from 'react';
import UsersTable from '@/components/dashboard/users-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
    avatar: string;
};

type AnalyticsTotals = {
    properties: number;
    users: number;
    locations: number;
    total_value: number;
    property_growth: number;
    user_growth: number;
};

type PropertyOverTime = {
    date: string;
    properties: number;
    cumulative: number;
};

type RecentActivity = {
    id: string;
    item_name: string;
    property_number: string;
    user: string;
    location: string;
    created_at: string;
    created_date: string;
};

type FundDistribution = {
    fund: string;
    count: number;
    total_value: number;
};

type Analytics = {
    totals: AnalyticsTotals;
    properties_over_time: PropertyOverTime[];
    recent_activities: RecentActivity[];
    fund_distribution: FundDistribution[];
};

type PageProps = {
    users?: User[];
    analytics: Analytics;
    filters: {
        from_date: string;
        to_date: string;
    };
};

export default function Dashboard() {
    const { props } = usePage<PageProps>();
    const { users = [], analytics, filters } = props;
    const [timeRange, setTimeRange] = useState("90d");

    // Safe data access with fallbacks
    const safeAnalytics = {
        totals: analytics?.totals || {
            properties: 0,
            users: 0,
            locations: 0,
            total_value: 0,
            property_growth: 0,
            user_growth: 0,
        },
        properties_over_time: analytics?.properties_over_time || [],
        recent_activities: analytics?.recent_activities || [],
        fund_distribution: analytics?.fund_distribution || [],
    };

    // Safe filters with fallbacks
    const safeFilters = {
        from_date: filters?.from_date || new Date().toISOString().split('T')[0],
        to_date: filters?.to_date || new Date().toISOString().split('T')[0],
    };

    // Filter chart data based on selected time range with safety check
    const filteredData = safeAnalytics.properties_over_time.length > 0
        ? safeAnalytics.properties_over_time.filter((item, index) => {
            if (timeRange === "30d") {
                return index >= safeAnalytics.properties_over_time.length - 30;
            } else if (timeRange === "7d") {
                return index >= safeAnalytics.properties_over_time.length - 7;
            }
            return true; // 90d - show all
        })
        : [];

    // Format currency to Philippine Peso
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount || 0);
    };

    // Format growth percentage
    const formatGrowth = (growth: number) => {
        const isPositive = (growth || 0) >= 0;
        return (
            <span className={isPositive ? "text-green-600" : "text-red-600"}>
                {isPositive ? "+" : ""}{growth || 0}%
            </span>
        );
    };

    // Handle activity date range filter change
    const handleDateRangeChange = (field: 'from_date' | 'to_date', value: string) => {
        const newFilters = { ...safeFilters, [field]: value };

        router.get('/dashboard', newFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Format date safely
    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) {
                return 'Invalid Date';
            }
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return 'Invalid Date';
        }
    };

    // Show loading state if no analytics data
    if (!analytics) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Dashboard" />
                <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                    <div className="flex items-center justify-center p-8">
                        <div className="text-center">
                            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium">Loading Analytics...</h3>
                            <p className="text-muted-foreground">Please wait while we load your dashboard data.</p>
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 overflow-x-auto mb-7">
                {/* Stats Cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Asset Value</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(safeAnalytics.totals.total_value)}</div>
                            <p className="text-xs text-muted-foreground">
                                Total acquisition cost of all properties
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{safeAnalytics.totals.properties.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                {formatGrowth(safeAnalytics.totals.property_growth)} from last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Staff Members</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{safeAnalytics.totals.users}</div>
                            <p className="text-xs text-muted-foreground">
                                {formatGrowth(safeAnalytics.totals.user_growth)} from last month
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Property Tracking Over Time - Full Width */}
                {filteredData.length > 0 ? (
                    <Card>
                        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                            <div className="grid flex-1 gap-1">
                                <CardTitle>Property Registration Timeline</CardTitle>
                                <CardDescription>
                                    Showing property registrations and cumulative total
                                </CardDescription>
                            </div>
                            <Select value={timeRange} onValueChange={setTimeRange}>
                                <SelectTrigger
                                    className="w-[160px] rounded-lg sm:ml-auto"
                                    aria-label="Select a value"
                                >
                                    <SelectValue placeholder="Last 3 months" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="90d" className="rounded-lg">
                                        Last 3 months
                                    </SelectItem>
                                    <SelectItem value="30d" className="rounded-lg">
                                        Last 30 days
                                    </SelectItem>
                                    <SelectItem value="7d" className="rounded-lg">
                                        Last 7 days
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </CardHeader>
                        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                            <ResponsiveContainer width="100%" height={400}>
                                <AreaChart data={filteredData}>
                                    <defs>
                                        <linearGradient id="fillProperties" x1="0" y1="0" x2="0" y2="1">
                                            <stop
                                                offset="5%"
                                                stopColor="#8884d8"
                                                stopOpacity={0.8}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#8884d8"
                                                stopOpacity={0.1}
                                            />
                                        </linearGradient>
                                        <linearGradient id="fillCumulative" x1="0" y1="0" x2="0" y2="1">
                                            <stop
                                                offset="5%"
                                                stopColor="#82ca9d"
                                                stopOpacity={0.8}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#82ca9d"
                                                stopOpacity={0.1}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        minTickGap={32}
                                        tickFormatter={(value) => {
                                            const date = new Date(value);
                                            return date.toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                            });
                                        }}
                                    />
                                    <YAxis tickLine={false} axisLine={false} />
                                    <Tooltip
                                        cursor={false}
                                        labelFormatter={(value) => {
                                            return new Date(value).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            });
                                        }}
                                    />
                                    <Area
                                        dataKey="properties"
                                        type="natural"
                                        fill="url(#fillProperties)"
                                        stroke="#8884d8"
                                        stackId="a"
                                        name="Daily Registrations"
                                    />
                                    <Area
                                        dataKey="cumulative"
                                        type="natural"
                                        fill="url(#fillCumulative)"
                                        stroke="#82ca9d"
                                        stackId="b"
                                        name="Total Properties"
                                    />
                                    <Legend />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>Property Registration Timeline</CardTitle>
                            <CardDescription>No timeline data available</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[400px] flex items-center justify-center">
                            <div className="text-center">
                                <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                <p className="text-sm text-muted-foreground">No property registration data found</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Recent Activities with Date Range Filter */}
                <Card>
                    <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                        <div className="grid flex-1 gap-1">
                            <CardTitle>Recent Property Registrations</CardTitle>
                            <CardDescription>
                                Property transactions within selected date range (max 50 results)
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium">From:</label>
                                <input
                                    type="date"
                                    value={safeFilters.from_date}
                                    onChange={(e) => handleDateRangeChange('from_date', e.target.value)}
                                    className="rounded-lg border border-input bg-background px-3 py-1 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium">To:</label>
                                <input
                                    type="date"
                                    value={safeFilters.to_date}
                                    onChange={(e) => handleDateRangeChange('to_date', e.target.value)}
                                    className="rounded-lg border border-input bg-background px-3 py-1 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {safeAnalytics.recent_activities.length > 0 ? (
                            <div className="space-y-4">
                                <div className="text-sm text-muted-foreground mb-4">
                                    Showing {safeAnalytics.recent_activities.length} properties registered between{' '}
                                    {formatDate(safeFilters.from_date)} and{' '}
                                    {formatDate(safeFilters.to_date)}
                                </div>
                                {safeAnalytics.recent_activities.map((activity) => (
                                    <div key={activity.id} className="flex items-center space-x-4 rounded-lg border p-3">
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {activity.item_name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {activity.property_number} • {activity.location} • Assigned to {activity.user}
                                            </p>
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {activity.created_at}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center p-8">
                                <div className="text-center">
                                    <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-sm text-muted-foreground">
                                        No property registrations found between{' '}
                                        {formatDate(safeFilters.from_date)} and{' '}
                                        {formatDate(safeFilters.to_date)}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Try adjusting the date range to see more activities
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Fund Distribution */}
                {safeAnalytics.fund_distribution.length > 0 && (
                    <div className="grid gap-6 md:grid-cols-2">
                        {safeAnalytics.fund_distribution.map((fund) => (
                            <Card key={fund.fund}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">{fund.fund}</CardTitle>
                                    <Banknote className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{fund.count} properties</div>
                                    <p className="text-xs text-muted-foreground">
                                        Total value: {formatCurrency(fund.total_value)}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Users Table Component - Full Width */}
                <UsersTable users={users} />
            </div>
        </AppLayout>
    );
}
