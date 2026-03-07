import { NextResponse } from 'next/server'

// Auth callback is no longer needed since we use OTP/JWT instead of OAuth.
// Keeping this route as a redirect to login for backward compatibility.
export async function GET(request: Request) {
    const { origin } = new URL(request.url)
    return NextResponse.redirect(`${origin}/login`)
}
