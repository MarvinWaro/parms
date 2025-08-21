import AppLayout from '@/layouts/app-layout';
import { Head, usePage, Link, useForm } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { ArrowLeft, Package, Calendar, DollarSign, MapPin, User, Wrench, Palette, Pencil, Trash2, Printer, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

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
    created_at: string;
    updated_at: string;
};

type PageProps = {
    property: PropertyData;
};

const peso = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 2 });

export default function PropertyShow() {
    const { props } = usePage<PageProps>();
    const { property } = props;
    const [openDelete, setOpenDelete] = useState(false);

    const { delete: deleteRequest, processing } = useForm();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Property', href: '/property' },
        { title: property.item_name, href: `/property/${property.id}` }
    ];

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
                                        <Link href={route('properties.index')}>
                                            <Button variant="outline" className="w-full justify-start">
                                                <Pencil className="h-4 w-4 mr-2" />
                                                Edit Property
                                            </Button>
                                        </Link>

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
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
