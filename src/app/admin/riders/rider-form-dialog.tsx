'use client'

import { useState, useMemo } from 'react'
import { Plus, X, Loader2, Save, MapPin } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'

// Dynamically import map to avoid SSR issues
const MapPicker = dynamic(() => import('./map-picker'), {
    ssr: false,
    loading: () => (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            <p className="text-sm">Initializing Map...</p>
        </div>
    )
})

const SERVICE_TYPES = [
    { value: 'ironing', label: 'Ironing' },
    { value: 'dog_walker', label: 'Dog Walker' },
    { value: 'nanny', label: 'Nanny' },
    { value: 'gardener', label: 'Gardener' },
]

interface RiderFormDialogProps {
    rider?: any
    trigger?: React.ReactNode
}

export default function RiderFormDialog({ rider, trigger }: RiderFormDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [location, setLocation] = useState<{ lat: number, lng: number } | null>(
        rider?.latitude && rider?.longitude ? { lat: rider.latitude, lng: rider.longitude } : null
    )

    const router = useRouter()
    const supabase = createClient()

    const handleLocationSelect = (lat: number, lng: number) => {
        setLocation({ lat, lng })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const name = formData.get('name') as string
        const phone = formData.get('phone') as string
        const service = formData.get('service') as string
        const address = formData.get('address') as string
        const is_available = formData.get('is_available') === 'on'
        const usernameInput = formData.get('username') as string
        const passwordInput = formData.get('password') as string

        const finalUsername = usernameInput || (name.toLowerCase().replace(/\s+/g, '_') + '_' + Math.random().toString(36).substring(7))
        const finalPassword = passwordInput || Math.random().toString(36).substring(2, 14).toUpperCase()

        const payload = {
            name,
            phone,
            service,
            is_available,
            address,
            latitude: location?.lat,
            longitude: location?.lng,
            username: finalUsername,
            password: finalPassword
        }

        let dbError;
        if (rider?.id) {
            const { error } = await supabase
                .from('riders')
                .update(payload)
                .eq('id', rider.id)
            dbError = error
        } else {
            const { error } = await supabase
                .from('riders')
                .insert([{ ...payload, rating: 5.0 }])
            dbError = error
        }

        if (dbError) {
            setError(dbError.message)
            setIsLoading(false)
            return
        }

        setIsOpen(false)
        setIsLoading(false)
        if (!rider) setLocation(null) // Only clear location if it was a new rider
        router.refresh()
    }

    return (
        <>
            {trigger ? (
                <div onClick={() => setIsOpen(true)}>{trigger}</div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20"
                >
                    <Plus className="w-4 h-4" />
                    Add New Rider
                </button>
            )}

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-2xl glass rounded-2xl overflow-hidden relative max-h-[90vh] flex flex-col"
                        >
                            <div className="p-6 border-b border-white/10 flex items-center justify-between shrink-0">
                                <h2 className="text-xl font-bold text-gradient">{rider ? 'Edit Rider' : 'Add New Rider'}</h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="overflow-y-auto p-6 scrollbar-hide">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {error && (
                                        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                                            {error}
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label htmlFor="name" className="text-sm font-medium text-muted-foreground">Full Name</label>
                                            <input
                                                required
                                                id="name"
                                                name="name"
                                                type="text"
                                                defaultValue={rider?.name}
                                                placeholder="Enter rider name"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label htmlFor="phone" className="text-sm font-medium text-muted-foreground">Phone Number</label>
                                            <input
                                                required
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                defaultValue={rider?.phone}
                                                placeholder="e.g. +91 9876543210"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label htmlFor="service" className="text-sm font-medium text-muted-foreground">Service Type</label>
                                            <select
                                                required
                                                id="service"
                                                name="service"
                                                defaultValue={rider?.service}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                                            >
                                                <option value="" disabled className="bg-background">Select a service</option>
                                                {SERVICE_TYPES.map(type => (
                                                    <option key={type.value} value={type.value} className="bg-background">{type.label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10 h-[58px]">
                                                <input
                                                    id="is_available"
                                                    name="is_available"
                                                    type="checkbox"
                                                    defaultChecked={rider ? rider.is_available : true}
                                                    className="w-5 h-5 rounded-md border-white/10 bg-white/5 text-primary focus:ring-primary/50"
                                                />
                                                <label htmlFor="is_available" className="text-sm font-medium cursor-pointer">
                                                    Available
                                                </label>
                                            </div>
                                        </div>

                                        {/* Username and Token Fields */}
                                        <div className="space-y-1.5">
                                            <label htmlFor="username" className="text-sm font-medium text-muted-foreground">Username (Leave blank for auto-gen)</label>
                                            <input
                                                id="username"
                                                name="username"
                                                type="text"
                                                defaultValue={rider?.username}
                                                placeholder="Auto-generated if empty"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono text-sm"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label htmlFor="password" className="text-sm font-medium text-muted-foreground">Token (Leave blank for auto-gen)</label>
                                            <input
                                                id="password"
                                                name="password"
                                                type="text"
                                                defaultValue={rider?.password}
                                                placeholder="Auto-generated if empty"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono text-sm uppercase"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label htmlFor="address" className="text-sm font-medium text-muted-foreground">Address</label>
                                        <textarea
                                            required
                                            id="address"
                                            name="address"
                                            rows={2}
                                            defaultValue={rider?.address}
                                            placeholder="Enter full address details"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-primary" />
                                            Set Location on Map (Free OpenStreetMap)
                                        </label>

                                        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 min-h-[250px] z-0">
                                            <MapPicker onLocationSelect={handleLocationSelect} location={location} />
                                        </div>

                                        {location && (
                                            <div className="flex gap-4 text-xs text-muted-foreground bg-white/5 p-2 rounded-lg border border-white/10">
                                                <span>Lat: {location.lat.toFixed(6)}</span>
                                                <span>Long: {location.lng.toFixed(6)}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-2 flex gap-3 pb-2">
                                        <button
                                            type="button"
                                            onClick={() => setIsOpen(false)}
                                            className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl font-semibold hover:bg-white/10 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {isLoading ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Save className="w-4 h-4" />
                                            )}
                                            {rider ? 'Update Rider' : 'Save Rider'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}

