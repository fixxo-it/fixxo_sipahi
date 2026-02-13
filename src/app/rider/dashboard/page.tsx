import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Bike, Package, MapPin, Clock, CheckCircle, LogOut } from 'lucide-react'

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

    const parseDetails = (details: any) => {
        if (typeof details === 'string') {
            try { return JSON.parse(details) } catch (e) { return {} }
        }
        return details || {}
    }

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
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-white px-2">Your Active Tasks</h2>

                    <div className="grid gap-4">
                        {requests && requests.length > 0 ? (
                            requests.map((req) => {
                                const details = parseDetails(req.details)
                                return (
                                    <div key={req.id} className="glass p-5 rounded-2xl border border-white/10 hover:border-primary/30 transition-all group">
                                        <div className="flex flex-wrap items-start justify-between gap-4">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                                                        <Package className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-mono text-muted-foreground uppercase">#{req.id.slice(0, 8)}</span>
                                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${req.status === 'completed' ? 'border-green-500/20 text-green-500 bg-green-500/10' : 'border-yellow-500/20 text-yellow-500 bg-yellow-500/10'
                                                                } uppercase`}>
                                                                {req.status}
                                                            </span>
                                                        </div>
                                                        <h3 className="font-bold text-white mt-0.5">Customer: {req.user_phone}</h3>
                                                    </div>
                                                </div>

                                                <div className="space-y-2 ml-1">
                                                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                                        <MapPin className="w-4 h-4 mt-0.5 text-primary" />
                                                        <span>{typeof details.area === 'string' ? details.area : 'Location details in app'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                        <div className="flex items-center gap-1.5">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            {details.time ? new Date(details.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'ASAP'}
                                                        </div>
                                                        {details.duration && (
                                                            <div className="flex items-center gap-1.5">
                                                                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                                                                {details.duration}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                {req.status !== 'completed' && (
                                                    <button className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20">
                                                        Mark Done
                                                    </button>
                                                )}
                                                <button className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all text-muted-foreground hover:text-white">
                                                    Map
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="glass p-12 rounded-2xl border border-white/10 text-center space-y-3">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                                    <Bike className="w-8 h-8 text-muted-foreground/30" />
                                </div>
                                <p className="text-muted-foreground">No tasks assigned to you yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
