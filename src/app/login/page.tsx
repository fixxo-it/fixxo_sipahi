'use client'

import { loginWithGoogle, riderLogin } from './actions'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Lock, ArrowRight, Bike, User as UserIcon, Key } from 'lucide-react'
import { useState } from 'react'

export default function LoginPage() {
    const [loginType, setLoginType] = useState<'admin' | 'rider'>('admin')
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleRiderLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsPending(true)
        setError(null)
        const formData = new FormData(e.currentTarget)
        const result = await riderLogin(formData)
        if (result?.error) {
            setError(result.error)
            setIsPending(false)
        }
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
                        {loginType === 'admin' ? (
                            <Shield className="w-8 h-8 text-primary" />
                        ) : (
                            <Bike className="w-8 h-8 text-primary" />
                        )}
                    </div>

                    <h1 className="text-3xl font-bold text-gradient mb-2 underline underline-offset-8">
                        {loginType === 'admin' ? 'Fixxo Admin' : 'Rider Portal'}
                    </h1>
                    <p className="text-muted-foreground mb-8 text-center px-4">
                        {loginType === 'admin'
                            ? 'Access the Sipahi Control Panel. Restricted access for authorized personnel.'
                            : 'Enter your credentials to view your assigned tasks and update status.'}
                    </p>

                    <div className="w-full space-y-6">
                        <AnimatePresence mode="wait">
                            {loginType === 'admin' ? (
                                <motion.div
                                    key="admin"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="w-full"
                                >
                                    <button
                                        onClick={() => loginWithGoogle()}
                                        className="w-full h-12 bg-white text-black font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-white/90 transition-all active:scale-95 group"
                                    >
                                        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                                        Sign in with Google
                                        <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.form
                                    key="rider"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    onSubmit={handleRiderLogin}
                                    className="w-full space-y-4"
                                >
                                    {error && (
                                        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                                            {error}
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <div className="relative">
                                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <input
                                                name="username"
                                                type="text"
                                                required
                                                placeholder="Rider Username"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="relative">
                                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <input
                                                name="password"
                                                type="password"
                                                required
                                                placeholder="Rider Token"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isPending}
                                        className="w-full h-12 bg-primary text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {isPending ? 'Signing in...' : 'Sign In to Portal'}
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </motion.form>
                            )}
                        </AnimatePresence>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/10" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-[#050505] px-2 text-muted-foreground">Or switch context</span>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setLoginType(loginType === 'admin' ? 'rider' : 'admin')
                                setError(null)
                            }}
                            className="w-full py-2 text-sm text-muted-foreground hover:text-white transition-colors flex items-center justify-center gap-2"
                        >
                            {loginType === 'admin' ? (
                                <><Bike className="w-4 h-4" /> Are you a Rider? Login here</>
                            ) : (
                                <><Shield className="w-4 h-4" /> Back to Admin Login</>
                            )}
                        </button>
                    </div>

                    <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
                        <Lock className="w-3 h-3" />
                        <span>{loginType === 'admin' ? 'Secured by Supabase Auth' : 'Verified against Rider Database'}</span>
                    </div>
                </div>

                <p className="text-center mt-6 text-sm text-muted-foreground/50">
                    © 2024 Endorphind. All rights reserved.
                </p>
            </motion.div>
        </div>
    )
}
