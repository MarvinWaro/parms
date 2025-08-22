import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import { FormEvent, useEffect, useMemo } from 'react';
import { toast } from 'sonner';

type PropertyData = {
    id: string;
    property_number: string;
    item_name: string;
    serial_no?: string;
    model_no?: string;
    acquisition_date?: string;
    acquisition_cost?: number;
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

interface EditPropertyModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    property: PropertyData;
    locations: DropdownOption[];
    users: DropdownOption[];
    conditions: DropdownOption[];
    funds: FundOption[];
    onSuccess?: () => void;
    source?: string; // Add source prop
}

const getInitialFormData = (property: PropertyData, source: string = 'show') => ({
    item_name: property.item_name || '',
    property_number: property.property_number || '',
    serial_no: property.serial_no || '',
    model_no: property.model_no || '',
    acquisition_date: property.acquisition_date || '',
    acquisition_cost: property.acquisition_cost != null ? String(property.acquisition_cost) : '',
    unit_of_measure: property.unit_of_measure || '',
    quantity_per_physical_count: property.quantity_per_physical_count?.toString() || '1',
    fund: property.fund || '',
    location_id: property.location_id ? String(property.location_id) : '',
    user_id: property.user_id ? String(property.user_id) : '',
    condition_id: property.condition_id ? String(property.condition_id) : '',
    item_description: property.item_description || '',
    remarks: property.remarks || '',
    color: property.color || '#000000',
    source: source, // Use dynamic source parameter
});

