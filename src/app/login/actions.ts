'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { headers, cookies } from 'next/headers'

export async function loginWithGoogle() {
    const supabase = await createClient()
    const headerList = await headers()
    const host = headerList.get('host')

    // In many cloud environments, the protocol is 'https' even if node thinks it's 'http'
    // For localhost, we want 'http', for everything else usually 'https'
    const protocol = host?.includes('localhost') ? 'http' : 'https'
    const redirectTo = `${protocol}://${host}/auth/callback`

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: redirectTo,
        },
    })

    if (error) {
        console.error('Login error:', error)
        return
    }

    if (data.url) {
        redirect(data.url)
    }
}

export async function riderLogin(formData: FormData) {
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    const supabase = await createClient()

    const { data: rider, error } = await supabase
        .from('riders')
        .select('id, username, name')
        .eq('username', username)
        .eq('password', password)
        .single()

    if (error || !rider) {
        return { error: 'Invalid username or token' }
    }

    // Set a session cookie for the rider
    const cookieStore = await cookies()
    cookieStore.set('rider_session', rider.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 1 week
    })

    redirect('/rider/dashboard')
}
