import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    // Allow static files and public paths
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/auth') ||
        pathname === '/favicon.ico' ||
        pathname === '/login' ||
        pathname === '/unauthorized' ||
        pathname === '/'
    ) {
        return NextResponse.next()
    }

    // Role-based protection: Riders
    if (pathname.startsWith('/rider')) {
        const riderSession = request.cookies.get('rider_session')
        const riderToken = request.cookies.get('rider_token')

        if (!riderSession || !riderToken) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }
        return NextResponse.next()
    }

    // Role-based protection: Admin
    // For now, admin uses the same JWT auth system
    // TODO: Add admin role check when admin auth is implemented
    const riderToken = request.cookies.get('rider_token')
    if (!riderToken) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
