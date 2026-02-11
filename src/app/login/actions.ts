'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getURL } from '@/utils/get-url'

export async function loginWithGoogle() {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${getURL()}auth/callback`,
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
