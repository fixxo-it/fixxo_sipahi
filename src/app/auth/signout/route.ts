import { NextResponse } from 'next/server'
import { clearRiderAuth } from '@/utils/auth'

export async function POST(request: Request) {
    await clearRiderAuth()

    return NextResponse.redirect(new URL('/login', request.url), {
        status: 302,
    })
}
