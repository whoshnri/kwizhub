import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    if (
        pathname.startsWith('/_next') ||
        pathname.includes('/api/') ||
        pathname.includes('.') || // matches favicon.ico, .svg, etc.
        pathname === '/prelaunch'
    ) {
        return NextResponse.next()
    }

    // Optional: Allow access with a secret query param for dev/preview
    if (request.nextUrl.searchParams.get('preview') === 'true') {
        return NextResponse.next()
    }

    return NextResponse.redirect(new URL('/prelaunch', request.url))
}

export const config = {
    matcher: [

        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
