import Link from "next/link";
import { redirect } from "next/navigation";
import { getUserSession } from "@/lib/session";
import { logout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default async function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getUserSession();

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-6">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">K</span>
                                </div>
                                <span className="text-xl font-bold text-primary">KwizHub</span>
                            </Link>

                            <nav className="hidden md:flex items-center gap-4">
                                <Link
                                    href="/user"
                                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/user/materials"
                                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    My Materials
                                </Link>
                                <Link
                                    href="/user/transactions"
                                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Transactions
                                </Link>
                                <Link
                                    href="/marketplace"
                                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Marketplace
                                </Link>
                            </nav>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                    <Avatar className="h-10 w-10">
                                        <AvatarFallback className="bg-primary text-white">
                                            {session.username.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <div className="flex items-center justify-start gap-2 p-2">
                                    <div className="flex flex-col space-y-0.5">
                                        <p className="text-sm font-medium">{session.username}</p>
                                        <p className="text-xs text-muted-foreground">{session.email}</p>
                                    </div>
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/user/settings">Settings</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <form action={async () => { "use server"; await logout(); }}>
                                        <button type="submit" className="w-full text-left">
                                            Log out
                                        </button>
                                    </form>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            {/* Mobile Navigation */}
            <nav className="md:hidden border-b border-border bg-white px-4 py-2 flex gap-4 overflow-x-auto">
                <Link
                    href="/user"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap"
                >
                    Dashboard
                </Link>
                <Link
                    href="/user/materials"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap"
                >
                    My Materials
                </Link>
                <Link
                    href="/user/transactions"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap"
                >
                    Transactions
                </Link>
                <Link
                    href="/user/settings"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap"
                >
                    Settings
                </Link>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}
