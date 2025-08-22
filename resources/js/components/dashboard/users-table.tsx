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
import { UserCheck } from 'lucide-react';

type User = {
    id: number;
    name: string;
    email: string;
    created_at: string;
    avatar: string;
};

interface UsersTableProps {
    users?: User[]; // Make users optional
}

export default function UsersTable({ users = [] }: UsersTableProps) { // Provide default empty array
    return (
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
                    <Badge variant="secondary" className="px-3 py-1.5">
                        {users.length} {users.length === 1 ? 'User' : 'Users'}
                    </Badge>
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
                                    Member Since
                                </TableHead>
                                <TableHead className="h-14 px-6 text-right text-sm font-semibold text-foreground/90">
                                    Status
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
                                        <TableCell className="px-6 py-4 text-muted-foreground">
                                            {user.created_at}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-right">
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                Active
                                            </Badge>
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
    );
}
