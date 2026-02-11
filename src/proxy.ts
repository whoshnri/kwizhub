import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  const { pathname: path, searchParams } = request.nextUrl;

  // Exclude static/assets/api/favicon/etc.
  if (
    path.startsWith("/_next") ||
    path.startsWith("/api/") ||
    path.startsWith("/static/") ||
    /\.\w+$/.test(path) ||          // .js .png .ico etc
    path === "/prelaunch"
  ) {
    return NextResponse.next();
  }

  // Pre-launch gate — replace 'preview=true' with real secret in production
  const isPreview = searchParams.get("preview") === "true";
  if (!isPreview) {
    return NextResponse.redirect(new URL("/prelaunch", request.url));
  }

  // Session parsing (still unsafe — replace with signed cookie / jwt / session store!)
  let session = null;
  const cookieValue = request.cookies.get("kwizhub_session")?.value;
  if (cookieValue) {
    try {
      const decoded = Buffer.from(cookieValue, "base64").toString();
      const data = JSON.parse(decoded);
      if (data?.type && ["user", "admin"].includes(data.type)) {
        session = data;
      }
    } catch {
      // Bad cookie → clean it up
      const res = NextResponse.next();
      res.cookies.delete("kwizhub_session");
      return res;
    }
  }

  // Protect /user/*
  if (path.startsWith("/user") && (!session || session.type !== "user")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Protect /admin/*
  if (path.startsWith("/admin") && (!session || session.type !== "admin")) {
    return NextResponse.redirect(new URL("/login?admin=true", request.url));
  }

  // Redirect logged-in users away from /login & /signup
  if (path === "/login" || path === "/signup") {
    if (session) {
      const dest = session.type === "admin" ? "/admin" : "/user";
      return NextResponse.redirect(new URL(dest, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|prelaunch).*)"],
};