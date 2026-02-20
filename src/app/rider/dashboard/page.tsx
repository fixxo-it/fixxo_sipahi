import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Bike, LogOut } from 'lucide-react'
import RiderTaskList from './task-list'

export default async function RiderDashboard() {
    const cookieStore = await cookies()
    const riderId = cookieStore.get('rider_session')?.value

    if (!riderId) {
        redirect('/login')
    }

    const supabase = await createClient()

    // Fetch rider details
    const { data: rider } = await supabase
        .from('riders')
        .select('*')
        .eq('id', riderId)
        .single()

    if (!rider) {
        redirect('/login')
    }

    // Fetch assigned requests
    const { data: requests } = await supabase
        .from('requests')
        .select('*')
        .eq('assigned_rider_id', riderId)
        .order('created_at', { ascending: false })

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass p-6 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                            <Bike className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Welcome back, {rider.name}</h1>
                            <p className="text-muted-foreground text-sm flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                {rider.service.replace('_', ' ').toUpperCase()} • Online
                            </p>
                        </div>
                    </div>
                    <form action={async () => {
                        'use server'
                        const cookieStore = await cookies()
                        cookieStore.delete('rider_session')
                        redirect('/login')
                    }}>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm transition-all border border-white/10">
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </form>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="glass p-4 rounded-xl border border-white/10">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Assigned</p>
                        <p className="text-2xl font-bold text-white mt-1">{requests?.filter(r => r.status === 'assigned').length || 0}</p>
                    </div>
                    <div className="glass p-4 rounded-xl border border-white/10">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Completed</p>
                        <p className="text-2xl font-bold text-green-500 mt-1">{requests?.filter(r => r.status === 'completed').length || 0}</p>
                    </div>
                    <div className="glass p-4 rounded-xl border border-white/10">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Rating</p>
                        <p className="text-2xl font-bold text-yellow-500 mt-1">{rider.rating || '5.0'}</p>
                    </div>
                    <div className="glass p-4 rounded-xl border border-white/10">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Status</p>
                        <p className="text-sm font-bold text-primary mt-1">{rider.is_available ? 'AVAILABLE' : 'BUSY'}</p>
                    </div>
                </div>

                {/* Tasks List */}
                <RiderTaskList requests={requests || []} rider={rider} />
            </div>
        </div>
    )
}
