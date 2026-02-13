'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function markRequestAsDone(requestId: string, riderId: string) {
    const supabase = await createClient()

    // 1. Update request status
    const { error: requestError } = await supabase
        .from('requests')
        .update({ status: 'completed' })
        .eq('id', requestId)

    if (requestError) {
        console.error('Error updating request:', requestError)
        return { error: 'Failed to update request' }
    }

    // 2. Make rider available
    const { error: riderError } = await supabase
        .from('riders')
        .update({ is_available: true })
        .eq('id', riderId)

    if (riderError) {
        console.error('Error updating rider availability:', riderError)
        // Not a fatal error for the request itself, but good to log
    }

    revalidatePath('/rider/dashboard')
    revalidatePath('/admin/requests')
    return { success: true }
}

export async function markAllRequestsAsDone(riderId: string) {
    const supabase = await createClient()

    // 1. Update all assigned requests for this rider to completed
    const { error: requestError } = await supabase
        .from('requests')
        .update({ status: 'completed' })
        .eq('assigned_rider_id', riderId)
        .neq('status', 'completed')

    if (requestError) {
        console.error('Error updating all requests:', requestError)
        return { error: 'Failed to update requests' }
    }

    // 2. Make rider available
    const { error: riderError } = await supabase
        .from('riders')
        .update({ is_available: true })
        .eq('id', riderId)

    if (riderError) {
        console.error('Error updating rider availability:', riderError)
    }

    revalidatePath('/rider/dashboard')
    revalidatePath('/admin/requests')
    return { success: true }
}
