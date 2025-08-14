
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { toast } from 'sonner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus, MapPin, Search, AlertTriangle } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import LocationRowTemplate from '@/components/location/ui/location-row';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Location', href: '/location' }];

export type Row = { id: string; location: string };
type PageProps = { locations: Row[] };

export default function LocationIndex() {
    const { props } = usePage<PageProps>();
    const rows = props.locations ?? [];

    const [searchQuery, setSearchQuery] = useState('');
    const filteredRows = rows.filter((row) =>
        row.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // -------------------------
    // Create modal + form
    // -------------------------
    const [openCreate, setOpenCreate] = useState(false);
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
    } = useForm({ location: '' });

    function handleCreateSubmit(e: FormEvent) {
        e.preventDefault();

        const promise = new Promise<void>((resolve, reject) => {
            post(route('location.store'), {
                preserveScroll: true,
                onSuccess: () => resolve(),
                onError: () => reject('Failed to create location. Please try again.'),
            });
        });

        // Much cleaner - no more classNames needed!
        toast.promise(promise, {
            loading: 'Creating location...',
            success: 'Location created successfully!',
            error: (message) => message,
            duration: 2000,
        });

        promise.finally(() => {
            setData({ location: '' });
            setOpenCreate(false);
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Location" />

            <div className="bg-background pb-6">
                <div className="space-y-4">
                    {/* Header Section */}
                    <div className="space-y-2 px-6 pt-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h1 className="text-3xl font-bold tracking-tight text-foreground">Locations / Whereabouts</h1>
                                <p className="text-sm text-muted-foreground">Manage your office locations and departments</p>
                            </div>

                            {/* Create modal trigger */}
                            <Dialog open={openCreate} onOpenChange={(v) => { setOpenCreate(v); }}>
                                <DialogTrigger asChild>
                                    <Button size="default" className="shadow-sm">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Location
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle className="flex items-center gap-2">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                                <MapPin className="h-4 w-4 text-primary" />
                                            </div>
                                            Add New Location
                                        </DialogTitle>
                                        <DialogDescription>
                                            Add a new whereabouts to help track office locations and departments.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <form onSubmit={handleCreateSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="location" className="text-sm font-medium">Location Name</Label>
                                            <Input
                                                id="location"
                                                value={data.location}
                                                onChange={(e) => setData('location', e.target.value)}
                                                placeholder="e.g., 3rd Floor — Records Office"
                                                className="transition-all duration-200"
                                                aria-invalid={!!errors.location}
                                                aria-describedby={errors.location ? 'location-error' : undefined}
                                                disabled={processing}
                                            />
                                            {errors.location && (
                                                <p id="location-error" className="text-xs text-destructive flex items-center gap-1">
                                                    {errors.location}
                                                </p>
                                            )}
                                        </div>

                                        <DialogFooter className="gap-2 pt-4">
                                            <Button type="button" variant="outline" onClick={() => { setOpenCreate(false); reset(); }} disabled={processing}>
                                                Cancel
                                            </Button>
                                            <Button type="submit" disabled={processing || !data.location} className="min-w-[80px]">
                                                {processing ? 'Saving…' : 'Save'}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    {/* Stats and Search Section */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-6">
                        <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="px-3 py-1.5 text-sm font-medium">
                                {rows.length} {rows.length === 1 ? 'Location' : 'Locations'}
                            </Badge>
                            {searchQuery && (
                                <Badge variant="outline" className="px-3 py-1.5 text-sm">
                                    {filteredRows.length} filtered
                                </Badge>
                            )}
                        </div>

                        {/* Search */}
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search locations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 transition-all duration-200"
                            />
                        </div>
                    </div>

                    {/* Enhanced Table Card */}
                    <Card className="border-0 shadow-none bg-card rounded-none">
                        <CardContent className="p-0">
                            <div className="overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-b border-border/50 bg-muted/30 hover:bg-muted/30">
                                            <TableHead className="h-14 px-6 text-sm font-semibold text-foreground/90">
                                                Location
                                            </TableHead>
                                            <TableHead className="h-14 px-6 text-right text-sm font-semibold text-foreground/90 w-32">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {filteredRows.map((row, index) => (
                                            <LocationRowTemplate key={row.id} row={row} index={index} />
                                        ))}
                                    </TableBody>
                                </Table>

                                {/* Enhanced Empty states */}
                                {filteredRows.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-20 px-6">
                                        {searchQuery ? (
                                            <>
                                                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted/50 mb-6">
                                                    <Search className="h-8 w-8 text-muted-foreground" />
                                                </div>
                                                <h3 className="text-xl font-semibold text-foreground mb-2">No locations found</h3>
                                                <p className="text-sm text-muted-foreground text-center max-w-md mb-6 leading-relaxed">
                                                    No locations match your search for "{searchQuery}". Try adjusting your search terms or check the spelling.
                                                </p>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setSearchQuery('')}
                                                    size="sm"
                                                    className="transition-all duration-200"
                                                >
                                                    Clear search
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 mb-6">
                                                    <MapPin className="h-8 w-8 text-primary" />
                                                </div>
                                                <h3 className="text-xl font-semibold text-foreground mb-2">No locations yet</h3>
                                                <p className="text-sm text-muted-foreground text-center max-w-md mb-8 leading-relaxed">
                                                    Get started by adding your first location or whereabouts to help track office spaces and departments across your organization.
                                                </p>
                                                <Button onClick={() => setOpenCreate(true)} size="default" className="transition-all duration-200">
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Add Your First Location
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
