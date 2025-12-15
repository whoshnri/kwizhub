import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get("kwizhub_session");
    const path = request.nextUrl.pathname;

    // Parse session if exists
    let session = null;
    if (sessionCookie?.value) {
        try {
            const decoded = Buffer.from(sessionCookie.value, "base64").toString();
            session = JSON.parse(decoded);
        } catch {
            session = null;
        }
    }

    // Protect user routes
    if (path.startsWith("/user")) {
        if (!session || session.type !== "user") {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    // Protect admin routes
    if (path.startsWith("/admin")) {
        if (!session || session.type !== "admin") {
            return NextResponse.redirect(new URL("/login?admin=true", request.url));
        }
    }

    // Redirect logged-in users away from auth pages
    if (path === "/login" || path === "/signup") {
        if (session) {
            if (session.type === "admin") {
                return NextResponse.redirect(new URL("/admin", request.url));
            } else {
                return NextResponse.redirect(new URL("/user", request.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/user/:path*", "/admin/:path*", "/login", "/signup"],
};
