import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserCheck, UserPlus, Eye, Pencil } from 'lucide-react';
import { useState } from 'react';
import AddUserDialog from './users-add-dialog';
import EditUserDialog from './users-edit-dialog';

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
    avatar: string;
};

interface UsersTableProps {
    users?: User[]; // Make users optional
}

export default function UsersTable({ users = [] }: UsersTableProps) { // Provide default empty array
    const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
    const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleViewUser = (user: User) => {
        // TODO: Implement view user functionality
        console.log('View user:', user);
    };

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setIsEditUserDialogOpen(true);
    };

    const handleEditDialogClose = () => {
        setIsEditUserDialogOpen(false);
        setSelectedUser(null);
    };

    const getRoleBadgeStyle = (role: string) => {
        switch (role.toLowerCase()) {
            case 'admin':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'staff':
                return 'bg-green-50 text-green-700 border-green-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    return (
        <>
            <Card>
                <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <UserCheck className="h-5 w-5" />
                                Registered Users
                            </CardTitle>
                            <CardDescription>
                                A list of all registered users in the system
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="px-3 py-1.5">
                                {users.length} {users.length === 1 ? 'User' : 'Users'}
                            </Badge>
                            <Button
                                onClick={() => setIsAddUserDialogOpen(true)}
                                className="flex items-center gap-2"
                                size="sm"
                            >
                                <UserPlus className="h-4 w-4" />
                                Add User
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b border-border/50 bg-muted/30 hover:bg-muted/30">
                                    <TableHead className="h-14 px-6 text-sm font-semibold text-foreground/90">
                                        User
                                    </TableHead>
                                    <TableHead className="h-14 px-6 text-sm font-semibold text-foreground/90">
                                        Email
                                    </TableHead>
                                    <TableHead className="h-14 px-6 text-sm font-semibold text-foreground/90">
                                        Role
                                    </TableHead>
                                    <TableHead className="h-14 px-6 text-right text-sm font-semibold text-foreground/90">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.length > 0 ? (
                                    users.map((user) => (
                                        <TableRow
                                            key={user.id}
                                            className="border-b border-border/30 transition-all duration-150 hover:bg-muted/20"
                                        >
                                            <TableCell className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9">
                                                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                                            {user.avatar}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium text-foreground">
                                                            {user.name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-muted-foreground">
                                                {user.email}
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <Badge
                                                    variant="outline"
                                                    className={getRoleBadgeStyle(user.role)}
                                                >
                                                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        title="View user details"
                                                        onClick={() => handleViewUser(user)}
                                                        className="h-9 w-9 p-0 text-muted-foreground transition-all duration-200 hover:scale-105 hover:bg-muted/60 hover:text-foreground"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        title="Edit user"
                                                        onClick={() => handleEditUser(user)}
                                                        className="h-9 w-9 p-0 text-muted-foreground transition-all duration-200 hover:scale-105 hover:bg-muted/60 hover:text-foreground"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                            No users found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Add User Dialog */}
            <AddUserDialog
                open={isAddUserDialogOpen}
                onOpenChange={setIsAddUserDialogOpen}
            />

            {/* Edit User Dialog */}
            <EditUserDialog
                open={isEditUserDialogOpen}
                onOpenChange={handleEditDialogClose}
                user={selectedUser}
            />
        </>
    );
}
