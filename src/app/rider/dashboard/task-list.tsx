'use client'

import { useState, useTransition } from 'react'
import { Package, MapPin, Clock, CheckCircle, Loader2, Navigation, CheckCircle2, Play, Flag, MessageSquare, Copy, X } from 'lucide-react'
import { updateRequestStatus, markAllRequestsAsDone } from './rider-actions'

interface TaskListProps {
    requests: any[]
    rider: any
}

const statusFlow = [
    { current: 'assigned', next: 'en_route', label: 'Start Journey', icon: Navigation },
    { current: 'en_route', next: 'arrived', label: 'Reached Location', icon: CheckCircle2 },
    { current: 'arrived', next: 'in_progress', label: 'Start Service', icon: Play },
    { current: 'in_progress', next: 'completed', label: 'Finish Service', icon: Flag }
]

export default function RiderTaskList({ requests, rider }: TaskListProps) {
    const [isPending, startTransition] = useTransition()
    const [localLoadingId, setLocalLoadingId] = useState<string | null>(null)
    const [whatsappMessage, setWhatsappMessage] = useState<{ text: string, id: string } | null>(null)

    const handleStatusUpdate = async (requestId: string, nextStatus: string) => {
        setLocalLoadingId(requestId)
        startTransition(async () => {
            const result = await updateRequestStatus(requestId, nextStatus, rider.id)
            if (result.success) {
                // Generate WhatsApp message
                const req = requests.find(r => r.id === requestId)
                const msg = generateWhatsAppMessage(nextStatus, req, rider)
                if (msg) setWhatsappMessage({ text: msg, id: requestId })
            }
            setLocalLoadingId(null)
        })
    }

    const generateWhatsAppMessage = (status: string, req: any, rider: any) => {
        const serviceName = req.service?.replace('_', ' ').toUpperCase() || 'Service'
        const riderName = rider.name || 'Your Rider'

        switch (status) {
            case 'en_route':
                return `Good news! ${riderName} is on the way to your location for your ${serviceName}. Estimated arrival: 15 minutes. Track here: https://fixxo.in/track/${req.id.slice(0, 8)}`
            case 'in_progress':
                return `The service for your request ${serviceName} has started. We'll notify you once it's completed.`
            case 'completed':
                return `Your ${serviceName} service is complete! Hope you had a great experience. Please complete the payment of ₹499 using this secure link: https://razorpay.me/l/${req.id.slice(0, 8)}`
            default:
                return null
        }
    }

    const handleMarkAllDone = async () => {
        if (!confirm('Are you sure you want to mark all active tasks as completed?')) return
        setLocalLoadingId('all')
        startTransition(async () => {
            await markAllRequestsAsDone(rider.id)
            setLocalLoadingId(null)
        })
    }

    const activeRequests = requests.filter(r => r.status !== 'completed' && r.status !== 'cancelled')
    const hasActiveTasks = activeRequests.length > 0

    const parseDetails = (details: any) => {
        if (typeof details === 'string') {
            try { return JSON.parse(details) } catch (e) { return {} }
        }
        return details || {}
    }

    const handleSendWhatsApp = async (text: string) => {
        try {
            // Mocking the WhatsApp send action
            console.log('Sending WhatsApp Message:', text)
            await navigator.clipboard.writeText(text)
            alert('Message copied to clipboard! You can now paste it in WhatsApp.')
            setWhatsappMessage(null)
        } catch (err) {
            console.error('Failed to copy/send:', err)
            alert('Failed to copy message. Please try again.')
        }
    }

    return (
        <div className="space-y-4">
            {/* WhatsApp Notification Modal */}
            {whatsappMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="glass max-w-md w-full p-6 rounded-3xl border border-white/20 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-300">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-green-500">
                                <MessageSquare className="w-5 h-5" />
                                <span className="font-bold">Next Step: Update Customer</span>
                            </div>
                            <button onClick={() => setWhatsappMessage(null)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                                <X className="w-5 h-5 text-muted-foreground" />
                            </button>
                        </div>
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 italic text-sm text-white/90">
                            "{whatsappMessage.text}"
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleSendWhatsApp(whatsappMessage.text)}
                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all active:scale-95"
                            >
                                <Copy className="w-4 h-4" />
                                Copy & Send
                            </button>
                            <button
                                onClick={() => setWhatsappMessage(null)}
                                className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all"
                            >
                                Skip
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                        const isCancelled = req.status === 'cancelled'
                        const isLoading = localLoadingId === req.id || (localLoadingId === 'all' && !isDone)

                        const nextStep = statusFlow.find(s => s.current === req.status)

                        return (
                            <div key={req.id} className={`glass p-5 rounded-2xl border border-white/10 transition-all group ${(isDone || isCancelled) ? 'opacity-60' : 'hover:border-primary/30'}`}>
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div className="space-y-3 flex-1 min-w-[280px]">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${isDone ? 'bg-green-500/10 border-green-500/20' : isCancelled ? 'bg-red-500/10 border-red-500/20' : 'bg-primary/10 border-primary/20'
                                                }`}>
                                                <Package className={`w-5 h-5 ${isDone ? 'text-green-500' : isCancelled ? 'text-red-500' : 'text-primary'}`} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-mono text-muted-foreground uppercase">#{req.id.slice(0, 8)}</span>
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${isDone ? 'border-green-500/20 text-green-500 bg-green-500/10' : isCancelled ? 'border-red-500/20 text-red-500 bg-red-500/10' : 'border-yellow-500/20 text-yellow-500 bg-yellow-500/10'
                                                        } uppercase`}>
                                                        {req.status}
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-white mt-0.5">{req.service?.replace('_', ' ').toUpperCase()} • {req.user_phone}</h3>
                                            </div>
                                        </div>

                                        <div className="space-y-2 ml-1">
                                            <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <MapPin className="w-4 h-4 mt-0.5 text-primary" />
                                                <span>{typeof details.area === 'object' ? Object.values(details.area).filter(v => typeof v === 'string').join(', ') : (details.area || 'Location details in app')}</span>
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
                                        {!isDone && !isCancelled && (
                                            <>
                                                {nextStep && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(req.id, nextStep.next)}
                                                        disabled={isPending}
                                                        className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50"
                                                    >
                                                        {isLoading ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <nextStep.icon className="w-4 h-4" />
                                                        )}
                                                        {nextStep.label}
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => {
                                                        if (confirm('Are you sure you want to cancel this request?')) {
                                                            handleStatusUpdate(req.id, 'cancelled')
                                                        }
                                                    }}
                                                    disabled={isPending}
                                                    className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl border border-red-500/20 transition-all active:scale-95 disabled:opacity-50"
                                                    title="Cancel Request"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </>
                                        )}
                                        <button className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all text-muted-foreground hover:text-white flex items-center gap-2">
                                            <Navigation className="w-4 h-4 font-bold" />
                                            <span className='hidden sm:inline font-bold'>Map</span>
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
