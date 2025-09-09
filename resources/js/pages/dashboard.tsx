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
import { Head, usePage } from '@inertiajs/react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { TrendingUp, Users, DollarSign, Package, MapPin, Activity } from 'lucide-react';
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

type PropertyCondition = {
    condition: string;
    count: number;
    fill: string;
};

type PropertyLocation = {
    location: string;
    total: number;
    percentage: number;
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
};

type FundDistribution = {
    fund: string;
    count: number;
    total_value: number;
};

type Analytics = {
    totals: AnalyticsTotals;
    properties_by_condition: PropertyCondition[];
    properties_by_location: PropertyLocation[];
    properties_over_time: PropertyOverTime[];
    recent_activities: RecentActivity[];
    fund_distribution: FundDistribution[];
};

type PageProps = {
    users?: User[];
    analytics: Analytics;
};

export default function Dashboard() {
    const { props } = usePage<PageProps>();
    const { users = [], analytics } = props;
    const [timeRange, setTimeRange] = useState("90d");

    // Filter chart data based on selected time range
    const filteredData = analytics.properties_over_time.filter((item, index) => {
        if (timeRange === "30d") {
            return index >= analytics.properties_over_time.length - 30;
        } else if (timeRange === "7d") {
            return index >= analytics.properties_over_time.length - 7;
        }
        return true; // 90d - show all
    });

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Format growth percentage
    const formatGrowth = (growth: number) => {
        const isPositive = growth >= 0;
        return (
            <span className={isPositive ? "text-green-600" : "text-red-600"}>
                {isPositive ? "+" : ""}{growth}%
            </span>
        );
    };

    // Prepare radar chart data (take top 6 locations)
    const radarData = analytics.properties_by_location.slice(0, 6).map(item => ({
        location: item.location.length > 10 ? item.location.substring(0, 10) + '...' : item.location,
        properties: item.total,
        percentage: item.percentage,
    }));

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
                            <div className="text-2xl font-bold">{formatCurrency(analytics.totals.total_value)}</div>
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
                            <div className="text-2xl font-bold">{analytics.totals.properties.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                {formatGrowth(analytics.totals.property_growth)} from last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Staff Members</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analytics.totals.users}</div>
                            <p className="text-xs text-muted-foreground">
                                {formatGrowth(analytics.totals.user_growth)} from last month
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Property Tracking Over Time - Full Width */}
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

                {/* Pie Chart and Radar Chart Row */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Pie Chart - Properties by Condition */}
                    <Card className="flex flex-col">
                        <CardHeader className="items-center pb-0">
                            <CardTitle>Properties by Condition</CardTitle>
                            <CardDescription>Current condition status distribution</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 pb-0">
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Tooltip
                                        formatter={(value, name) => [`${value} properties`, name]}
                                    />
                                    <Pie
                                        data={analytics.properties_by_condition}
                                        dataKey="count"
                                        nameKey="condition"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        label={({ condition, count, percent }) =>
                                            `${condition}: ${count} (${(percent * 100).toFixed(0)}%)`
                                        }
                                    >
                                        {analytics.properties_by_condition.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                        <CardContent className="flex-col gap-2 text-sm pt-0">
                            <div className="flex items-center gap-2 leading-none font-medium">
                                Total: {analytics.totals.properties} properties <Activity className="h-4 w-4" />
                            </div>
                            <div className="text-muted-foreground leading-none">
                                Property condition distribution
                            </div>
                        </CardContent>
                    </Card>

                    {/* Radar Chart - Properties by Location */}
                    <Card>
                        <CardHeader className="items-center pb-4">
                            <CardTitle>Properties by Location</CardTitle>
                            <CardDescription>
                                Distribution across {analytics.totals.locations} locations
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-0">
                            <ResponsiveContainer width="100%" height={250}>
                                <RadarChart
                                    data={radarData}
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        bottom: 10,
                                        left: 10,
                                    }}
                                >
                                    <Tooltip
                                        formatter={(value, name) => [
                                            name === 'properties' ? `${value} properties` : `${value}%`,
                                            name === 'properties' ? 'Count' : 'Percentage'
                                        ]}
                                    />
                                    <PolarAngleAxis dataKey="location" />
                                    <PolarGrid />
                                    <Radar
                                        dataKey="properties"
                                        stroke="#8884d8"
                                        fill="#8884d8"
                                        fillOpacity={0.6}
                                        name="Properties Count"
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </CardContent>
                        <CardContent className="flex-col gap-2 text-sm pt-0">
                            <div className="flex items-center gap-2 leading-none font-medium">
                                Top {radarData.length} locations shown <MapPin className="h-4 w-4" />
                            </div>
                            <div className="text-muted-foreground flex items-center gap-2 leading-none">
                                {analytics.totals.locations} total locations
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activities */}
                {analytics.recent_activities.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Property Registrations</CardTitle>
                            <CardDescription>Latest 10 properties added to the system</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {analytics.recent_activities.map((activity) => (
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
                        </CardContent>
                    </Card>
                )}

                {/* Fund Distribution */}
                {analytics.fund_distribution.length > 0 && (
                    <div className="grid gap-6 md:grid-cols-2">
                        {analytics.fund_distribution.map((fund) => (
                            <Card key={fund.fund}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">{fund.fund}</CardTitle>
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
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
