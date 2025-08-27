import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { User, Calendar, FileText, Settings } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Staff Dashboard',
        href: '/staff-dashboard',
    },
];

type PageProps = {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
};

export default function StaffDashboard() {
    const { props } = usePage<PageProps>();
    const { auth } = props;

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

                {/* Quick Actions */}
                {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Properties</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">View</div>
                            <p className="text-xs text-muted-foreground">
                                Manage property listings
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Schedule</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Today</div>
                            <p className="text-xs text-muted-foreground">
                                View your schedule
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Settings</CardTitle>
                            <Settings className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Profile</div>
                            <p className="text-xs text-muted-foreground">
                                Update your information
                            </p>
                        </CardContent>
                    </Card>
                </div> */}

                {/* Recent Activity or Additional Content */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>
                            Your recent actions and updates
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-8 text-gray-500">
                            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p>No recent activity to show</p>
                            <p className="text-sm">Start working with properties to see your activity here</p>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </AppLayout>
    );
}
