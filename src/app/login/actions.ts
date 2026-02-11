'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

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
