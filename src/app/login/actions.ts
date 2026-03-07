'use server'

import { redirect } from 'next/navigation'
import { api } from '@/utils/api'
import { setRiderAuth } from '@/utils/auth'

/**
 * Send OTP to rider's phone number via FastAPI backend.
 */
export async function sendOtp(phone: string) {
    const { data, error } = await api.post('/otp/send', { mobile: phone })

    if (error) {
        return { error: error }
    }

    return { success: true, message: data?.message || 'OTP sent successfully' }
}

/**
 * Verify OTP and log the rider in.
 * The backend will return a JWT token + user info.
 * We then check if this user (by phone) exists in the riders table.
 */
export async function verifyOtp(phone: string, otp: string) {
    // 1. Verify OTP with backend — this returns JWT + user data
    const { data, error } = await api.post('/otp/verify', { mobile: phone, otp })

    if (error) {
        return { error }
    }

    const token = data?.token
    if (!token) {
        return { error: 'No token received from backend' }
    }

    // 2. Check if this phone belongs to a rider
    // Use the admin riders endpoint to find riders by phone
    const { data: riders, error: riderError } = await api.get<any[]>('/admin/riders')

    if (riderError) {
        return { error: 'Could not verify rider status. Please try again.' }
    }

    const matchedRider = riders?.find((r: any) => r.phone === phone)

    if (!matchedRider) {
        return { error: 'No rider account found for this phone number. Contact admin.' }
    }

    // 3. Store the JWT token and rider ID in cookies
    await setRiderAuth(token, matchedRider.id)

    // 4. Redirect to rider dashboard
    redirect('/rider/dashboard')
}
