import EditPropertyModal from '@/components/property/ui/edit-property-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TableCell, TableRow } from '@/components/ui/table';
import { useForm } from '@inertiajs/react';
import { AlertTriangle, Eye, Package, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type PropertyRow = {
    id: string;
    property_number: string;
    item_name: string;
    location: string;
    condition: string;
    acquisition_cost: number | null;
    // Add these fields for editing
    serial_no?: string;
    model_no?: string;
    acquisition_date?: string;
    unit_of_measure?: string;
    quantity_per_physical_count?: number;
    fund?: string;
    location_id?: string;
    user_id?: string;
    condition_id?: string;
    item_description?: string;
    remarks?: string;
    color?: string;
};

type DropdownOption = {
    id: string;
    name: string;
};

type FundOption = {
    value: string;
    label: string;
};

interface PropertyRowTemplateProps {
    index: number;
    row: PropertyRow;
    locations: DropdownOption[];
    users: DropdownOption[];
    conditions: DropdownOption[];
    funds: FundOption[];
}

const peso = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 2 });

export default function PropertyRowTemplate({ row, index, locations, users, conditions, funds }: PropertyRowTemplateProps) {
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const { delete: deleteRequest, processing } = useForm();

    function handleDeleteConfirm() {
        setOpenDelete(false);

        const promise = new Promise<void>((resolve, reject) => {
            deleteRequest(route('properties.destroy', row.id), {
                preserveScroll: true,
                onSuccess: () => resolve(),
                onError: () => reject('Failed to delete property. Please try again.'),
            });
        });

        toast.promise(promise, {
            loading: 'Deleting property...',
            success: 'Property deleted successfully!',
            error: (message) => message,
            duration: 2000,
        });
    }

    // Convert row data to match EditPropertyModal expected format
    const propertyData = {
        id: row.id,
        property_number: row.property_number,
        item_name: row.item_name,
        serial_no: row.serial_no,
        model_no: row.model_no,
        acquisition_date: row.acquisition_date,
        acquisition_cost: row.acquisition_cost ?? undefined, // Convert null to undefined
        unit_of_measure: row.unit_of_measure,
        quantity_per_physical_count: row.quantity_per_physical_count,
        fund: row.fund,
        location_id: row.location_id,
        user_id: row.user_id,
        condition_id: row.condition_id,
        item_description: row.item_description,
        remarks: row.remarks,
        color: row.color,
    };

    return (
        <>
            <TableRow className="group border-b border-border/30 transition-all duration-150 hover:bg-muted/20 hover:shadow-sm">
                <TableCell className="px-6 py-4 align-middle">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20 transition-all duration-200 group-hover:bg-primary/15 group-hover:ring-primary/30">
                            <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex flex-col">
                            <span className="leading-none font-medium text-foreground">{row.item_name}</span>
                            <span className="mt-1 text-xs text-muted-foreground">{row.property_number}</span>
                        </div>
                    </div>
                </TableCell>
                <TableCell className="px-6 py-4 align-middle">{row.location}</TableCell>
                <TableCell className="px-6 py-4 align-middle">
                    <Badge variant="outline">{row.condition}</Badge>
                </TableCell>
                <TableCell className="px-6 py-4 text-right align-middle tabular-nums">
                    {row.acquisition_cost !== null ? peso.format(row.acquisition_cost) : '—'}
                </TableCell>
                <TableCell className="px-6 py-4 text-right align-middle">
                    <div className="flex items-center justify-end gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            title="View property"
                            onClick={() => (window.location.href = route('properties.show', row.id))}
                            className="h-9 w-9 p-0 text-muted-foreground transition-all duration-200 hover:scale-105 hover:bg-muted/60 hover:text-foreground"
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            title="Edit property"
                            onClick={() => setOpenEdit(true)}
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
                                    title="Delete property"
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
                                            <h4 className="text-sm font-medium text-foreground">Delete property</h4>
                                            <p className="text-xs leading-relaxed text-muted-foreground">
                                                Delete "{row.item_name}"? This action cannot be undone.
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

            {/* Use the shared EditPropertyModal instead of inline dialog */}
            <EditPropertyModal
                open={openEdit}
                onOpenChange={setOpenEdit}
                property={propertyData}
                locations={locations}
                users={users}
                conditions={conditions}
                funds={funds}
                source="index" // Set source to 'index' for table edits
                onSuccess={() => {
                    // Modal already handles success notifications
                }}
            />
        </>
    );
}
