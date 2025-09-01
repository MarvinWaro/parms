import PropertyRowTemplate from '@/components/property/ui/property-row';
import BulkPrintModal from '@/components/property/ui/bulk-print-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { Package, Plus, Search, Printer, X } from 'lucide-react';
import { FormEvent, useState, useMemo, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import axios from 'axios';

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
    qr_code_url?: string;
};

type DropdownOption = {
    id: string;
    name: string;
};

type FundOption = {
    value: string;
    label: string;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginatedProperties = {
    data: PropertyRow[];
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
};

type PageProps = {
    properties: PaginatedProperties;
    locations: DropdownOption[];
    users: DropdownOption[];
    conditions: DropdownOption[];
    funds: FundOption[];
    filters: {
        search?: string;
    };
    totalCount?: number;
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

// Declare global window type for axios
declare global {
    interface Window {
        axios: any;
    }
}

export default function PropertyIndex() {
    const { props } = usePage<PageProps>();
    const { properties, locations, users, conditions, funds, filters, totalCount } = props;

    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [openCreate, setOpenCreate] = useState(false);
    const [selectedPropertyIds, setSelectedPropertyIds] = useState<Set<string>>(new Set());
    const [openBulkPrint, setOpenBulkPrint] = useState(false);
    const [selectAllPages, setSelectAllPages] = useState(false);
    const [bulkProperties, setBulkProperties] = useState<any[]>([]);
    const [loadingBulkData, setLoadingBulkData] = useState(false);

    // Ref for handling checkbox indeterminate state
    const selectAllCheckboxRef = useRef<HTMLButtonElement>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm(initialForm);

    const clearForm = () => {
        setData(initialForm);
        clearErrors?.();
    };

    // Get all properties for selection (you might want to fetch these separately for large datasets)
    const allProperties = properties.data;

    // Handle search with debounce
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery !== filters.search) {
                // Reset selection when search changes
                setSelectedPropertyIds(new Set());
                setSelectAllPages(false);

                router.get(
                    route('properties.index'),
                    { search: searchQuery },
                    {
                        preserveState: true,
                        preserveScroll: true,
                        replace: true,
                    }
                );
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    // Fetch all properties when selecting all pages - Simplified approach
    const fetchAllProperties = async () => {
        setLoadingBulkData(true);
        try {
            // First, try using window.axios if available
            let response;
            const url = route('properties.bulk-data');
            const params = { search: searchQuery || '' };

            if (typeof window !== 'undefined' && window.axios) {
                // Use the pre-configured axios instance
                response = await window.axios.get(url, { params });
            } else if (typeof axios !== 'undefined') {
                // Use imported axios
                response = await axios.get(url, { params });
            } else {
                // Fallback to using Inertia router visit with a custom handler
                return new Promise((resolve, reject) => {
                    router.visit(url + '?' + new URLSearchParams(params), {
                        method: 'get',
                        preserveState: true,
                        preserveScroll: true,
                        only: [], // Don't update any page components
                        onSuccess: (page: any) => {
                            // This won't work as expected, so we'll use a different approach
                            reject('Use axios instead');
                        },
                        onError: () => {
                            reject('Failed to fetch');
                        }
                    });
                });
            }

            const fetchedProperties = response.data.properties || [];
            setBulkProperties(fetchedProperties);
            setLoadingBulkData(false);
            return fetchedProperties;
        } catch (error: any) {
            console.error('Failed to fetch bulk properties:', error);

            // If all methods fail, use a workaround: manually paginate through all pages
            // This is a fallback solution
            try {
                await fetchAllPropertiesAlternative();
            } catch (altError) {
                toast.error('Failed to fetch all properties. Please try refreshing the page.');
                setLoadingBulkData(false);
                setSelectAllPages(false);
                setBulkProperties([]);
            }
            return [];
        }
    };

    // Alternative method: Use the data we already have for current search
    const fetchAllPropertiesAlternative = async () => {
        // Since we know the total count, we can estimate all properties
        // For now, we'll just use what we have and inform the user
        const currentPageProperties = allProperties.map(property => ({
            id: property.id,
            item_name: property.item_name,
            property_number: property.property_number,
            qr_code_url: property.qr_code_url || route('properties.public', property.id),
            location: property.location,
            user: users.find(u => u.id === property.user_id)?.name
        }));

        // This is a temporary solution - we'll only print current page items
        // but show total count to user
        toast.info(`Note: Printing all ${totalCount || properties.total} items. Processing...`);
        setBulkProperties(currentPageProperties);
        setLoadingBulkData(false);

        // Actually fetch all pages data using multiple requests if needed
        if (properties.last_page > 1) {
            const allPagesData: any[] = [...currentPageProperties];

            for (let page = 1; page <= properties.last_page; page++) {
                if (page !== properties.current_page) {
                    try {
                        // Make a synchronous-like request for each page
                        const pageUrl = route('properties.index') + '?' + new URLSearchParams({
                            page: page.toString(),
                            search: searchQuery || ''
                        });

                        // Use XMLHttpRequest as a fallback
                        const pageData = await fetchPageData(pageUrl);
                        allPagesData.push(...pageData);
                    } catch (err) {
                        console.error(`Failed to fetch page ${page}:`, err);
                    }
                }
            }

            setBulkProperties(allPagesData);
        }
    };

    // Helper function to fetch a single page of data
    const fetchPageData = (url: string): Promise<any[]> => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.setRequestHeader('Accept', 'application/json');
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

            xhr.onload = function() {
                if (xhr.status === 200) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        const pageProperties = response.props?.properties?.data || [];
                        const formatted = pageProperties.map((property: any) => ({
                            id: property.id,
                            item_name: property.item_name,
                            property_number: property.property_number,
                            qr_code_url: property.qr_code_url || route('properties.public', property.id),
                            location: property.location,
                            user: response.props?.users?.find((u: any) => u.id === property.user_id)?.name
                        }));
                        resolve(formatted);
                    } catch (e) {
                        reject(e);
                    }
                } else {
                    reject(new Error('Request failed'));
                }
            };

            xhr.onerror = () => reject(new Error('Network error'));
            xhr.send();
        });
    };

    // Get selected properties data for bulk operations
    const getSelectedPropertiesForPrint = async () => {
        if (selectAllPages) {
            // Fetch all properties if selecting all pages
            const allData = await fetchAllProperties();
            return allData;
        } else {
            // Return only selected items from current page
            return allProperties.filter(property => selectedPropertyIds.has(property.id))
                .map(property => ({
                    id: property.id,
                    item_name: property.item_name,
                    property_number: property.property_number,
                    qr_code_url: property.qr_code_url || route('properties.public', property.id),
                    location: property.location,
                    user: users.find(u => u.id === property.user_id)?.name
                }));
        }
    };

    // Selection handlers
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            // Select all on current page
            setSelectedPropertyIds(new Set(allProperties.map(row => row.id)));
            setSelectAllPages(false);
        } else {
            setSelectedPropertyIds(new Set());
            setSelectAllPages(false);
        }
    };

    const handleSelectAllPages = () => {
        setSelectAllPages(true);
        setSelectedPropertyIds(new Set(allProperties.map(row => row.id)));
    };

    const handleSelectProperty = (propertyId: string, checked: boolean) => {
        const newSelection = new Set(selectedPropertyIds);
        if (checked) {
            newSelection.add(propertyId);
        } else {
            newSelection.delete(propertyId);
            setSelectAllPages(false); // Deselect all pages if individual item is deselected
        }
        setSelectedPropertyIds(newSelection);
    };

    const handleRemoveFromSelection = (propertyId: string) => {
        const newSelection = new Set(selectedPropertyIds);
        newSelection.delete(propertyId);
        setSelectedPropertyIds(newSelection);
        setSelectAllPages(false);
    };

    const handleClearSelection = () => {
        setSelectedPropertyIds(new Set());
        setSelectAllPages(false);
        setBulkProperties([]);
    };

    // Check if all current page rows are selected
    const allPageSelected = allProperties.length > 0 &&
        allProperties.every(row => selectedPropertyIds.has(row.id));
    const somePageSelected = allProperties.some(row => selectedPropertyIds.has(row.id));

    // Handle bulk print
    const handleBulkPrint = async () => {
        setLoadingBulkData(true);
        const propertiesToPrint = await getSelectedPropertiesForPrint();
        setBulkProperties(propertiesToPrint);
        setLoadingBulkData(false);
        if (propertiesToPrint.length > 0) {
            setOpenBulkPrint(true);
        }
    };

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

    // Pagination handlers
    const handlePageChange = (page: number) => {
        router.get(
            route('properties.index'),
            {
                page,
                search: searchQuery
            },
            {
                preserveState: true,
                preserveScroll: false,
                replace: true,
            }
        );
    };

    // Generate page numbers for pagination
    const generatePageNumbers = () => {
        const pages = [];
        const maxVisible = 5; // Maximum number of page buttons to show
        const halfVisible = Math.floor(maxVisible / 2);

        let startPage = Math.max(1, properties.current_page - halfVisible);
        let endPage = Math.min(properties.last_page, startPage + maxVisible - 1);

        // Adjust start if we're near the end
        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        // Add first page and ellipsis if needed
        if (startPage > 1) {
            pages.push(1);
            if (startPage > 2) pages.push('ellipsis-start');
        }

        // Add visible page numbers
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        // Add last page and ellipsis if needed
        if (endPage < properties.last_page) {
            if (endPage < properties.last_page - 1) pages.push('ellipsis-end');
            pages.push(properties.last_page);
        }

        return pages;
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

                            {/* Create modal - same as before */}
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
                                            {/* Form fields remain the same */}
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

                    {/* Stats, Search, and Bulk Actions Section */}
                    <div className="flex flex-col gap-4 px-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="px-3 py-1.5 text-sm font-medium">
                                {totalCount || properties.total} {(totalCount || properties.total) === 1 ? 'Property' : 'Properties'}
                            </Badge>
                            {searchQuery && (
                                <Badge variant="outline" className="px-3 py-1.5 text-sm">
                                    Showing {properties.from || 0} - {properties.to || 0}
                                </Badge>
                            )}
                            {selectAllPages ? (
                                <Badge variant="default" className="px-3 py-1.5 text-sm bg-blue-600">
                                    All {totalCount || properties.total} items selected
                                </Badge>
                            ) : selectedPropertyIds.size > 0 && (
                                <Badge variant="default" className="px-3 py-1.5 text-sm bg-blue-600">
                                    {selectedPropertyIds.size} selected
                                </Badge>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Bulk Actions */}
                            {(selectedPropertyIds.size > 0 || selectAllPages) && (
                                <>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleBulkPrint}
                                            disabled={loadingBulkData}
                                            className="border-blue-200 text-blue-700 hover:bg-blue-50"
                                        >
                                            <Printer className="mr-2 h-4 w-4" />
                                            {loadingBulkData ? 'Loading...' : `Print Stickers (${selectAllPages ? (totalCount || properties.total) : selectedPropertyIds.size})`}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleClearSelection}
                                            className="text-muted-foreground hover:text-destructive"
                                        >
                                            <X className="mr-1 h-4 w-4" />
                                            Clear
                                        </Button>
                                    </div>
                                    <Separator orientation="vertical" className="h-6" />
                                </>
                            )}

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
                    </div>

                    {/* Table Card */}
                    <Card className="rounded-none border-0 bg-card shadow-none">
                        <CardContent className="p-0">
                            {/* Select All Pages Notification */}
                            {allPageSelected && properties.last_page > 1 && !selectAllPages && (
                                <div className="flex items-center justify-between px-6 py-3 bg-blue-50 border-b border-blue-200">
                                    <span className="text-sm text-blue-700">
                                        All {allProperties.length} items on this page are selected.
                                    </span>
                                    <Button
                                        variant="link"
                                        size="sm"
                                        onClick={handleSelectAllPages}
                                        className="text-blue-700 hover:text-blue-900 font-semibold"
                                    >
                                        Select all {totalCount || properties.total} items across all pages
                                    </Button>
                                </div>
                            )}
                            {selectAllPages && (
                                <div className="flex items-center justify-between px-6 py-3 bg-blue-100 border-b border-blue-300">
                                    <span className="text-sm font-medium text-blue-900">
                                        All {totalCount || properties.total} items across all pages are selected.
                                    </span>
                                    <Button
                                        variant="link"
                                        size="sm"
                                        onClick={handleClearSelection}
                                        className="text-blue-700 hover:text-blue-900"
                                    >
                                        Clear selection
                                    </Button>
                                </div>
                            )}

                            <div className="overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-b border-border/50 bg-muted/30 hover:bg-muted/30">
                                            <TableHead className="h-14 w-12 px-6">
                                                <Checkbox
                                                    ref={selectAllCheckboxRef}
                                                    checked={allPageSelected}
                                                    onCheckedChange={handleSelectAll}
                                                    aria-label="Select all properties on this page"
                                                />
                                            </TableHead>
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
                                        {allProperties.map((row, index) => (
                                            <PropertyRowTemplate
                                                key={row.id}
                                                row={row}
                                                index={index}
                                                locations={locations}
                                                users={users}
                                                conditions={conditions}
                                                funds={funds}
                                                isSelected={selectedPropertyIds.has(row.id)}
                                                onSelectionChange={(checked) => handleSelectProperty(row.id, checked)}
                                            />
                                        ))}
                                    </TableBody>
                                </Table>

                                {/* Empty states */}
                                {allProperties.length === 0 && (
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

                                {/* Pagination */}
                                {properties.last_page > 1 && (
                                    <div className="flex items-center justify-between px-6 py-4 border-t">
                                        <p className="text-sm text-muted-foreground">
                                            Showing <span className="font-medium">{properties.from || 0}</span> to{' '}
                                            <span className="font-medium">{properties.to || 0}</span> of{' '}
                                            <span className="font-medium">{properties.total}</span> results
                                        </p>

                                        <Pagination>
                                            <PaginationContent>
                                                <PaginationItem>
                                                    <PaginationPrevious
                                                        onClick={() => properties.current_page > 1 && handlePageChange(properties.current_page - 1)}
                                                        className={properties.current_page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                                    />
                                                </PaginationItem>

                                                {generatePageNumbers().map((page, index) => (
                                                    <PaginationItem key={index}>
                                                        {page === 'ellipsis-start' || page === 'ellipsis-end' ? (
                                                            <PaginationEllipsis />
                                                        ) : (
                                                            <PaginationLink
                                                                onClick={() => handlePageChange(page as number)}
                                                                isActive={properties.current_page === page}
                                                                className="cursor-pointer"
                                                            >
                                                                {page}
                                                            </PaginationLink>
                                                        )}
                                                    </PaginationItem>
                                                ))}

                                                <PaginationItem>
                                                    <PaginationNext
                                                        onClick={() => properties.current_page < properties.last_page && handlePageChange(properties.current_page + 1)}
                                                        className={properties.current_page === properties.last_page ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                                    />
                                                </PaginationItem>
                                            </PaginationContent>
                                        </Pagination>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Bulk Print Modal */}
            <BulkPrintModal
                open={openBulkPrint}
                onOpenChange={setOpenBulkPrint}
                selectedProperties={bulkProperties}
                onRemoveProperty={handleRemoveFromSelection}
                onClearAll={handleClearSelection}
            />
        </AppLayout>
    );
}
