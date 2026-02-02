"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/app/actions/auth";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    FileText,
    CreditCard,
    Wallet,
    Users,
    Upload,
    LogOut,
} from "lucide-react";

interface AdminMobileHeaderProps {
    name: string;
    email: string;
    initials: string;
}

const navItems = [
    {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Materials",
        href: "/admin/materials",
        icon: FileText,
    },
    {
        title: "Transactions",
        href: "/admin/transactions",
        icon: CreditCard,
    },
    {
        title: "Withdrawals",
        href: "/admin/withdrawals",
        icon: Wallet,
    },
    {
        title: "Referrals",
        href: "/admin/referrals",
        icon: Users,
    },
];

export function AdminMobileHeader({ name, email, initials }: AdminMobileHeaderProps) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    function handleLogout(){
        logout()
    }

    return (
        <header className="sticky top-0 z-50 flex h-16 items-center border-b border-border bg-card px-4 lg:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                    <div className="flex h-full flex-col">
                        {/* Logo */}
                        <div className="flex h-16 items-center border-b border-border px-6">
                            <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                                    <span className="text-lg font-bold text-primary-foreground">K</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-lg font-bold font-heading">KwizHub</span>
                                    <span className="text-xs text-muted-foreground">Author Portal</span>
                                </div>
                            </Link>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 space-y-1 px-3 py-4">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href || pathname.endsWith(item.href + "/");
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                            isActive
                                                ? "bg-primary text-primary-foreground"
                                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                        )}
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span>{item.title}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Quick Actions */}
                        <div className="border-t border-border p-3">
                            <Link href="/admin/materials/new" onClick={() => setOpen(false)}>
                                <Button className="w-full" size="sm">
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload Material
                                </Button>
                            </Link>
                        </div>

                        {/* User Menu */}
                        <div className="border-t border-border p-3">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start gap-3 px-3"
                                    >
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                                {initials}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col items-start text-left">
                                            <span className="text-sm font-medium">{name}</span>
                                            <span className="text-xs text-muted-foreground">{email}</span>
                                        </div>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <div className="flex items-center gap-2 p-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                                {initials}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <p className="text-sm font-medium">{name}</p>
                                            <p className="text-xs text-muted-foreground">{email}</p>
                                        </div>
                                    </div>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <form onSubmit={handleLogout} className="w-full">
                                            <button
                                                type="submit"
                                                className="flex w-full items-center gap-2 text-left"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Log out
                                            </button>
                                        </form>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            <div className="ml-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                    <span className="text-sm font-bold text-primary-foreground">K</span>
                </div>
                <span className="font-bold font-heading">KwizHub</span>
            </div>

            <div className="ml-auto">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                            <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <div className="flex items-center gap-2 p-2">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <p className="text-sm font-medium">{name}</p>
                                <p className="text-xs text-muted-foreground">{email}</p>
                            </div>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <form onSubmit={handleLogout} className="w-full">
                                <button
                                    type="submit"
                                    className="flex w-full items-center gap-2 text-left"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Log out
                                </button>
                            </form>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}

