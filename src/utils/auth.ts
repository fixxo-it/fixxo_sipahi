/**
 * JWT-based auth utilities for the Sipahi rider/admin app.
 * Replaces Supabase auth entirely.
 * 
 * Tokens are stored in httpOnly cookies for security.
 * Two session types:
 *   - rider_token: JWT from FastAPI backend OTP flow
 *   - rider_session: rider ID for quick lookups
 *   - admin_token: JWT for admin users (future)
 */

import { cookies } from 'next/headers'

export const AUTH_COOKIE = 'rider_token'
export const SESSION_COOKIE = 'rider_session'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days (matches JWT expiry)

/**
 * Save rider auth data into httpOnly cookies after successful login.
 */
export async function setRiderAuth(token: string, riderId: string) {
    const cookieStore = await cookies()

    cookieStore.set(AUTH_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: COOKIE_MAX_AGE,
        path: '/',
    })

    cookieStore.set(SESSION_COOKIE, riderId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: COOKIE_MAX_AGE,
        path: '/',
    })
}

/**
 * Get the stored JWT token (for making authenticated API calls).
 */
export async function getRiderToken(): Promise<string | null> {
    const cookieStore = await cookies()
    return cookieStore.get(AUTH_COOKIE)?.value || null
}

/**
 * Get the stored rider ID (for quick session checks).
 */
export async function getRiderSession(): Promise<string | null> {
    const cookieStore = await cookies()
    return cookieStore.get(SESSION_COOKIE)?.value || null
}

/**
 * Clear all rider auth cookies (logout).
 */
export async function clearRiderAuth() {
    const cookieStore = await cookies()
    cookieStore.delete(AUTH_COOKIE)
    cookieStore.delete(SESSION_COOKIE)
}

/**
 * Check if a rider is authenticated.
 */
export async function isRiderAuthenticated(): Promise<boolean> {
    const token = await getRiderToken()
    const session = await getRiderSession()
    return !!(token && session)
}
