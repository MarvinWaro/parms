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
import { FormEventHandler } from 'react';
import { Loader2 } from 'lucide-react';

interface AddUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function AddUserDialog({ open, onOpenChange }: AddUserDialogProps) {
    const form = useForm({
        name: '',
        email: '',
        password: '12345678',
        role: 'staff',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        form.post(route('users.store'), {
            onSuccess: () => {
                form.reset();
                onOpenChange(false);
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
            },
        });
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen && !form.processing) {
            form.reset();
        }
        onOpenChange(newOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                        Create a new user account. The user will need to change the default password on first login.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-4">
                    <div className="grid gap-4 py-4">
                        {/* Name Field */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <div className="col-span-3">
                                <Input
                                    id="name"
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
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <div className="col-span-3">
                                <Input
                                    id="email"
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

                        {/* Password Field (Read-only, shows default) */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">
                                Password
                            </Label>
                            <div className="col-span-3">
                                <Input
                                    id="password"
                                    type="text"
                                    value={form.data.password}
                                    onChange={(e) => form.setData('password', e.target.value)}
                                    className={form.errors.password ? 'border-red-500' : ''}
                                    disabled={form.processing}
                                    readOnly
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Default password. User must change on first login.
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
                                    onValueChange={(value) => form.setData('role', value)}
                                    disabled={form.processing}
                                >
                                    <SelectTrigger
                                        id="role"
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
                                    Creating...
                                </>
                            ) : (
                                'Create User'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
