// resources/js/Components/app-logo-icon.tsx
import { ComponentProps } from 'react';
import { Image } from "@unpic/react";

export default function AppLogoIcon({
    className = 'h-8 w-8'
}: ComponentProps<'img'>) {
    return (
        <Image
            src="/assets/img/ched-logo.png"
            alt="CHED logo"
            className={`object-contain ${className}`}
            layout="constrained"
            width={400}
            height={300}
        />
    );
}