export default function EditPropertyModal({
    open,
    onOpenChange,
    property,
    locations,
    users,
    conditions,
    funds,
    onSuccess,
    source = 'show', // Default to 'show' if not provided
}: EditPropertyModalProps) {
    // Create a memoized form data that updates when property or source changes
    const formData = useMemo(() => getInitialFormData(property, source), [property.id, source]);

    const { data, setData, patch, processing, errors, clearErrors, reset } = useForm(formData);

    // Reset form when modal opens
    useEffect(() => {
        if (open) {
            clearErrors();
        }
    }, [open]);

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        const promise = new Promise<void>((resolve, reject) => {
            patch(route('properties.update', property.id), {
                preserveScroll: true,
                onSuccess: () => {
                    resolve();
                    onSuccess?.();
                },
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
            onOpenChange(false);
        });
    }

    function handleOpenChange(newOpen: boolean) {
        if (!newOpen) {
            clearErrors();
        }
        onOpenChange(newOpen);
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            <Pencil className="h-4 w-4 text-primary" />
                        </div>
                        Edit Property
                    </DialogTitle>
                    <DialogDescription>Update the property details below.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        {/* Row 1 */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="edit-modal-item_name">
                                    Item Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="edit-modal-item_name"
                                    placeholder="e.g., Dell Latitude 5440"
                                    value={data.item_name}
                                    onChange={(e) => setData('item_name', e.target.value)}
                                    className={errors.item_name ? 'border-red-500' : ''}
                                    disabled={processing}
                                />
                                {errors.item_name && <p className="text-sm text-red-500">{errors.item_name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-modal-property_number">Property Number</Label>
                                <Input
                                    id="edit-modal-property_number"
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
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="edit-modal-serial_no">Serial No</Label>
                                <Input
                                    id="edit-modal-serial_no"
                                    placeholder="e.g., ABC123456"
                                    value={data.serial_no}
                                    onChange={(e) => setData('serial_no', e.target.value)}
                                    className={errors.serial_no ? 'border-red-500' : ''}
                                    disabled={processing}
                                />
                                {errors.serial_no && <p className="text-sm text-red-500">{errors.serial_no}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-modal-model_no">Model No</Label>
                                <Input
                                    id="edit-modal-model_no"
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
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="edit-modal-acquisition_date">Acquisition Date</Label>
                                <Input
                                    id="edit-modal-acquisition_date"
                                    type="date"
                                    value={data.acquisition_date}
                                    onChange={(e) => setData('acquisition_date', e.target.value)}
                                    className={errors.acquisition_date ? 'border-red-500' : ''}
                                    disabled={processing}
                                />
                                {errors.acquisition_date && <p className="text-sm text-red-500">{errors.acquisition_date}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-modal-acquisition_cost">Acquisition Cost</Label>
                                <Input
                                    id="edit-modal-acquisition_cost"
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
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="edit-modal-unit_of_measure">Unit of Measure</Label>
                                <Input
                                    id="edit-modal-unit_of_measure"
                                    placeholder="e.g., pcs, unit, box"
                                    value={data.unit_of_measure}
                                    onChange={(e) => setData('unit_of_measure', e.target.value)}
                                    className={errors.unit_of_measure ? 'border-red-500' : ''}
                                    disabled={processing}
                                />
                                {errors.unit_of_measure && <p className="text-sm text-red-500">{errors.unit_of_measure}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-modal-quantity_per_physical_count">Quantity (Per Physical Count)</Label>
                                <Input
                                    id="edit-modal-quantity_per_physical_count"
                                    type="number"
                                    min="1"
                                    value={data.quantity_per_physical_count}
                                    onChange={(e) => setData('quantity_per_physical_count', e.target.value)}
                                    className={errors.quantity_per_physical_count ? 'border-red-500' : ''}
                                    disabled={processing}
                                />
                                {errors.quantity_per_physical_count && <p className="text-sm text-red-500">{errors.quantity_per_physical_count}</p>}
                            </div>
                        </div>

                        {/* Row 5: Fund + User */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Fund</Label>
                                <Select value={data.fund} onValueChange={(v) => setData('fund', v)} disabled={processing}>
                                    <SelectTrigger className={`w-full ${errors.fund ? 'border-red-500' : ''}`}>
                                        <SelectValue placeholder="Select fund" />
                                    </SelectTrigger>
                                    <SelectContent position="popper" className="max-h-60 w-[--radix-select-trigger-width]">
                                        {funds.map((f) => (
                                            <SelectItem key={f.value} value={f.value} className="leading-5 whitespace-normal">
                                                {f.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.fund && <p className="text-sm text-red-500">{errors.fund}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>
                                    User <span className="text-red-500">*</span>
                                </Label>
                                <Select value={data.user_id || ''} onValueChange={(v) => setData('user_id', v)} disabled={processing}>
                                    <SelectTrigger className={`w-full ${errors.user_id ? 'border-red-500' : ''}`}>
                                        <SelectValue placeholder="Select user" />
                                    </SelectTrigger>
                                    <SelectContent position="popper" className="max-h-60 w-[--radix-select-trigger-width]">
                                        {users.map((u) => (
                                            <SelectItem key={u.id} value={String(u.id)} className="leading-5 whitespace-normal">
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
                            <Label>
                                Location / Whereabouts <span className="text-red-500">*</span>
                            </Label>
                            <Select value={data.location_id || ''} onValueChange={(v) => setData('location_id', v)} disabled={processing}>
                                <SelectTrigger className={`w-full ${errors.location_id ? 'border-red-500' : ''}`}>
                                    <SelectValue placeholder="Select location" />
                                </SelectTrigger>
                                <SelectContent position="popper" className="max-h-60 w-[--radix-select-trigger-width]">
                                    {locations.map((loc) => (
                                        <SelectItem key={loc.id} value={String(loc.id)} className="leading-5 whitespace-normal">
                                            {loc.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.location_id && <p className="text-sm text-red-500">{errors.location_id}</p>}
                        </div>

                        {/* Row 7: Condition */}
                        <div className="space-y-2">
                            <Label>
                                Condition <span className="text-red-500">*</span>
                            </Label>
                            <Select value={data.condition_id || ''} onValueChange={(v) => setData('condition_id', v)} disabled={processing}>
                                <SelectTrigger className={`w-full ${errors.condition_id ? 'border-red-500' : ''}`}>
                                    <SelectValue placeholder="Select condition" />
                                </SelectTrigger>
                                <SelectContent position="popper" className="max-h-60 w-[--radix-select-trigger-width]">
                                    {conditions.map((c) => (
                                        <SelectItem key={c.id} value={String(c.id)} className="leading-5 whitespace-normal">
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.condition_id && <p className="text-sm text-red-500">{errors.condition_id}</p>}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="edit-modal-item_description">Item Description</Label>
                            <Textarea
                                id="edit-modal-item_description"
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
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="edit-modal-remarks">Remarks</Label>
                                <Textarea
                                    id="edit-modal-remarks"
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
                                <Label htmlFor="edit-modal-color">Color</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="edit-modal-color"
                                        type="color"
                                        value={data.color}
                                        onChange={(e) => setData('color', e.target.value)}
                                        className={`h-10 w-16 p-1 ${errors.color ? 'border-red-500' : ''}`}
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
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={processing}>
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
    );
}
