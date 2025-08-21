import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { AlertTriangle, Package, Pencil, Trash2, Eye } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { useForm } from "@inertiajs/react";

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

export default function PropertyRowTemplate({
    row,
    index,
    locations,
    users,
    conditions,
    funds
}: PropertyRowTemplateProps) {
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
    } = useForm({
        item_name: row.item_name || '',
        property_number: row.property_number || '',
        serial_no: row.serial_no || '',
        model_no: row.model_no || '',
        acquisition_date: row.acquisition_date || '',
        acquisition_cost: row.acquisition_cost !== null ? row.acquisition_cost.toString() : '',
        unit_of_measure: row.unit_of_measure || '',
        quantity_per_physical_count: row.quantity_per_physical_count?.toString() || '1',
        fund: row.fund || '',
        location_id: row.location_id || '',
        user_id: row.user_id || '',
        condition_id: row.condition_id || '',
        item_description: row.item_description || '',
        remarks: row.remarks || '',
        color: row.color || '#000000',
    });

    function openEditFor(row: PropertyRow) {
        // Reset form with current row data
        setData({
            item_name: row.item_name || '',
            property_number: row.property_number || '',
            serial_no: row.serial_no || '',
            model_no: row.model_no || '',
            acquisition_date: row.acquisition_date || '',
            acquisition_cost: row.acquisition_cost?.toString() || '',
            unit_of_measure: row.unit_of_measure || '',
            quantity_per_physical_count: row.quantity_per_physical_count?.toString() || '1',
            fund: row.fund || '',
            location_id: row.location_id || '',
            user_id: row.user_id || '',
            condition_id: row.condition_id || '',
            item_description: row.item_description || '',
            remarks: row.remarks || '',
            color: row.color || '#000000',
        });
        clearErrors();
        setOpenEdit(true);
    }

    function handleEditSubmit(e: FormEvent) {
        e.preventDefault();

        const promise = new Promise<void>((resolve, reject) => {
            patch(route('properties.update', row.id), {
                preserveScroll: true,
                onSuccess: () => resolve(),
                onError: () => reject('Failed to update property. Please try again.'),
            });
        });

        toast.promise(promise, {
            loading: 'Updating property...',
            success: 'Property updated successfully!',
            error: (message) => message,
            duration: 2000,
        });

        promise.finally(() => {
            setOpenEdit(false);
        });
    }

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

    return (
        <>
            <TableRow className="group border-b border-border/30 transition-all duration-150 hover:bg-muted/20 hover:shadow-sm">
                <TableCell className="px-6 py-4 align-middle">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20 transition-all duration-200 group-hover:bg-primary/15 group-hover:ring-primary/30">
                            <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-medium text-foreground leading-none">
                                {row.item_name}
                            </span>
                            <span className="text-xs text-muted-foreground mt-1">
                                {row.property_number}
                            </span>
                        </div>
                    </div>
                </TableCell>
                <TableCell className="px-6 py-4 align-middle">
                    {row.location}
                </TableCell>
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
                            onClick={() => window.location.href = route('properties.show', row.id)}
                            className="h-9 w-9 p-0 text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-muted/60 hover:scale-105"
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            title="Edit property"
                            onClick={() => openEditFor(row)}
                            className="h-9 w-9 p-0 text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-muted/60 hover:scale-105"
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
                                    className="h-9 w-9 p-0 text-muted-foreground transition-all duration-200 hover:text-destructive hover:bg-destructive/10 hover:scale-105"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-0" align="end" side="bottom">
                                <div className="p-4 space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10 flex-shrink-0 mt-0.5">
                                            <AlertTriangle className="h-4 w-4 text-destructive" />
                                        </div>
                                        <div className="space-y-1 flex-1">
                                            <h4 className="text-sm font-medium text-foreground">Delete property</h4>
                                            <p className="text-xs text-muted-foreground leading-relaxed">
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
                                            className="flex-1 h-8 text-xs"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={handleDeleteConfirm}
                                            disabled={processing}
                                            className="flex-1 h-8 text-xs"
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
            <Dialog open={openEdit} onOpenChange={(v) => { setOpenEdit(v) }}>
                <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                <Pencil className="h-4 w-4 text-primary" />
                            </div>
                            Edit Property
                        </DialogTitle>
                        <DialogDescription>Update the property details below.</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleEditSubmit}>
                        <div className="grid gap-4 py-4">
                            {/* Row 1 */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-item_name">Item Name <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="edit-item_name"
                                        placeholder="e.g., Dell Latitude 5440"
                                        value={data.item_name}
                                        onChange={(e) => setData('item_name', e.target.value)}
                                        className={errors.item_name ? 'border-red-500' : ''}
                                        disabled={processing}
                                    />
                                    {errors.item_name && <p className="text-sm text-red-500">{errors.item_name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-property_number">Property Number</Label>
                                    <Input
                                        id="edit-property_number"
                                        placeholder="Auto-generated if empty"
                                        value={data.property_number}
                                        onChange={(e) => setData('property_number', e.target.value)}
                                        className={errors.property_number ? 'border-red-500' : ''}
                                        disabled={processing}
                                    />
                                    {errors.property_number && <p className="text-sm text-red-500">{errors.property_number}</p>}
                                </div>
                            </div>

                            {/* Row 2 */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-serial_no">Serial No</Label>
                                    <Input
                                        id="edit-serial_no"
                                        placeholder="e.g., ABC123456"
                                        value={data.serial_no}
                                        onChange={(e) => setData('serial_no', e.target.value)}
                                        className={errors.serial_no ? 'border-red-500' : ''}
                                        disabled={processing}
                                    />
                                    {errors.serial_no && <p className="text-sm text-red-500">{errors.serial_no}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-model_no">Model No</Label>
                                    <Input
                                        id="edit-model_no"
                                        placeholder="e.g., Latitude 5440"
                                        value={data.model_no}
                                        onChange={(e) => setData('model_no', e.target.value)}
                                        className={errors.model_no ? 'border-red-500' : ''}
                                        disabled={processing}
                                    />
                                    {errors.model_no && <p className="text-sm text-red-500">{errors.model_no}</p>}
                                </div>
                            </div>

                            {/* Row 3 */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-acquisition_date">Acquisition Date</Label>
                                    <Input
                                        id="edit-acquisition_date"
                                        type="date"
                                        value={data.acquisition_date}
                                        onChange={(e) => setData('acquisition_date', e.target.value)}
                                        className={errors.acquisition_date ? 'border-red-500' : ''}
                                        disabled={processing}
                                    />
                                    {errors.acquisition_date && <p className="text-sm text-red-500">{errors.acquisition_date}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-acquisition_cost">Acquisition Cost</Label>
                                    <Input
                                        id="edit-acquisition_cost"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={data.acquisition_cost}
                                        onChange={(e) => setData('acquisition_cost', e.target.value)}
                                        className={errors.acquisition_cost ? 'border-red-500' : ''}
                                        disabled={processing}
                                    />
                                    {errors.acquisition_cost && <p className="text-sm text-red-500">{errors.acquisition_cost}</p>}
                                </div>
                            </div>

                            {/* Row 4 */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-unit_of_measure">Unit of Measure</Label>
                                    <Input
                                        id="edit-unit_of_measure"
                                        placeholder="e.g., pcs, unit, box"
                                        value={data.unit_of_measure}
                                        onChange={(e) => setData('unit_of_measure', e.target.value)}
                                        className={errors.unit_of_measure ? 'border-red-500' : ''}
                                        disabled={processing}
                                    />
                                    {errors.unit_of_measure && <p className="text-sm text-red-500">{errors.unit_of_measure}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-quantity_per_physical_count">Quantity (Per Physical Count)</Label>
                                    <Input
                                        id="edit-quantity_per_physical_count"
                                        type="number"
                                        min="1"
                                        value={data.quantity_per_physical_count}
                                        onChange={(e) => setData('quantity_per_physical_count', e.target.value)}
                                        className={errors.quantity_per_physical_count ? 'border-red-500' : ''}
                                        disabled={processing}
                                    />
                                    {errors.quantity_per_physical_count && (
                                        <p className="text-sm text-red-500">{errors.quantity_per_physical_count}</p>
                                    )}
                                </div>
                            </div>

                            {/* Row 5: Fund + User */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-fund">Fund</Label>
                                    <Select value={data.fund} onValueChange={(v) => setData('fund', v)} disabled={processing}>
                                        <SelectTrigger className={`w-full ${errors.fund ? 'border-red-500' : ''}`}>
                                            <SelectValue placeholder="Select fund" />
                                        </SelectTrigger>
                                        <SelectContent position="popper" className="w-[--radix-select-trigger-width] max-h-60">
                                            {funds.map((f) => (
                                                <SelectItem key={f.value} value={f.value} className="whitespace-normal leading-5">
                                                    {f.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.fund && <p className="text-sm text-red-500">{errors.fund}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit-user_id">User <span className="text-red-500">*</span></Label>
                                    <Select
                                        value={data.user_id || ''}
                                        onValueChange={(v) => setData('user_id', v)}
                                        disabled={processing}
                                    >
                                        <SelectTrigger className={`w-full ${errors.user_id ? 'border-red-500' : ''}`}>
                                            <SelectValue placeholder="Select user" />
                                        </SelectTrigger>
                                        <SelectContent position="popper" className="w-[--radix-select-trigger-width] max-h-60">
                                            {users.map((u) => (
                                                <SelectItem key={u.id} value={String(u.id)} className="whitespace-normal leading-5">
                                                    {u.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.user_id && <p className="text-sm text-red-500">{errors.user_id}</p>}
                                </div>
                            </div>

                            {/* Row 6: Location */}
                            <div className="space-y-2">
                                <Label htmlFor="edit-location_id">Location / Whereabouts <span className="text-red-500">*</span></Label>
                                <Select
                                    value={data.location_id || ''}
                                    onValueChange={(v) => setData('location_id', v)}
                                    disabled={processing}
                                >
                                    <SelectTrigger className={`w-full ${errors.location_id ? 'border-red-500' : ''}`}>
                                        <SelectValue placeholder="Select location" />
                                    </SelectTrigger>
                                    <SelectContent position="popper" className="w-[--radix-select-trigger-width] max-h-60">
                                        {locations.map((loc) => (
                                            <SelectItem key={loc.id} value={String(loc.id)} className="whitespace-normal leading-5">
                                                {loc.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.location_id && <p className="text-sm text-red-500">{errors.location_id}</p>}
                            </div>

                            {/* Row 7: Condition */}
                            <div className="space-y-2">
                                <Label htmlFor="edit-condition_id">Condition <span className="text-red-500">*</span></Label>
                                <Select
                                    value={data.condition_id || ''}
                                    onValueChange={(v) => setData('condition_id', v)}
                                    disabled={processing}
                                >
                                    <SelectTrigger className={`w-full ${errors.condition_id ? 'border-red-500' : ''}`}>
                                        <SelectValue placeholder="Select condition" />
                                    </SelectTrigger>
                                    <SelectContent position="popper" className="w-[--radix-select-trigger-width] max-h-60">
                                        {conditions.map((c) => (
                                            <SelectItem key={c.id} value={String(c.id)} className="whitespace-normal leading-5">
                                                {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.condition_id && <p className="text-sm text-red-500">{errors.condition_id}</p>}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="edit-item_description">Item Description</Label>
                                <Textarea
                                    id="edit-item_description"
                                    placeholder="Detailed description of the item..."
                                    value={data.item_description}
                                    onChange={(e) => setData('item_description', e.target.value)}
                                    className={errors.item_description ? 'border-red-500' : ''}
                                    rows={3}
                                    disabled={processing}
                                />
                                {errors.item_description && <p className="text-sm text-red-500">{errors.item_description}</p>}
                            </div>

                            {/* Remarks + Color */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-remarks">Remarks</Label>
                                    <Textarea
                                        id="edit-remarks"
                                        placeholder="Additional remarks or notes..."
                                        value={data.remarks}
                                        onChange={(e) => setData('remarks', e.target.value)}
                                        className={errors.remarks ? 'border-red-500' : ''}
                                        rows={3}
                                        disabled={processing}
                                    />
                                    {errors.remarks && <p className="text-sm text-red-500">{errors.remarks}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-color">Color</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="edit-color"
                                            type="color"
                                            value={data.color}
                                            onChange={(e) => setData('color', e.target.value)}
                                            className={`w-16 h-10 p-1 ${errors.color ? 'border-red-500' : ''}`}
                                            disabled={processing}
                                        />
                                        <Input
                                            placeholder="#000000"
                                            value={data.color}
                                            onChange={(e) => setData('color', e.target.value)}
                                            className={`flex-1 ${errors.color ? 'border-red-500' : ''}`}
                                            disabled={processing}
                                        />
                                    </div>
                                    {errors.color && <p className="text-sm text-red-500">{errors.color}</p>}
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => setOpenEdit(false)} disabled={processing}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing || !data.item_name || !data.location_id || !data.user_id || !data.condition_id}
                                className="min-w-[140px]"
                            >
                                {processing ? 'Saving changes…' : 'Save changes'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
