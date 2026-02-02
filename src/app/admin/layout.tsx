import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/session";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminMobileHeader } from "@/components/admin/admin-mobile-header";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    let session;
    try {
        session = await getAdminSession();
    } catch (error) {
        // detailed error logging can be added here if needed
    }

    if (!session) {
        redirect("/");
    }

    const initials = session.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="flex h-[111.11vh]  overflow-hidden bg-background">
            {/* Sidebar - Hidden on mobile, shown on desktop */}
            <aside className="hidden lg:block">
                <AdminSidebar
                    name={session.name}
                    email={session.email}
                    initials={initials}
                />
            </aside>

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Mobile Header */}
                <div className="lg:hidden">
                    <AdminMobileHeader
                        name={session.name}
                        email={session.email}
                        initials={initials}
                    />
                </div>

                <main className="flex-1 overflow-y-auto bg-background p-4 lg:p-8">
                    <div className="mx-auto w-full max-w-none">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
