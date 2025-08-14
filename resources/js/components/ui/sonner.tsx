import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = "system" } = useTheme()

    return (
        <Sonner
            theme={theme as ToasterProps["theme"]}
            className="toaster group"
            style={
                {
                    "--normal-bg": "var(--popover)",
                    "--normal-text": "var(--popover-foreground)",
                    "--normal-border": "var(--border)",
                    // Success toast styling - green background and text
                    "--success-bg": "hsl(142 69% 90%)", // green-200 equivalent
                    "--success-text": "hsl(142 71% 25%)", // green-700 equivalent
                    "--success-border": "hsl(142 69% 80%)", // green-300 equivalent
                } as React.CSSProperties
            }
            {...props}
        />
    )
}

export { Toaster }
