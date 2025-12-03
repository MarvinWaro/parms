import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Clock, CheckCircle } from 'lucide-react';

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

export default function StaffDashboard({ auth }: PageProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Staff Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 overflow-x-auto mb-7">
                            {/* Welcome Section */}
                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <User className="h-8 w-8 text-blue-600" />
                                    <h1 className="text-3xl font-bold">
                                        Welcome, {auth.user.name}!
                                    </h1>
                                    <Badge variant="secondary" className="ml-2">
                                        Staff Member
                                    </Badge>
                                </div>
                                <p className="text-lg text-gray-600 dark:text-gray-400">
                                    You have successfully registered and logged into your staff account.
                                </p>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Account Status
                                        </CardTitle>
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">Active</div>
                                        <p className="text-xs text-muted-foreground">
                                            Your account is verified and ready
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Role
                                        </CardTitle>
                                        <User className="h-4 w-4 text-blue-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">Staff</div>
                                        <p className="text-xs text-muted-foreground">
                                            Standard access level
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Last Login
                                        </CardTitle>
                                        <Clock className="h-4 w-4 text-gray-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">Now</div>
                                        <p className="text-xs text-muted-foreground">
                                            Just logged in
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Main Content */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Getting Started</CardTitle>
                                    <CardDescription>
                                        Here's what you can do with your staff account
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="p-4 border rounded-lg">
                                        <h3 className="font-semibold mb-2">✨ Welcome to the Team!</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Your staff account has been successfully created. You now have access to the staff portal where you can manage your tasks and collaborate with your team.
                                        </p>
                                    </div>

                                    <div className="p-4 border rounded-lg">
                                        <h3 className="font-semibold mb-2">📋 Next Steps</h3>
                                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                            <li>• Complete your profile setup</li>
                                            <li>• Review available tools and resources</li>
                                            <li>• Contact your supervisor for initial assignments</li>
                                        </ul>
                                    </div>

                                    <div className="p-4 border rounded-lg">
                                        <h3 className="font-semibold mb-2">🎯 Your Role</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            As a staff member, you have access to essential features and can collaborate with your team effectively. Additional permissions can be granted by administrators as needed.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </AppLayout>
    );
}
