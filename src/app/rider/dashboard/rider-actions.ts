'use server'

import { api } from '@/utils/api'
import { getRiderToken, getRiderSession } from '@/utils/auth'
import { revalidatePath } from 'next/cache'

export async function updateRequestStatus(requestId: string, status: string, riderId: string) {
    const token = await getRiderToken()

    // Use the backend rider endpoint which validates state machine + logs audit trail
    const { data, error } = await api.patch(
        `/riders/${riderId}/requests/${requestId}/status?status=${status}`,
        undefined,
        token || undefined
    )

    if (error) {
        console.error('Error updating request:', error)
        return { error: 'Failed to update request' }
    }

    revalidatePath('/rider/dashboard')
    return { success: true }
}

export async function markRequestAsDone(requestId: string, riderId: string) {
    return updateRequestStatus(requestId, 'completed', riderId)
}

export async function markAllRequestsAsDone(riderId: string) {
    const token = await getRiderToken()

    // Use the backend's bulk complete endpoint
    const { data, error } = await api.post(
        `/riders/${riderId}/requests/complete-all`,
        undefined,
        token || undefined
    )

    if (error) {
        console.error('Error completing all requests:', error)
        return { error: 'Failed to complete requests' }
    }

    revalidatePath('/rider/dashboard')
    return { success: true }
}
