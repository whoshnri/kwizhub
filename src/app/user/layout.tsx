import { redirect } from "next/navigation";
import { getUserSession } from "@/lib/session";
import { UserSidebar } from "@/components/user/user-sidebar";
import { UserMobileHeader } from "@/components/user/user-mobile-header";

export default async function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getUserSession();

    if (!session) {
        redirect("/login");
    }

    const initials = session.username
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Sidebar - Hidden on mobile, shown on desktop */}
            <aside className="hidden lg:block">
                <UserSidebar
                    username={session.username}
                    email={session.email}
                    initials={initials}
                />
            </aside>

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Mobile Header */}
                <div className="lg:hidden">
                    <UserMobileHeader
                        username={session.username}
                        email={session.email}
                        initials={initials}
                    />
                </div>

                <main className="flex-1 overflow-y-auto bg-background p-4 lg:p-8">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
