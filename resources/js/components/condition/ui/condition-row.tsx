import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TableCell, TableRow } from '@/components/ui/table';
import { Row } from '@/pages/condition';
import { useForm } from '@inertiajs/react';
import { AlertTriangle, Pencil, Stethoscope, Trash2 } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';

interface ConditionRowTemplateProps {
    index: number;
    row: Row;
}

export default function ConditionRowTemplate({ row, index }: ConditionRowTemplateProps) {
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const { data, setData, patch, delete: deleteRequest, processing, errors } = useForm({ condition: row.condition });

    function openEditFor(row: Row) {
        setOpenEdit(true);
    }

    function handleEditSubmit(e: FormEvent) {
        e.preventDefault();
        setOpenEdit(false);

        const promise = new Promise<void>((resolve, reject) => {
            patch(`/condition/${row.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    resolve();
                },
                onError: () => {
                    reject('Failed to update condition. Please try again.');
                },
            });
        });

        toast.promise(promise, {
            loading: 'Updating condition...',
            success: 'Condition updated successfully!',
            error: (message) => message,
            duration: 2000,
        });
    }

    function handleDeleteConfirm() {
        setOpenDelete(false);

        const promise = new Promise<void>((resolve, reject) => {
            deleteRequest(`/condition/${row.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    resolve();
                },
                onError: () => {
                    reject('Failed to delete condition. Please try again.');
                },
            });
        });

        toast.promise(promise, {
            loading: 'Deleting condition...',
            success: 'Condition deleted successfully!',
            error: (message) => message,
            duration: 2000,
        });
    }

    return (
        <>
            <TableRow className="group border-b border-border/30 transition-all duration-150 hover:bg-muted/20 hover:shadow-sm">
                <TableCell className="px-6 py-5">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20 transition-all duration-200 group-hover:bg-primary/15 group-hover:ring-primary/30">
                            <Stethoscope className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex flex-col">
                            <span className="leading-none font-medium text-foreground">{row.condition}</span>
                            <span className="mt-1 text-xs text-muted-foreground">Condition #{index + 1}</span>
                        </div>
                    </div>
                </TableCell>
                <TableCell className="px-6 py-5">
                    <div className="flex items-center justify-end gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            title="Edit condition"
                            onClick={() => openEditFor(row)}
                            className="h-9 w-9 p-0 text-muted-foreground transition-all duration-200 hover:scale-105 hover:bg-muted/60 hover:text-foreground"
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>

                        {/* Delete Popover */}
                        <Popover open={openDelete} onOpenChange={setOpenDelete}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    title="Delete condition"
                                    className="h-9 w-9 p-0 text-muted-foreground transition-all duration-200 hover:scale-105 hover:bg-destructive/10 hover:text-destructive"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-0" align="end" side="bottom">
                                <div className="space-y-3 p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-destructive/10">
                                            <AlertTriangle className="h-4 w-4 text-destructive" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <h4 className="text-sm font-medium text-foreground">Delete condition</h4>
                                            <p className="text-xs leading-relaxed text-muted-foreground">
                                                Delete "{row.condition}"? This action cannot be undone.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 pt-1">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setOpenDelete(false)}
                                            disabled={processing}
                                            className="h-8 flex-1 text-xs"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={handleDeleteConfirm}
                                            disabled={processing}
                                            className="h-8 flex-1 text-xs"
                                        >
                                            {processing ? 'Deleting…' : 'Delete'}
                                        </Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </TableCell>
            </TableRow>

            {/* Edit Dialog */}
            <Dialog
                open={openEdit}
                onOpenChange={(v) => {
                    setOpenEdit(v);
                }}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                <Pencil className="h-4 w-4 text-primary" />
                            </div>
                            Edit Condition
                        </DialogTitle>
                        <DialogDescription>Update the condition name and details.</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-condition" className="text-sm font-medium">
                                Condition Name
                            </Label>
                            <Input
                                id="edit-condition"
                                value={data.condition}
                                onChange={(e) => setData('condition', e.target.value)}
                                placeholder="e.g., Excellent, Good, Fair, Poor"
                                className="transition-all duration-200"
                                aria-invalid={!!errors.condition}
                                aria-describedby={errors.condition ? 'edit-condition-error' : undefined}
                                disabled={processing}
                            />
                            {errors.condition && (
                                <p id="edit-condition-error" className="text-xs text-destructive">
                                    {errors.condition}
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
        </>
    );
}
