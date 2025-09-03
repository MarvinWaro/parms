// File: C:\Users\MARVIN\projects\parms\resources\js\pages\property\public.tsx

import PublicPropertyView from '@/components/property/ui/public-property-view';
import { usePage } from '@inertiajs/react';

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

type PageProps = {
    property: PropertyData;
};

export default function PublicProperty() {
    const { props } = usePage<PageProps>();
    const { property } = props;

    return <PublicPropertyView property={property} />;
}
