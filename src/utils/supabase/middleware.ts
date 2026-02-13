import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    const riderSession = request.cookies.get('rider_session')
    const pathname = request.nextUrl.pathname

    // Allow static files and auth-related paths
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/auth') ||
        pathname === '/favicon.ico' ||
        pathname === '/login' ||
        pathname === '/unauthorized' ||
        pathname === '/'
    ) {
        return supabaseResponse
    }

    // Role-based protection: Riders
    if (pathname.startsWith('/rider')) {
        if (!riderSession) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }
        return supabaseResponse
    }

    // Role-based protection: Admins (Control Panel)
    const ALLOWED_USER_ID = '3431eac0-9d65-4f9a-82d7-91e125631cb8'
    const ALLOWED_EMAIL = 'founder@fixxoit.com'

    if (!user) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    if (user.id !== ALLOWED_USER_ID || user.email !== ALLOWED_EMAIL) {
        const url = request.nextUrl.clone()
        url.pathname = '/unauthorized'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}
