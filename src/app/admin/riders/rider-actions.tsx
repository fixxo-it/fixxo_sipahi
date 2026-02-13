'use client'

import { useState } from 'react'
import { MoreVertical, CheckCircle2, XCircle, Loader2, Trash2, Edit } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import RiderFormDialog from './rider-form-dialog'

interface RiderActionsProps {
    rider: any
}

export default function RiderActions({ rider }: RiderActionsProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const toggleAvailability = async () => {
        setIsLoading(true)
        const { error } = await supabase
            .from('riders')
            .update({ is_available: !rider.is_available })
            .eq('id', rider.id)

        if (error) {
            console.error('Error updating availability:', error)
            alert('Failed to update availability')
        } else {
            router.refresh()
        }
        setIsLoading(false)
        setIsOpen(false)
    }

    const deleteRider = async () => {
        if (!confirm('Are you sure you want to delete this rider? This action cannot be undone.')) return

        setIsLoading(true)
        const { error } = await supabase
            .from('riders')
            .delete()
            .eq('id', rider.id)

        if (error) {
            console.error('Error deleting rider:', error)
            alert('Failed to delete rider')
        } else {
            router.refresh()
        }
        setIsLoading(false)
        setIsOpen(false)
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-muted-foreground hover:text-white"
            >
                {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <MoreVertical className="w-4 h-4" />
                )}
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
                                <RiderFormDialog
                                    rider={rider}
                                    trigger={
                                        <button
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-white/10 rounded-lg transition-colors"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <Edit className="w-4 h-4 text-primary" />
                                            <span>Edit Details</span>
                                        </button>
                                    }
                                />
                                <button
                                    onClick={toggleAvailability}
                                    disabled={isLoading}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    {rider.is_available ? (
                                        <>
                                            <XCircle className="w-4 h-4 text-red-500" />
                                            <span>Make Unavailable</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            <span>Make Available</span>
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={deleteRider}
                                    disabled={isLoading}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Delete Rider</span>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

