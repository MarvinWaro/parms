// resources/js/Components/app-logo-icon.tsx
import { ComponentProps } from 'react';

export default function AppLogoIcon({
    className = 'h-8 w-8',
    ...props
}: ComponentProps<'img'>) {
    return (
        <img
            src="/assets/img/ched-logo.png"
            alt="CHED logo"
            className={`object-contain ${className}`}
            draggable={false}
            {...props}
        />
    );
}
