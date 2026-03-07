'use client'

import { sendOtp, verifyOtp } from './actions'
import { motion, AnimatePresence } from 'framer-motion'
import { Bike, Phone, Key, ArrowRight, Lock, Loader2 } from 'lucide-react'
import { useState } from 'react'

export default function LoginPage() {
    const [step, setStep] = useState<'phone' | 'otp'>('phone')
    const [phone, setPhone] = useState('')
    const [otp, setOtp] = useState('')
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)

    const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsPending(true)
        setError(null)
        setMessage(null)

        const result = await sendOtp(phone)

        if (result.error) {
            setError(result.error)
        } else {
            setMessage(result.message || 'OTP sent!')
            setStep('otp')
        }
        setIsPending(false)
    }

    const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsPending(true)
        setError(null)

        const result = await verifyOtp(phone, otp)

        if (result?.error) {
            setError(result.error)
            setIsPending(false)
        }
        // If successful, the action will redirect to /rider/dashboard
    }

    return (
        <div className="min-h-screen bg-background bg-gradient-mesh flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="glass-card flex flex-col items-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-6">
                        <Bike className="w-8 h-8 text-primary" />
                    </div>

                    <h1 className="text-3xl font-bold text-gradient mb-2 underline underline-offset-8">
                        Rider Portal
                    </h1>
                    <p className="text-muted-foreground mb-8 text-center px-4">
                        {step === 'phone'
                            ? 'Enter your registered phone number to receive an OTP.'
                            : `Enter the 4-digit OTP sent to ${phone}`}
                    </p>

                    <div className="w-full space-y-6">
                        <AnimatePresence mode="wait">
                            {step === 'phone' ? (
                                <motion.form
                                    key="phone"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    onSubmit={handleSendOtp}
                                    className="w-full space-y-4"
                                >
                                    {error && (
                                        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                                            {error}
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                                required
                                                placeholder="10-digit Phone Number"
                                                pattern="[0-9]{10}"
                                                maxLength={10}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono text-lg tracking-widest"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isPending || phone.length !== 10}
                                        className="w-full h-12 bg-primary text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {isPending ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                Send OTP
                                                <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </motion.form>
                            ) : (
                                <motion.form
                                    key="otp"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    onSubmit={handleVerifyOtp}
                                    className="w-full space-y-4"
                                >
                                    {error && (
                                        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                                            {error}
                                        </div>
                                    )}
                                    {message && (
                                        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-sm text-center">
                                            {message}
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <div className="relative">
                                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <input
                                                type="text"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                                required
                                                placeholder="4-digit OTP"
                                                pattern="[0-9]{4}"
                                                maxLength={4}
                                                autoFocus
                                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono text-2xl tracking-[0.5em] text-center"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isPending || otp.length !== 4}
                                        className="w-full h-12 bg-primary text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {isPending ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                Verify & Sign In
                                                <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => { setStep('phone'); setOtp(''); setError(null); setMessage(null) }}
                                        className="w-full py-2 text-sm text-muted-foreground hover:text-white transition-colors"
                                    >
                                        ← Change phone number
                                    </button>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
                        <Lock className="w-3 h-3" />
                        <span>Secured by JWT • OTP via FastAPI Backend</span>
                    </div>
                </div>

                <p className="text-center mt-6 text-sm text-muted-foreground/50">
                    © 2026 FamCARE. All rights reserved.
                </p>
            </motion.div>
        </div>
    )
}
