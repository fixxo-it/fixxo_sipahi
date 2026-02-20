'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateRequestStatus(requestId: string, status: string, riderId: string) {
    const supabase = await createClient()

    // 1. Update request status
    const { error: requestError } = await supabase
        .from('requests')
        .update({ status: status })
        .eq('id', requestId)

    if (requestError) {
        console.error('Error updating request:', requestError)
        return { error: 'Failed to update request' }
    }

    // 2. If status is completed or cancelled, make rider available
    if (status === 'completed' || status === 'cancelled') {
        const { error: riderError } = await supabase
            .from('riders')
            .update({ is_available: true })
            .eq('id', riderId)

        if (riderError) {
            console.error('Error updating rider availability:', riderError)
        }
    } else {
        // For other statuses, rider is busy
        await supabase
            .from('riders')
            .update({ is_available: false })
            .eq('id', riderId)
    }

    revalidatePath('/rider/dashboard')
    revalidatePath('/admin/requests')
    return { success: true }
}

export async function markRequestAsDone(requestId: string, riderId: string) {
    return updateRequestStatus(requestId, 'completed', riderId)
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
