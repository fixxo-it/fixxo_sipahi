'use client'

import { useState } from 'react'
import { MoreVertical, UserPlus, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'

interface RequestActionsProps {
    request: any
    riders: any[] // available riders
}

export default function RequestActions({ request, riders }: RequestActionsProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [showAssignDialog, setShowAssignDialog] = useState(false)
    const [selectedRider, setSelectedRider] = useState('')
    const router = useRouter()

    const assignRider = async () => {
        if (!selectedRider) return
        setIsLoading(true)

        try {
            // Step 1: Propose the assignment
            const proposeRes = await fetch(`${API_BASE_URL}/assignments/run`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    request_id: request.id,
                    rider_id: selectedRider
                })
            })

            if (!proposeRes.ok) {
                const data = await proposeRes.json()
                throw new Error(data.detail || 'Failed to propose assignment')
            }

            // Step 2: Accept the assignment (moves request to 'assigned' status)
            const acceptRes = await fetch(`${API_BASE_URL}/assignments/accept`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    request_id: request.id,
                    rider_id: selectedRider
                })
            })

            if (!acceptRes.ok) {
                const data = await acceptRes.json()
                throw new Error(data.detail || 'Failed to accept assignment')
            }

            alert('Rider successfully assigned! The task will appear on their dashboard.')
            setShowAssignDialog(false)
            setIsOpen(false)
            router.refresh()
        } catch (error: any) {
            console.error('Error assigning:', error)
            alert(error.message || 'Error assigning rider')
        } finally {
            setIsLoading(false)
        }
    }

    if (request.status !== 'new') {
        return null // Only allow assigning new requests for now
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-muted-foreground hover:text-white"
            >
                <MoreVertical className="w-4 h-4" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="absolute right-0 mt-2 w-48 glass rounded-xl overflow-hidden border border-white/10 z-50 shadow-2xl"
                        >
                            <div className="p-1">
                                <button
                                    onClick={() => {
                                        setIsOpen(false)
                                        setShowAssignDialog(true)
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <UserPlus className="w-4 h-4 text-primary" />
                                    <span>Assign Rider</span>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showAssignDialog && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAssignDialog(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-md glass rounded-2xl overflow-hidden relative p-6 border border-white/10"
                        >
                            <h3 className="text-lg font-bold text-white mb-4">Assign Rider</h3>
                            <div className="space-y-4">
                                <select
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    value={selectedRider}
                                    onChange={(e) => setSelectedRider(e.target.value)}
                                >
                                    <option value="" disabled className="bg-background">Select a rider...</option>
                                    {riders.filter(r => r.is_available).map(rider => (
                                        <option key={rider.id} value={rider.id} className="bg-background">
                                            {rider.name} ({rider.service})
                                        </option>
                                    ))}
                                </select>

                                <div className="flex gap-3 justify-end mt-6">
                                    <button
                                        onClick={() => setShowAssignDialog(false)}
                                        className="px-4 py-2 text-sm font-medium text-white hover:bg-white/10 rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={assignRider}
                                        disabled={!selectedRider || isLoading}
                                        className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                        Assign
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
