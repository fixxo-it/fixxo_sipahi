'use client'

import { useState, useTransition } from 'react'
import { Package, MapPin, Clock, CheckCircle, Loader2 } from 'lucide-react'
import { markRequestAsDone, markAllRequestsAsDone } from './rider-actions'

interface TaskListProps {
    requests: any[]
    riderId: string
}

export default function RiderTaskList({ requests, riderId }: TaskListProps) {
    const [isPending, startTransition] = useTransition()
    const [localLoadingId, setLocalLoadingId] = useState<string | null>(null)

    const handleMarkDone = async (requestId: string) => {
        setLocalLoadingId(requestId)
        startTransition(async () => {
            await markRequestAsDone(requestId, riderId)
            setLocalLoadingId(null)
        })
    }

    const handleMarkAllDone = async () => {
        if (!confirm('Are you sure you want to mark all active tasks as completed?')) return
        setLocalLoadingId('all')
        startTransition(async () => {
            await markAllRequestsAsDone(riderId)
            setLocalLoadingId(null)
        })
    }

    const activeRequests = requests.filter(r => r.status !== 'completed')
    const hasActiveTasks = activeRequests.length > 0

    const parseDetails = (details: any) => {
        if (typeof details === 'string') {
            try { return JSON.parse(details) } catch (e) { return {} }
        }
        return details || {}
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
                <h2 className="text-lg font-semibold text-white">Your Tasks</h2>
                {hasActiveTasks && (
                    <button
                        onClick={handleMarkAllDone}
                        disabled={isPending}
                        className="text-xs font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5"
                    >
                        {localLoadingId === 'all' && <Loader2 className="w-3 h-3 animate-spin" />}
                        Mark All as Done
                    </button>
                )}
            </div>

            <div className="grid gap-4">
                {requests && requests.length > 0 ? (
                    requests.map((req) => {
                        const details = parseDetails(req.details)
                        const isDone = req.status === 'completed'
                        const isLoading = localLoadingId === req.id || (localLoadingId === 'all' && !isDone)

                        return (
                            <div key={req.id} className={`glass p-5 rounded-2xl border border-white/10 transition-all group ${isDone ? 'opacity-60' : 'hover:border-primary/30'}`}>
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${isDone ? 'bg-green-500/10 border-green-500/20' : 'bg-primary/10 border-primary/20'
                                                }`}>
                                                <Package className={`w-5 h-5 ${isDone ? 'text-green-500' : 'text-primary'}`} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-mono text-muted-foreground uppercase">#{req.id.slice(0, 8)}</span>
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${isDone ? 'border-green-500/20 text-green-500 bg-green-500/10' : 'border-yellow-500/20 text-yellow-500 bg-yellow-500/10'
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
                                        {!isDone && (
                                            <button
                                                onClick={() => handleMarkDone(req.id)}
                                                disabled={isPending}
                                                className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50"
                                            >
                                                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
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
                            <Package className="w-8 h-8 text-muted-foreground/30" />
                        </div>
                        <p className="text-muted-foreground">No tasks assigned to you yet.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
