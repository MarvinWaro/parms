import PropertyRowTemplate from '@/components/property/ui/property-row';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Package, Plus, Search } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Property', href: '/property' }];

type PropertyRow = {
    id: string;
    property_number: string;
    item_name: string;
    location: string;
    condition: string;
    acquisition_cost: number | null;
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

type PageProps = {
    properties: PropertyRow[];
    locations: DropdownOption[];
    users: DropdownOption[];
    conditions: DropdownOption[];
    funds: FundOption[];
};

const initialForm = {
    item_name: '',
    property_number: '',
    serial_no: '',
    model_no: '',
    acquisition_date: '',
    acquisition_cost: '',
    unit_of_measure: '',
    quantity_per_physical_count: '1',
    fund: '',
    location_id: '',
    user_id: '',
    condition_id: '',
    item_description: '',
    remarks: '',
    color: '#000000',
};

const peso = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 2 });

export default function PropertyIndex() {
    const { props } = usePage<PageProps>();
    const { properties, locations, users, conditions, funds } = props;

    const [searchQuery, setSearchQuery] = useState('');
    const [openCreate, setOpenCreate] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm(initialForm);

    const clearForm = () => {
        setData(initialForm);
        clearErrors?.();
    };

    const filteredRows = properties.filter((r) => {
        const q = searchQuery.toLowerCase();
        return (
            r.item_name.toLowerCase().includes(q) ||
            r.property_number.toLowerCase().includes(q) ||
            r.location.toLowerCase().includes(q) ||
            r.condition.toLowerCase().includes(q) ||
            (r.acquisition_cost !== null && peso.format(r.acquisition_cost).toLowerCase().includes(q))
        );
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        setData({
            ...data,
            acquisition_cost: data.acquisition_cost === '' ? '' : String(parseFloat(String(data.acquisition_cost))),
            quantity_per_physical_count: String(parseInt(String(data.quantity_per_physical_count)) || 1),
            property_number: data.property_number || '',
            serial_no: data.serial_no || '',
            model_no: data.model_no || '',
            acquisition_date: data.acquisition_date || '',
            unit_of_measure: data.unit_of_measure || '',
            fund: data.fund || '',
            item_description: data.item_description || '',
            remarks: data.remarks || '',
            color: data.color || '',
        });

        const promise = new Promise<void>((resolve, reject) => {
            post(route('properties.store'), {
                preserveScroll: true,
                onSuccess: () => resolve(),
                onError: () => reject('Failed to create property. Please check the form and try again.'),
            });
        });

        toast.promise(promise, {
            loading: 'Creating property...',
            success: 'Property created successfully!',
            error: (m) => m,
            duration: 2000,
        });

        promise.then(() => {
            clearForm();
            setOpenCreate(false);
        });
    };

    const handleOpenChange = (open: boolean) => {
        setOpenCreate(open);
        if (open) {
            clearForm();
        } else {
            reset();
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Properties" />

            <div className="bg-background pb-6">
                <div className="space-y-4">
                    {/* Header Section */}
                    <div className="space-y-2 px-6 pt-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h5 className="text-xl font-bold tracking-tight text-foreground">Properties and Assets</h5>
                                <p className="text-sm text-muted-foreground">Manage your organization's properties and assets</p>
                            </div>

                            {/* Create modal */}
                            <Dialog
                                open={openCreate}
                                onOpenChange={(v) => {
                                    if (!v) clearForm();
                                    setOpenCreate(v);
                                }}
                            >
                                <DialogTrigger asChild>
                                    <Button size="default" className="shadow-sm">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Property
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
                                    <DialogHeader>
                                        <DialogTitle className="flex items-center gap-2">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                                <Package className="h-4 w-4 text-primary" />
                                            </div>
                                            Add New Property
                                        </DialogTitle>
                                        <DialogDescription>Fill in the details below to add a new property to your inventory.</DialogDescription>
                                    </DialogHeader>

                                    <form onSubmit={handleSubmit}>
                                        <div className="grid gap-4 py-4">
                                            {/* Row 1 */}
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="item_name">
                                                        Item Name <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Input
                                                        id="item_name"
                                                        name="item_name"
                                                        placeholder="e.g., Dell Latitude 5440"
                                                        value={data.item_name}
                                                        onChange={(e) => setData('item_name', e.target.value)}
                                                        className={errors.item_name ? 'border-red-500' : ''}
                                                        disabled={processing}
                                                    />
                                                    {errors.item_name && <p className="text-sm text-red-500">{errors.item_name}</p>}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="property_number">Property Number</Label>
                                                    <Input
                                                        id="property_number"
                                                        name="property_number"
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
                                                    <Label htmlFor="serial_no">Serial No</Label>
                                                    <Input
                                                        id="serial_no"
                                                        name="serial_no"
                                                        placeholder="e.g., ABC123456"
                                                        value={data.serial_no}
                                                        onChange={(e) => setData('serial_no', e.target.value)}
                                                        className={errors.serial_no ? 'border-red-500' : ''}
                                                        disabled={processing}
                                                    />
                                                    {errors.serial_no && <p className="text-sm text-red-500">{errors.serial_no}</p>}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="model_no">Model No</Label>
                                                    <Input
                                                        id="model_no"
                                                        name="model_no"
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
                                                    <Label htmlFor="acquisition_date">Acquisition Date</Label>
                                                    <Input
                                                        id="acquisition_date"
                                                        name="acquisition_date"
                                                        type="date"
                                                        value={data.acquisition_date}
                                                        onChange={(e) => setData('acquisition_date', e.target.value)}
                                                        className={errors.acquisition_date ? 'border-red-500' : ''}
                                                        disabled={processing}
                                                    />
                                                    {errors.acquisition_date && <p className="text-sm text-red-500">{errors.acquisition_date}</p>}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="acquisition_cost">Acquisition Cost</Label>
                                                    <Input
                                                        id="acquisition_cost"
                                                        name="acquisition_cost"
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
                                                    <Label htmlFor="unit_of_measure">Unit of Measure</Label>
                                                    <Input
                                                        id="unit_of_measure"
                                                        name="unit_of_measure"
                                                        placeholder="e.g., pcs, unit, box"
                                                        value={data.unit_of_measure}
                                                        onChange={(e) => setData('unit_of_measure', e.target.value)}
                                                        className={errors.unit_of_measure ? 'border-red-500' : ''}
                                                        disabled={processing}
                                                    />
                                                    {errors.unit_of_measure && <p className="text-sm text-red-500">{errors.unit_of_measure}</p>}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="quantity_per_physical_count">Quantity (Per Physical Count)</Label>
                                                    <Input
                                                        id="quantity_per_physical_count"
                                                        name="quantity_per_physical_count"
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
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                {/* Fund */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="fund">Fund</Label>
                                                    <Select
                                                        name="fund"
                                                        value={data.fund}
                                                        onValueChange={(v) => setData('fund', v)}
                                                        disabled={processing}
                                                    >
                                                        <SelectTrigger id="fund" className={`w-full ${errors.fund ? 'border-red-500' : ''}`}>
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

                                                {/* User */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="user_id">
                                                        User <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Select
                                                        name="user_id"
                                                        value={data.user_id || ''}
                                                        onValueChange={(v) => setData('user_id', v)}
                                                        disabled={processing}
                                                    >
                                                        <SelectTrigger id="user_id" className={`w-full ${errors.user_id ? 'border-red-500' : ''}`}>
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

                                            {/* Row 6: Location (full width) */}
                                            <div className="space-y-2">
                                                <Label htmlFor="location_id">
                                                    Location / Whereabouts <span className="text-red-500">*</span>
                                                </Label>
                                                <Select
                                                    name="location_id"
                                                    value={data.location_id || ''}
                                                    onValueChange={(v) => setData('location_id', v)}
                                                    disabled={processing}
                                                >
                                                    <SelectTrigger
                                                        id="location_id"
                                                        className={`w-full ${errors.location_id ? 'border-red-500' : ''}`}
                                                    >
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

                                            {/* Row 7: Condition (full width) */}
                                            <div className="space-y-2">
                                                <Label htmlFor="condition_id">
                                                    Condition <span className="text-red-500">*</span>
                                                </Label>
                                                <Select
                                                    name="condition_id"
                                                    value={data.condition_id || ''}
                                                    onValueChange={(v) => setData('condition_id', v)}
                                                    disabled={processing}
                                                >
                                                    <SelectTrigger
                                                        id="condition_id"
                                                        className={`w-full ${errors.condition_id ? 'border-red-500' : ''}`}
                                                    >
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
                                                <Label htmlFor="item_description">Item Description</Label>
                                                <Textarea
                                                    id="item_description"
                                                    name="item_description"
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
                                                    <Label htmlFor="remarks">Remarks</Label>
                                                    <Textarea
                                                        id="remarks"
                                                        name="remarks"
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
                                                    <Label htmlFor="color">Color</Label>
                                                    <div className="flex items-center gap-2">
                                                        <Input
                                                            id="color"
                                                            name="color"
                                                            type="color"
                                                            value={data.color}
                                                            onChange={(e) => setData('color', e.target.value)}
                                                            className={`h-10 w-16 p-1 ${errors.color ? 'border-red-500' : ''}`}
                                                            disabled={processing}
                                                        />
                                                        <Input
                                                            id="color_text"
                                                            name="color_text"
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
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    clearForm();
                                                    setOpenCreate(false);
                                                }}
                                                disabled={processing}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={processing || !data.item_name || !data.location_id || !data.user_id || !data.condition_id}
                                            >
                                                {processing ? 'Creating...' : 'Create Property'}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    {/* Stats and Search Section */}
                    <div className="flex flex-col gap-4 px-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="px-3 py-1.5 text-sm font-medium">
                                {properties.length} {properties.length === 1 ? 'Property' : 'Properties'}
                            </Badge>
                            {searchQuery && (
                                <Badge variant="outline" className="px-3 py-1.5 text-sm">
                                    {filteredRows.length} filtered
                                </Badge>
                            )}
                        </div>

                        {/* Search */}
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search properties..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 transition-all duration-200"
                            />
                        </div>
                    </div>

                    {/* Table Card */}
                    <Card className="rounded-none border-0 bg-card shadow-none">
                        <CardContent className="p-0">
                            <div className="overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-b border-border/50 bg-muted/30 hover:bg-muted/30">
                                            <TableHead className="h-14 w-[28rem] px-6 text-sm font-semibold text-foreground/90">
                                                Item / Property No.
                                            </TableHead>
                                            <TableHead className="h-14 px-6 text-sm font-semibold text-foreground/90">Location</TableHead>
                                            <TableHead className="h-14 px-6 text-sm font-semibold text-foreground/90">Condition</TableHead>
                                            <TableHead className="h-14 w-40 px-6 text-right text-sm font-semibold text-foreground/90">
                                                Unit Cost
                                            </TableHead>
                                            <TableHead className="h-14 w-32 px-6 text-right text-sm font-semibold text-foreground/90">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {filteredRows.map((row, index) => (
                                            <PropertyRowTemplate
                                                key={row.id}
                                                row={row}
                                                index={index}
                                                locations={locations}
                                                users={users}
                                                conditions={conditions}
                                                funds={funds}
                                            />
                                        ))}
                                    </TableBody>
                                </Table>

                                {/* Empty states */}
                                {filteredRows.length === 0 && (
                                    <div className="flex flex-col items-center justify-center px-6 py-20">
                                        {searchQuery ? (
                                            <>
                                                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-muted/50">
                                                    <Search className="h-8 w-8 text-muted-foreground" />
                                                </div>
                                                <h3 className="mb-2 text-xl font-semibold text-foreground">No properties found</h3>
                                                <p className="mb-6 max-w-md text-center text-sm leading-relaxed text-muted-foreground">
                                                    No properties match your search for "{searchQuery}". Try adjusting your terms.
                                                </p>
                                                <Button variant="outline" onClick={() => setSearchQuery('')} size="sm">
                                                    Clear search
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
                                                    <Package className="h-8 w-8 text-primary" />
                                                </div>
                                                <h3 className="mb-2 text-xl font-semibold text-foreground">No properties yet</h3>
                                                <p className="mb-8 max-w-md text-center text-sm leading-relaxed text-muted-foreground">
                                                    Get started by adding your first property to your inventory.
                                                </p>
                                                <Button onClick={() => setOpenCreate(true)}>
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Add Your First Property
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
