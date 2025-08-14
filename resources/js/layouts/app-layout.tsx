import AppLayoutTemplate from '@/layouts/app/app-header-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import { Toaster } from '@/components/ui/sonner'; // Use your custom Toaster

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <div className="relative">
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
        </AppLayoutTemplate>
        <Toaster
            position="bottom-right"
            expand={false}        // This creates the stacked effect
            visibleToasts={4}     // Show max 4 toasts at once
            richColors={false}    // Disable richColors to use our custom styling
            closeButton={true}
            toastOptions={{
                duration: 4000,
                className: "toast-custom",
            }}
        />
    </div>
);
