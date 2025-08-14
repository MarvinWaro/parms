import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Row } from "@/pages/location";
import { AlertTriangle, MapPin, Pencil, Trash2 } from "lucide-react";
import { FormEvent, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from "sonner";
import { useForm } from "@inertiajs/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface LocationRowTemplateProps {
    index: number;
    row: Row;
}

export default function LocationRowTemplate({ row, index }: LocationRowTemplateProps) {
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);


    const {
        data,
        setData,
        patch,
        delete: deleteRequest,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm({ location: row.location });

    function openEditFor(row: Row) {
        setOpenEdit(true);
    }

    function openDeleteFor(row: Row) {
        setOpenDelete(true);
    }


    function handleEditSubmit(e: FormEvent) {
        e.preventDefault();
        setOpenEdit(false);

        const promise = new Promise<void>((resolve, reject) => {
            patch(`/location/${row.id}`, {
                preserveScroll: true,
                onSuccess: () => resolve(),
                onError: () => reject('Failed to update location. Please try again.'),
            });
        });

        // Clean and simple - colors applied automatically!
        toast.promise(promise, {
            loading: 'Updating location...',
            success: 'Location updated successfully!',
            error: (message) => message,
            duration: 2000,
        });
    }


    function handleDeleteConfirm() {
        setOpenDelete(false);

        const promise = new Promise<void>((resolve, reject) => {
            deleteRequest(`/location/${row.id}`, {
                preserveScroll: true,
                onSuccess: () => resolve(),
                onError: () => reject('Failed to delete location. Please try again.'),
            });
        });

        // Automatically gets the global styling!
        toast.promise(promise, {
            loading: 'Deleting location...',
            success: 'Location deleted successfully!',
            error: (message) => message,
            duration: 2000,
        });
    }

    return (
        <>
            <TableRow
                className="group border-b border-border/30 transition-all duration-150 hover:bg-muted/20 hover:shadow-sm"
            >
                <TableCell className="px-6 py-5">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20 transition-all duration-200 group-hover:bg-primary/15 group-hover:ring-primary/30">
                            <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-medium text-foreground leading-none">
                                {row.location}
                            </span>
                            <span className="text-xs text-muted-foreground mt-1">
                                Location #{index + 1}
                            </span>
                        </div>
                    </div>
                </TableCell>
                <TableCell className="px-6 py-5">
                    <div className="flex items-center justify-end gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            title="Edit location"
                            onClick={() => openEditFor(row)}
                            className="h-9 w-9 p-0 text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-muted/60 hover:scale-105"
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            title="Delete location"
                            onClick={() => openDeleteFor(row)}
                            className="h-9 w-9 p-0 text-muted-foreground transition-all duration-200 hover:text-destructive hover:bg-destructive/10 hover:scale-105"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </TableCell>
            </TableRow>
            <Dialog open={openEdit} onOpenChange={(v) => { setOpenEdit(v) }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                <Pencil className="h-4 w-4 text-primary" />
                            </div>
                            Edit Location
                        </DialogTitle>
                        <DialogDescription>Update the location name and details.</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-location" className="text-sm font-medium">Location Name</Label>
                            <Input
                                id="edit-location"
                                value={data.location}
                                onChange={(e) => setData('location', e.target.value)}
                                placeholder="e.g., 3rd Floor — Records Office"
                                className="transition-all duration-200"
                                aria-invalid={!!errors.location}
                                aria-describedby={errors.location ? 'edit-location-error' : undefined}
                                disabled={processing}
                            />
                            {errors.location && (
                                <p id="edit-location-error" className="text-xs text-destructive">
                                    {errors.location}
                                </p>
                            )}
                        </div>

                        <DialogFooter className="gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => setOpenEdit(false)} disabled={processing}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing} className="min-w-[120px]">
                                {processing ? 'Saving changes…' : 'Save changes'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10">
                                <AlertTriangle className="h-4 w-4 text-destructive" />
                            </div>
                            Delete Location
                        </AlertDialogTitle>
                        <AlertDialogDescription className="leading-relaxed">
                            Are you sure you want to delete "{row?.location}"?
                            This action cannot be undone and will permanently remove this location from your records.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setOpenDelete(false)} disabled={processing}>
                            Cancel
                        </AlertDialogCancel>
                        {/* Use asChild to render a Button with proper destructive styles */}
                        <AlertDialogAction asChild>
                            <Button
                                variant="destructive"
                                onClick={handleDeleteConfirm}
                                disabled={processing}
                            >
                                {processing ? 'Deleting…' : 'Delete'}
                            </Button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
