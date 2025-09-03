import EditPropertyModal from '@/components/property/ui/edit-property-modal';
import ConsolidatedQRSticker from '@/components/property/ui/consolidated-qr-sticker';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft, Calendar, DollarSign, MapPin, Package, Palette, Pencil, Printer, Trash2, User, Wrench, Eye, Info } from 'lucide-react';
import { useState } from 'react';
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
    item_description?: string;
    remarks?: string;
    color?: string;
    qr_code_url?: string;
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
    userRole?: string;
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
};

const peso = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 2 });

export default function PropertyShow() {
    const { props } = usePage<PageProps>();
    const { property, locations, users, conditions, funds, auth } = props;
    const [openDelete, setOpenDelete] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);

    // Check if current user is admin
    const isAdmin = auth.user.role === 'admin';
    const isStaff = auth.user.role === 'staff';

    const { delete: deleteRequest, processing: deleteProcessing } = useForm();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Property', href: '/property' },
        { title: property.item_name, href: `/property/${property.id}` },
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
                                            <ArrowLeft className="mr-2 h-4 w-4" />
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
                                {/* Show staff read-only badge */}
                                {isStaff && (
                                    <Badge variant="secondary" className="px-3 py-1.5">
                                        <Eye className="mr-1 h-3 w-3" />
                                        View Only
                                    </Badge>
                                )}
                                <Link href={route('properties.index')}>
                                    <Button variant="outline">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back to List
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Staff Info Section */}
                    {isStaff && (
                        <div className="px-6">
                            <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
                                <Info className="h-5 w-5 text-blue-600" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-blue-900">
                                        This property is assigned to your care
                                    </p>
                                    <p className="text-xs text-blue-700">
                                        You can view all details and print QR codes, but cannot modify property information.
                                        Contact your administrator for any changes needed.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Content Grid */}
                    <div className="px-6">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            {/* Main Content - 2/3 width */}
                            <div className="space-y-6 lg:col-span-2">
                                {/* Basic Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Package className="h-5 w-5" />
                                            Basic Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                                                    <p className="mt-1 text-sm leading-relaxed">{property.item_description}</p>
                                                </div>
                                            </>
                                        )}

                                        {property.remarks && (
                                            <>
                                                <Separator />
                                                <div>
                                                    <label className="text-sm font-medium text-muted-foreground">Remarks</label>
                                                    <p className="mt-1 text-sm leading-relaxed">{property.remarks}</p>
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
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                                <User className="h-4 w-4" />
                                                Assigned User
                                            </label>
                                            <p className="mt-1 text-sm font-medium">{property.user}</p>
                                        </div>
                                        <Separator />
                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                                <MapPin className="h-4 w-4" />
                                                Location
                                            </label>
                                            <p className="mt-1 text-sm font-medium">{property.location}</p>
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
                                                    <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                                        <Palette className="h-4 w-4" />
                                                        Color
                                                    </label>
                                                    <div className="mt-1 flex items-center gap-2">
                                                        <div
                                                            className="h-4 w-4 rounded-full border border-border"
                                                            style={{ backgroundColor: property.color }}
                                                        ></div>
                                                        <span className="text-sm">{property.color}</span>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* QR Code & Official Sticker */}
                                {property.qr_code_url && (
                                    <ConsolidatedQRSticker
                                        propertyData={{
                                            item_name: property.item_name,
                                            property_number: property.property_number,
                                            qr_code_url: property.qr_code_url,
                                            location: property.location,
                                            user: property.user
                                        }}
                                    />
                                )}

                                {/* Quick Actions - Only show for admin users */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Quick Actions</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        {isAdmin ? (
                                            <>
                                                {/* Admin Actions */}
                                                <Button variant="outline" className="w-full justify-start" onClick={() => setOpenEdit(true)}>
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit Property
                                                </Button>

                                                {/* Delete Popover */}
                                                <Popover open={openDelete} onOpenChange={setOpenDelete}>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete Property
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-80 p-0" align="center" side="bottom">
                                                        <div className="space-y-3 p-4">
                                                            <div className="flex items-start gap-3">
                                                                <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-destructive/10">
                                                                    <AlertTriangle className="h-4 w-4 text-destructive" />
                                                                </div>
                                                                <div className="flex-1 space-y-1">
                                                                    <h4 className="text-sm font-medium text-foreground">Delete property</h4>
                                                                    <p className="text-xs leading-relaxed text-muted-foreground">
                                                                        Delete "{property.item_name}"? This action cannot be undone and you will be redirected
                                                                        to the properties list.
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-2 pt-1">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => setOpenDelete(false)}
                                                                    disabled={deleteProcessing}
                                                                    className="h-8 flex-1 text-xs"
                                                                >
                                                                    Cancel
                                                                </Button>
                                                                <Button
                                                                    variant="destructive"
                                                                    size="sm"
                                                                    onClick={handleDeleteConfirm}
                                                                    disabled={deleteProcessing}
                                                                    className="h-8 flex-1 text-xs"
                                                                >
                                                                    {deleteProcessing ? 'Deleting…' : 'Delete'}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                            </>
                                        ) : (
                                            <>
                                                {/* Staff Actions - View Only */}
                                                <div className="space-y-3">
                                                    <div className="text-center py-4">
                                                        <Eye className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                                        <p className="text-sm text-muted-foreground">
                                                            You can view this property but cannot make changes
                                                        </p>
                                                    </div>
                                                    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                                                        <p className="text-xs text-yellow-800">
                                                            <strong>Need to make changes?</strong><br />
                                                            Contact your administrator to modify property details, location, or assignment.
                                                        </p>
                                                    </div>

                                                    {/* Staff can still print QR codes */}
                                                    {property.qr_code_url && (
                                                        <Button
                                                            variant="outline"
                                                            className="w-full justify-start"
                                                            onClick={() => window.open(property.qr_code_url, '_blank')}
                                                        >
                                                            <Printer className="mr-2 h-4 w-4" />
                                                            View QR Code
                                                        </Button>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Shared Edit Modal - Only for admin users */}
            {isAdmin && (
                <EditPropertyModal
                    open={openEdit}
                    onOpenChange={setOpenEdit}
                    property={property}
                    locations={locations}
                    users={users}
                    conditions={conditions}
                    funds={funds}
                    source="show"
                    onSuccess={() => {
                        // Optional: Add any specific success handling for show page
                        // The shared modal already handles toast notifications
                    }}
                />
            )}
        </AppLayout>
    );
}
