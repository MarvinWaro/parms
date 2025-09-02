// File: C:\Users\MARVIN\projects\parms\resources\js\components\property\ui\public-property-view.tsx

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Footer from '@/components/footer';
import { Head } from '@inertiajs/react';
import {
    Package,
    MapPin,
    User,
    Calendar,
    DollarSign,
    Palette,
    Wrench,
    Shield,
    Clock,
    Hash,
    FileText,
    Info,
    Building2,
    Smartphone
} from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';

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
    condition: string;
    location: string;
    user: string;
    color?: string;
    created_at: string;
    updated_at: string;
};

interface PublicPropertyViewProps {
    property: PropertyData;
}

const peso = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 2
});

export default function PublicPropertyView({ property }: PublicPropertyViewProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Head title={`${property.item_name} - Property Information`} />

            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="bg-[#006241] text-white">
                    <div className="max-w-7xl mx-auto px-4 py-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                                    <AppLogoIcon className="h-10 w-10" />
                                </div>
                                <div>
                                    <h1 className="text-lg font-semibold">PARMS</h1>
                                    <p className="text-xs text-green-100">Property and Assets Registry Management System</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                                    <Shield className="mr-1 h-3 w-3" />
                                    Official
                                </Badge> */}
                                <Badge className="bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-700">
                                    <Clock className="mr-1 h-3 w-3" />
                                    Live Data
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#006241] text-white shadow-md">
                            <Package className="h-8 w-8" />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">{property.item_name}</h1>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                    <Hash className="h-4 w-4" />
                                    <span className="font-mono">{property.property_number}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>Updated {property.updated_at}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Current Assignment - Priority Section */}
                <Card className="mb-6 border-[#006241]/20 shadow-sm">
                    <CardHeader className="bg-gradient-to-r from-[#006241] to-emerald-700 text-white rounded-t-lg">
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Current Assignment
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                    <User className="h-4 w-4 text-[#006241]" />
                                    Assigned User
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-[#006241]">
                                    <p className="font-semibold text-lg text-gray-900">{property.user}</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                    <MapPin className="h-4 w-4 text-emerald-600" />
                                    Current Location
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-emerald-500">
                                    <p className="font-semibold text-lg text-gray-900">{property.location}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Property Details */}
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-900">
                                    <Package className="h-5 w-5 text-[#006241]" />
                                    Property Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-3 bg-gray-50 rounded-lg border">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Item Name</label>
                                        <p className="text-sm font-semibold text-gray-900 mt-1">{property.item_name}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg border">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Property Number</label>
                                        <p className="text-sm font-mono font-semibold text-gray-900 mt-1">{property.property_number}</p>
                                    </div>
                                    {property.serial_no && (
                                        <div className="p-3 bg-gray-50 rounded-lg border">
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Serial Number</label>
                                            <p className="text-sm font-mono text-gray-900 mt-1">{property.serial_no}</p>
                                        </div>
                                    )}
                                    {property.model_no && (
                                        <div className="p-3 bg-gray-50 rounded-lg border">
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Model Number</label>
                                            <p className="text-sm text-gray-900 mt-1">{property.model_no}</p>
                                        </div>
                                    )}
                                    {property.unit_of_measure && (
                                        <div className="p-3 bg-gray-50 rounded-lg border">
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Unit</label>
                                            <p className="text-sm text-gray-900 mt-1">{property.unit_of_measure}</p>
                                        </div>
                                    )}
                                    {property.quantity_per_physical_count && (
                                        <div className="p-3 bg-gray-50 rounded-lg border">
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Quantity</label>
                                            <p className="text-sm font-semibold text-gray-900 mt-1">{property.quantity_per_physical_count}</p>
                                        </div>
                                    )}
                                </div>

                                {property.item_description && (
                                    <>
                                        <Separator className="my-4" />
                                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                            <div className="flex items-center gap-2 text-sm font-semibold text-blue-800 mb-2">
                                                <FileText className="h-4 w-4" />
                                                Description
                                            </div>
                                            <p className="text-sm leading-relaxed text-blue-900">{property.item_description}</p>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Financial Information */}
                        {(property.acquisition_date || property.acquisition_cost || property.fund) && (
                            <Card className="shadow-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-gray-900">
                                        <DollarSign className="h-5 w-5 text-emerald-600" />
                                        Financial Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {property.acquisition_date && (
                                            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                                                <label className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Acquisition Date</label>
                                                <p className="text-sm font-semibold text-emerald-800 mt-1">{property.acquisition_date}</p>
                                            </div>
                                        )}
                                        {property.acquisition_cost && (
                                            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                                                <label className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Acquisition Cost</label>
                                                <p className="text-sm font-semibold text-emerald-800 mt-1">
                                                    {peso.format(property.acquisition_cost)}
                                                </p>
                                            </div>
                                        )}
                                        {property.fund && (
                                            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 sm:col-span-2">
                                                <label className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Fund Source</label>
                                                <p className="text-sm font-semibold text-emerald-800 mt-1">{property.fund}</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Record Information */}
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-900">
                                    <Calendar className="h-5 w-5 text-indigo-600" />
                                    Record History
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                                        <label className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">Created</label>
                                        <p className="text-sm text-indigo-800 mt-1">{property.created_at}</p>
                                    </div>
                                    <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                                        <label className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">Last Updated</label>
                                        <p className="text-sm font-semibold text-indigo-800 mt-1">{property.updated_at}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Status & Condition */}
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-900">
                                    <Wrench className="h-5 w-5 text-orange-600" />
                                    Status & Condition
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-semibold text-gray-600 mb-2 block">Current Condition</label>
                                    <Badge variant="outline" className="bg-[#006241] text-white border-[#006241] hover:bg-[#004d33]">
                                        {property.condition}
                                    </Badge>
                                </div>

                                {property.color && (
                                    <>
                                        <Separator />
                                        <div>
                                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-2">
                                                <Palette className="h-4 w-4" />
                                                Color
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                                                <div
                                                    className="h-6 w-6 rounded-full border-2 border-gray-300 shadow-sm"
                                                    style={{ backgroundColor: property.color }}
                                                ></div>
                                                <span className="text-sm font-mono text-gray-900">{property.color}</span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* QR Information */}
                        <Card className="bg-gradient-to-br from-[#006241]/5 to-emerald-50 border-[#006241]/20 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-[#006241] text-sm flex items-center gap-2">
                                    <Smartphone className="h-4 w-4" />
                                    QR Code Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 text-xs text-[#006241]">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                        <p className="font-semibold">Always Current Data</p>
                                    </div>
                                    <p className="leading-relaxed text-gray-700">
                                        This QR code provides permanent access to current property information.
                                        Data updates automatically when modified in the system.
                                    </p>
                                    <div className="p-3 bg-white rounded-lg border border-[#006241]/20 mt-3">
                                        <p className="text-[#006241] font-semibold text-center text-sm">
                                            Perfect for COA Inspections
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Institution Info */}
                        <Card className="bg-gradient-to-br from-[#006241] to-emerald-700 text-white shadow-md">
                            <CardContent>
                                <div className="text-center space-y-3">
                                    <AppLogoIcon className="h-20 w-20 flex mx-auto" />
                                    <div>
                                        <h3 className="font-bold text-lg">CHED RO-12</h3>
                                        <p className="text-green-100 text-sm">Commission on Higher Education</p>
                                        <p className="text-green-200 text-xs mt-1">Regional Office No. 12, Koronadal City</p>
                                    </div>
                                    <Separator className="bg-white/20" />
                                    <p className="text-xs text-green-100">
                                        Official Property Management System
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
