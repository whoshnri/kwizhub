import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/session";
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

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getAdminSession();

    if (!session) {
        redirect("/login?admin=true");
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
                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                                    Author
                                </span>
                            </Link>

                            <nav className="hidden md:flex items-center gap-4">
                                <Link
                                    href="/admin"
                                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/admin/materials"
                                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Materials
                                </Link>
                                <Link
                                    href="/admin/transactions"
                                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Transactions
                                </Link>
                                <Link
                                    href="/admin/withdrawals"
                                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Withdrawals
                                </Link>
                            </nav>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                    <Avatar className="h-10 w-10">
                                        <AvatarFallback className="bg-primary text-white">
                                            {session.name.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <div className="flex items-center justify-start gap-2 p-2">
                                    <div className="flex flex-col space-y-0.5">
                                        <p className="text-sm font-medium">{session.name}</p>
                                        <p className="text-xs text-muted-foreground">{session.email}</p>
                                    </div>
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/admin/materials/new">Upload Material</Link>
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
                    href="/admin"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap"
                >
                    Dashboard
                </Link>
                <Link
                    href="/admin/materials"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap"
                >
                    Materials
                </Link>
                <Link
                    href="/admin/transactions"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap"
                >
                    Transactions
                </Link>
                <Link
                    href="/admin/withdrawals"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap"
                >
                    Withdrawals
                </Link>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}
