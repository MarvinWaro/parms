// resources/js/Components/app-logo.tsx
import AppLogoIcon from './app-logo-icon';


export default function AppLogo() {
    return (
        // Full-width row, centered content
        <div className="flex w-full items-center justify-center gap-2 py-1">
            {/* Icon stays centered; when collapsed, it auto-centers */}
            <div className="size-8 shrink-0 grid place-items-center group-data-[collapsible=icon]:mx-auto">
                <AppLogoIcon className="h-7 w-7 object-contain object-center" />
            </div>

            {/* Label; hide in icon-only (collapsed) mode */}
            <span className="text-sm font-semibold leading-none group-data-[collapsible=icon]:hidden">
                PARMS
            </span>
        </div>
    );
}
