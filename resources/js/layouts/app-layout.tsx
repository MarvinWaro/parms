import AppLayoutTemplate from '@/layouts/app/app-header-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import { Toaster } from '@/components/ui/sonner';

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
            expand={false}
            visibleToasts={4}
            richColors={false}
            closeButton={true}
            toastOptions={{
                duration: 4000,
                
            }}
        />
    </div>
);
