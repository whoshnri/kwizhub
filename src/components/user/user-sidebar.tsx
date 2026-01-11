"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    FileText,
    CreditCard,
    Settings,
    ShoppingBag,
    LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/app/actions/auth";

interface UserSidebarProps {
    username: string;
    email: string;
    initials: string;
}

const navItems = [
    {
        title: "Dashboard",
        href: "/user",
        icon: LayoutDashboard,
    },
    {
        title: "My Materials",
        href: "/user/materials",
        icon: FileText,
    },
    {
        title: "Transactions",
        href: "/user/transactions",
        icon: CreditCard,
    },
    {
        title: "Settings",
        href: "/user/settings",
        icon: Settings,
    },
];

export function UserSidebar({ username, email, initials }: UserSidebarProps) {
    const pathname = usePathname();

    function handleLogout() {
        logout();
    }

    return (
        <div className="flex h-screen w-64 flex-col border-r border-border bg-card">
            {/* Logo */}
            <div className="flex h-16 items-center border-b border-border px-6">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                        <span className="text-lg font-bold text-primary-foreground">K</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold font-heading">KwizHub</span>
                        <span className="text-xs text-muted-foreground">Student Portal</span>
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
                <Link href="/marketplace">
                    <Button className="w-full" size="sm" variant="outline">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Browse Marketplace
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
                            <div className="flex flex-col items-start text-left overflow-hidden">
                                <span className="text-sm font-medium uppercase">{username}</span>
                                <span className="text-[10px] text-muted-foreground truncate w-full">{email}</span>
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
                                <p className="text-sm font-medium">{username}</p>
                                <p className="text-[10px] text-muted-foreground">{email}</p>
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
    );
}

