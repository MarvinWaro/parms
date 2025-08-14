import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
    return (
        <Sonner
            // Force light theme to prevent dark mode interference
            theme="light"
            className="toaster group"
            // Since global CSS handles all styling, we can keep this minimal
            toastOptions={{
                ...props.toastOptions,
            }}
            {...props}
        />
    )
}

export { Toaster }
