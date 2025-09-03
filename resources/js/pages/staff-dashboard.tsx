import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, Link } from '@inertiajs/react';
import { User, Calendar, FileText, Settings, Package, MapPin, Eye, QrCode, TrendingUp, Activity } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Staff Dashboard',
        href: '/staff-dashboard',
    },
];

type Property = {
    id: string;
    property_number: string;
    item_name: string;
    location: string;
    condition: string;
    qr_code_url: string;
    created_at: string;
};

type PageProps = {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
    properties: Property[];
    stats: {
        total_properties: number;
        properties_by_condition: Record<string, number>;
        recent_activity: number;
    };
};

export default function StaffDashboard() {
    const { props } = usePage<PageProps>();
    const { auth, properties, stats } = props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Staff Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 overflow-x-auto mb-7">

                {/* Welcome Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                            Welcome, {auth.user.name}!
                        </CardTitle>
                        <CardDescription>
                            You are logged in as a staff member. Here's your dashboard overview.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                                <User className="h-4 w-4 mr-2" />
                                Role: {auth.user.role.charAt(0).toUpperCase() + auth.user.role.slice(1)}
                            </div>
                            <div className="flex items-center">
                                <User className="h-4 w-4 mr-2" />
                                {auth.user.email}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Statistics Cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_properties}</div>
                            <p className="text-xs text-muted-foreground">
                                Properties under your care
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.recent_activity}</div>
                            <p className="text-xs text-muted-foreground">
                                Updates in last 7 days
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <Link href="/property" className="block">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">View All</CardTitle>
                                <Eye className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">Properties</div>
                                <p className="text-xs text-muted-foreground">
                                    Manage your properties
                                </p>
                            </CardContent>
                        </Link>
                    </Card>
                </div>

                {/* Properties by Condition */}
                {Object.keys(stats.properties_by_condition).length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Properties by Condition</CardTitle>
                            <CardDescription>
                                Breakdown of your properties by their current condition
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {Object.entries(stats.properties_by_condition).map(([condition, count]) => (
                                    <div key={condition} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="font-medium text-sm">{condition}</span>
                                        <span className="text-xl font-bold text-blue-600">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Recent Properties */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Recent Properties</CardTitle>
                            <CardDescription>
                                Your most recently added properties
                            </CardDescription>
                        </div>
                        {properties.length > 0 && (
                            <Link
                                href="/property"
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                                View All →
                            </Link>
                        )}
                    </CardHeader>
                    <CardContent>
                        {properties.length > 0 ? (
                            <div className="space-y-4">
                                {properties.map((property) => (
                                    <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3">
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-gray-900">
                                                        {property.item_name}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        {property.property_number}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                                                <div className="flex items-center">
                                                    <MapPin className="h-3 w-3 mr-1" />
                                                    {property.location}
                                                </div>
                                                <div className="flex items-center">
                                                    <TrendingUp className="h-3 w-3 mr-1" />
                                                    {property.condition}
                                                </div>
                                                <div className="flex items-center">
                                                    <Calendar className="h-3 w-3 mr-1" />
                                                    {property.created_at}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Link
                                                href={`/property/${property.id}`}
                                                className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
                                            >
                                                <Eye className="h-3 w-3 mr-1" />
                                                View
                                            </Link>
                                            <a
                                                href={property.qr_code_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center px-3 py-1 text-xs font-medium text-green-600 bg-green-50 rounded-full hover:bg-green-100 transition-colors"
                                            >
                                                <QrCode className="h-3 w-3 mr-1" />
                                                QR
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                <p>No properties assigned to you yet</p>
                                <p className="text-sm">Properties assigned to you will appear here</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

            </div>
        </AppLayout>
    );
}
