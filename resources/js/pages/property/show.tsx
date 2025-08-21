import AppLayout from '@/layouts/app-layout';
import { Head, usePage, Link, useForm } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { ArrowLeft, Package, Calendar, DollarSign, MapPin, User, Wrench, Palette, Pencil, Trash2, Printer, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useState, FormEvent } from 'react';

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
    item_description?: string;
    remarks?: string;
    color?: string;
    location: string;
    user: string;
    condition: string;
    location_id?: string;
    user_id?: string;
    condition_id?: string;
    created_at: string;
    updated_at: string;
};

type DropdownOption = {
    id: string;
    name: string;
};

type FundOption = {
    value: string;
    label: string;
};

type PageProps = {
    property: PropertyData;
    locations: DropdownOption[];
    users: DropdownOption[];
    conditions: DropdownOption[];
    funds: FundOption[];
};

const peso = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 2 });

export default function PropertyShow() {
    const { props } = usePage<PageProps>();
    const { property, locations, users, conditions, funds } = props;
    const [openDelete, setOpenDelete] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);

    const { delete: deleteRequest, processing: deleteProcessing } = useForm();

    const {
        data,
        setData,
        patch,
        processing: editProcessing,
        errors,
        clearErrors,
    } = useForm({
        item_name: property.item_name || '',
        property_number: property.property_number || '',
        serial_no: property.serial_no || '',
        model_no: property.model_no || '',
        acquisition_date: property.acquisition_date || '',
        acquisition_cost: property.acquisition_cost != null ? String(property.acquisition_cost) : '',
        unit_of_measure: property.unit_of_measure || '',
        quantity_per_physical_count: property.quantity_per_physical_count?.toString() || '1',
        fund: property.fund || '',
        location_id: property.location_id || '',
        user_id: property.user_id || '',
        condition_id: property.condition_id || '',
        item_description: property.item_description || '',
        remarks: property.remarks || '',
        color: property.color || '#000000',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Property', href: '/property' },
        { title: property.item_name, href: `/property/${property.id}` }
    ];

    function handleEditSubmit(e: FormEvent) {
        e.preventDefault();

        const promise = new Promise<void>((resolve, reject) => {
            patch(route('properties.update', property.id), {
                preserveScroll: true,
                only: ['property'], // Only reload the property data, stay on same page
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
            deleteRequest(route('properties.destroy', property.id), {
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

    function handlePrintSticker() {
        toast.info('Print Sticker feature coming soon!', {
            duration: 2000,
        });
    }

    function openEditModal() {
        // Reset form with current property data
        setData({
            item_name: property.item_name || '',
            property_number: property.property_number || '',
            serial_no: property.serial_no || '',
            model_no: property.model_no || '',
            acquisition_date: property.acquisition_date || '',
            acquisition_cost: property.acquisition_cost != null ? String(property.acquisition_cost) : '',
            unit_of_measure: property.unit_of_measure || '',
            quantity_per_physical_count: property.quantity_per_physical_count?.toString() || '1',
            fund: property.fund || '',
            location_id: property.location_id || '',
            user_id: property.user_id || '',
            condition_id: property.condition_id || '',
            item_description: property.item_description || '',
            remarks: property.remarks || '',
            color: property.color || '#000000',
        });
        clearErrors();
        setOpenEdit(true);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${property.item_name} - Property Details`} />

            <div className="bg-background pb-6">
                <div className="space-y-6">
                    {/* Header Section */}
                    <div className="px-6 pt-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <Link href="/property">
                                        <Button variant="ghost" size="sm" className="pl-0">
                                            <ArrowLeft className="h-4 w-4 mr-2" />
                                            Back to Properties
                                        </Button>
                                    </Link>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                                        <Package className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold tracking-tight text-foreground">{property.item_name}</h1>
                                        <p className="text-sm text-muted-foreground">Property #{property.property_number}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Link href={route('properties.index')}>
                                    <Button variant="outline">
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Back to List
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Main Content - 2/3 width */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Basic Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Package className="h-5 w-5" />
                                            Basic Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Item Name</label>
                                                <p className="text-sm font-medium">{property.item_name}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Property Number</label>
                                                <p className="text-sm font-medium">{property.property_number}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Serial Number</label>
                                                <p className="text-sm">{property.serial_no || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Model Number</label>
                                                <p className="text-sm">{property.model_no || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Unit of Measure</label>
                                                <p className="text-sm">{property.unit_of_measure || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Quantity</label>
                                                <p className="text-sm">{property.quantity_per_physical_count || 1}</p>
                                            </div>
                                        </div>

                                        {property.item_description && (
                                            <>
                                                <Separator />
                                                <div>
                                                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                                                    <p className="text-sm mt-1 leading-relaxed">{property.item_description}</p>
                                                </div>
                                            </>
                                        )}

                                        {property.remarks && (
                                            <>
                                                <Separator />
                                                <div>
                                                    <label className="text-sm font-medium text-muted-foreground">Remarks</label>
                                                    <p className="text-sm mt-1 leading-relaxed">{property.remarks}</p>
                                                </div>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Financial Details */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <DollarSign className="h-5 w-5" />
                                            Financial Details
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Acquisition Date</label>
                                                <p className="text-sm">{property.acquisition_date || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Acquisition Cost</label>
                                                <p className="text-sm font-medium">
                                                    {property.acquisition_cost ? peso.format(property.acquisition_cost) : 'N/A'}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Fund</label>
                                                <p className="text-sm">{property.fund || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Additional Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Calendar className="h-5 w-5" />
                                            Record Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Created</label>
                                                <p className="text-sm">{property.created_at}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                                                <p className="text-sm">{property.updated_at}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Sidebar - 1/3 width */}
                            <div className="space-y-6">
                                {/* Assignment Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <User className="h-5 w-5" />
                                            Assignment
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                                <User className="h-4 w-4" />
                                                Assigned User
                                            </label>
                                            <p className="text-sm font-medium mt-1">{property.user}</p>
                                        </div>
                                        <Separator />
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                                <MapPin className="h-4 w-4" />
                                                Location
                                            </label>
                                            <p className="text-sm font-medium mt-1">{property.location}</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Status Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Wrench className="h-5 w-5" />
                                            Status & Condition
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Condition</label>
                                            <div className="mt-1">
                                                <Badge variant="outline">{property.condition}</Badge>
                                            </div>
                                        </div>

                                        {property.color && (
                                            <>
                                                <Separator />
                                                <div>
                                                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                                        <Palette className="h-4 w-4" />
                                                        Color
                                                    </label>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <div
                                                            className="w-4 h-4 rounded-full border border-border"
                                                            style={{ backgroundColor: property.color }}
                                                        ></div>
                                                        <span className="text-sm">{property.color}</span>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Quick Actions */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Quick Actions</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start"
                                            onClick={openEditModal}
                                        >
                                            <Pencil className="h-4 w-4 mr-2" />
                                            Edit Property
                                        </Button>

                                        <Button
                                            variant="outline"
                                            className="w-full justify-start"
                                            onClick={handlePrintSticker}
                                        >
                                            <Printer className="h-4 w-4 mr-2" />
                                            Print Sticker
                                        </Button>

                                        {/* Delete Popover */}
                                        <Popover open={openDelete} onOpenChange={setOpenDelete}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete Property
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80 p-0" align="center" side="bottom">
                                                <div className="p-4 space-y-3">
                                                    <div className="flex items-start gap-3">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10 flex-shrink-0 mt-0.5">
                                                            <AlertTriangle className="h-4 w-4 text-destructive" />
                                                        </div>
                                                        <div className="space-y-1 flex-1">
                                                            <h4 className="text-sm font-medium text-foreground">Delete property</h4>
                                                            <p className="text-xs text-muted-foreground leading-relaxed">
                                                                Delete "{property.item_name}"? This action cannot be undone and you will be redirected to the properties list.
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 pt-1">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setOpenDelete(false)}
                                                            disabled={deleteProcessing}
                                                            className="flex-1 h-8 text-xs"
                                                        >
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={handleDeleteConfirm}
                                                            disabled={deleteProcessing}
                                                            className="flex-1 h-8 text-xs"
                                                        >
                                                            {deleteProcessing ? 'Deleting…' : 'Delete'}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Dialog */}
            <Dialog open={openEdit} onOpenChange={setOpenEdit}>
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
                                        disabled={editProcessing}
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
                                        disabled={editProcessing}
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
                                        disabled={editProcessing}
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
                                        disabled={editProcessing}
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
                                        disabled={editProcessing}
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
                                        disabled={editProcessing}
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
                                        disabled={editProcessing}
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
                                        disabled={editProcessing}
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
                                    <Select value={data.fund} onValueChange={(v) => setData('fund', v)} disabled={editProcessing}>
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
                                        disabled={editProcessing}
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
                                    disabled={editProcessing}
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
                                    disabled={editProcessing}
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
                                    disabled={editProcessing}
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
                                        disabled={editProcessing}
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
                                            disabled={editProcessing}
                                        />
                                        <Input
                                            placeholder="#000000"
                                            value={data.color}
                                            onChange={(e) => setData('color', e.target.value)}
                                            className={`flex-1 ${errors.color ? 'border-red-500' : ''}`}
                                            disabled={editProcessing}
                                        />
                                    </div>
                                    {errors.color && <p className="text-sm text-red-500">{errors.color}</p>}
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => setOpenEdit(false)} disabled={editProcessing}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={editProcessing || !data.item_name || !data.location_id || !data.user_id || !data.condition_id}
                                className="min-w-[140px]"
                            >
                                {editProcessing ? 'Saving changes…' : 'Save changes'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
