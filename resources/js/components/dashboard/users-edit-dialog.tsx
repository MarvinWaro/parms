import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';
import { Loader2, Pencil } from 'lucide-react';
import { toast } from 'sonner';

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
    avatar: string;
};

interface EditUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User | null;
}

export default function EditUserDialog({ open, onOpenChange, user }: EditUserDialogProps) {
    const form = useForm({
        name: '',
        email: '',
        role: 'staff',
        password: '', // Optional field for password updates
    });

    // Populate form when user changes or dialog opens
    useEffect(() => {
        if (user && open) {
            form.setData({
                name: user.name,
                email: user.email,
                role: user.role as 'admin' | 'staff',
                password: '',
            });
        }
    }, [user, open]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!user) return;

        const promise = new Promise<void>((resolve, reject) => {
            form.patch(route('users.update', user.id), {
                preserveScroll: true,
                onSuccess: () => resolve(),
                onError: () => reject('Failed to update user. Please try again.'),
            });
        });

        toast.promise(promise, {
            loading: 'Updating user...',
            success: 'User updated successfully!',
            error: (message) => message,
            duration: 2000,
        });

        promise.finally(() => {
            form.setData({
                name: '',
                email: '',
                role: 'staff',
                password: '',
            });
            onOpenChange(false);
        });
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen && !form.processing) {
            // Reset form when closing
            form.setData({
                name: '',
                email: '',
                role: 'staff',
                password: '',
            });
        }
        onOpenChange(newOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            <Pencil className="h-4 w-4 text-primary" />
                        </div>
                        Edit User
                    </DialogTitle>
                    <DialogDescription>
                        Update user information and role. Leave password empty to keep current password.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-4">
                    <div className="grid gap-4 py-4">
                        {/* Name Field */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-name" className="text-right">
                                Name
                            </Label>
                            <div className="col-span-3">
                                <Input
                                    id="edit-name"
                                    type="text"
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                    placeholder="Enter full name"
                                    className={form.errors.name ? 'border-red-500' : ''}
                                    disabled={form.processing}
                                    required
                                />
                                {form.errors.name && (
                                    <p className="text-sm text-red-500 mt-1">{form.errors.name}</p>
                                )}
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-email" className="text-right">
                                Email
                            </Label>
                            <div className="col-span-3">
                                <Input
                                    id="edit-email"
                                    type="email"
                                    value={form.data.email}
                                    onChange={(e) => form.setData('email', e.target.value)}
                                    placeholder="Enter email address"
                                    className={form.errors.email ? 'border-red-500' : ''}
                                    disabled={form.processing}
                                    required
                                />
                                {form.errors.email && (
                                    <p className="text-sm text-red-500 mt-1">{form.errors.email}</p>
                                )}
                            </div>
                        </div>

                        {/* Password Field (Optional) */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-password" className="text-right">
                                Password
                            </Label>
                            <div className="col-span-3">
                                <Input
                                    id="edit-password"
                                    type="password"
                                    value={form.data.password}
                                    onChange={(e) => form.setData('password', e.target.value)}
                                    placeholder="Enter new password (optional)"
                                    className={form.errors.password ? 'border-red-500' : ''}
                                    disabled={form.processing}
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Leave empty to keep current password
                                </p>
                                {form.errors.password && (
                                    <p className="text-sm text-red-500 mt-1">{form.errors.password}</p>
                                )}
                            </div>
                        </div>

                        {/* Role Field */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">
                                Role
                            </Label>
                            <div className="col-span-3">
                                <Select
                                    value={form.data.role}
                                    onValueChange={(value: 'admin' | 'staff') => form.setData('role', value)}
                                    disabled={form.processing}
                                >
                                    <SelectTrigger
                                        id="edit-role"
                                        className={form.errors.role ? 'border-red-500' : ''}
                                    >
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="staff">Staff</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                                {form.errors.role && (
                                    <p className="text-sm text-red-500 mt-1">{form.errors.role}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                            disabled={form.processing}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
