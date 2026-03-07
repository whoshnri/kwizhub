import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

function getSecret(): Uint8Array {
  return new TextEncoder().encode(process.env.JWT_SECRET ?? "");
}

async function parseSession(request: NextRequest) {
  const token = request.cookies.get("kwizhub_session")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    const type = payload.type as string | undefined;
    if (type === "user" || type === "admin") {
      return payload as { type: "user" | "admin"; id: string };
    }
    return null;
  } catch {
    // Expired or tampered token
    return null;
  }
}

export default async function proxy(request: NextRequest) {
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

  const session = await parseSession(request);

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