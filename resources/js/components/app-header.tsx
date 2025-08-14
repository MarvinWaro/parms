import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, MapPinCheckInside, Menu, Search, Moon, Sun, ScanHeart } from 'lucide-react';
import AppLogo from './app-logo';
import AppLogoIcon from './app-logo-icon';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Location',
        href: '/location',
        icon: MapPinCheckInside,
    },
        {
        title: 'Conditions',
        href: '/condition',
        icon: ScanHeart,
    },
];

const rightNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();

    return (
        <>
            {/* Main Header */}
            <div className="bg-gradient-to-r from-[#1C352D] to-[#2a4a3a] text-white shadow-lg">
                <div className="mx-auto max-w-7xl flex h-16 items-center justify-between px-6">
                    {/* Left Section - Logo and Title */}
                    <div className="flex items-center space-x-4">
                        {/* Mobile Menu */}
                        <div className="lg:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-[34px] w-[34px] text-white hover:bg-white/10">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="flex h-full w-64 flex-col items-stretch justify-between bg-sidebar">
                                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                                    <SheetHeader className="flex justify-start text-left">
                                        <AppLogoIcon className="h-6 w-6 fill-current text-black dark:text-white" />
                                    </SheetHeader>
                                    <div className="flex h-full flex-1 flex-col space-y-4 p-4">
                                        <div className="flex h-full flex-col justify-between text-sm">
                                            <div className="flex flex-col space-y-4">
                                                {mainNavItems.map((item) => (
                                                    <Link key={item.title} href={item.href} className="flex items-center space-x-2 font-medium">
                                                        {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                                        <span>{item.title}</span>
                                                    </Link>
                                                ))}
                                            </div>

                                            <div className="flex flex-col space-y-4">
                                                {rightNavItems.map((item) => (
                                                    <a
                                                        key={item.title}
                                                        href={item.href}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center space-x-2 font-medium"
                                                    >
                                                        {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                                        <span>{item.title}</span>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>

                        {/* Logo and System Title */}
                        <Link href="/dashboard" prefetch className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                                <AppLogoIcon className="h-6 w-6 fill-current text-white" />
                            </div>
                            <div className="hidden sm:block">
                                <div className="text-lg font-bold tracking-tight">PARMS</div>
                                <div className="text-xs text-blue-100 font-medium">Para Sa Mga Sawi</div>
                            </div>
                        </Link>
                    </div>

                    {/* Right Section - Controls */}
                    <div className="flex items-center space-x-3">
                        {/* Theme Toggle */}
                        <TooltipProvider delayDuration={0}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 text-white hover:bg-white/10 transition-colors"
                                    >
                                        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                        <span className="sr-only">Toggle theme</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Toggle theme</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        {/* Search */}
                        <TooltipProvider delayDuration={0}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-white hover:bg-white/10 transition-colors">
                                        <Search className="h-4 w-4" />
                                        <span className="sr-only">Search</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Search</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        {/* External Links */}
                        <div className="hidden lg:flex items-center space-x-1">
                            {rightNavItems.map((item) => (
                                <TooltipProvider key={item.title} delayDuration={0}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <a
                                                href={item.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-white hover:bg-white/10 transition-colors"
                                            >
                                                <span className="sr-only">{item.title}</span>
                                                {item.icon && <Icon iconNode={item.icon} className="h-4 w-4" />}
                                            </a>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{item.title}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ))}
                        </div>

                        {/* User Menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-10 w-10 rounded-full p-1 hover:bg-white/10">
                                    <Avatar className="h-8 w-8 overflow-hidden rounded-full border-2 border-white/20">
                                        <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                        <AvatarFallback className="bg-white/10 text-white font-semibold text-sm">
                                            {getInitials(auth.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <UserMenuContent user={auth.user} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            {/* Navigation Bar */}
            <div className="border-b border-border/50 bg-background">
                <div className="mx-auto max-w-7xl flex h-12 items-center px-6">
                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex h-full items-center">
                        <NavigationMenu className="flex h-full items-stretch">
                            <NavigationMenuList className="flex h-full items-stretch space-x-0">
                                {mainNavItems.map((item, index) => (
                                    <NavigationMenuItem key={index} className="relative flex h-full items-center">
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "flex items-center h-full px-4 text-sm font-medium transition-colors hover:text-primary border-b-2 border-transparent",
                                                page.url === item.href
                                                    ? "text-primary border-primary bg-primary/5"
                                                    : "text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            {item.icon && <Icon iconNode={item.icon} className="mr-2 h-4 w-4" />}
                                            {item.title}
                                        </Link>
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    {/* Breadcrumbs for mobile */}
                    <div className="lg:hidden flex-1">
                        {breadcrumbs.length > 1 && <Breadcrumbs breadcrumbs={breadcrumbs} />}
                    </div>
                </div>
            </div>

            {/* Breadcrumbs for desktop */}
            {breadcrumbs.length > 1 && (
                <div className="hidden lg:flex w-full border-b border-border/30 bg-muted/20">
                    <div className="mx-auto max-w-7xl flex h-10 w-full items-center justify-start px-6">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
