'use client'

import { loginWithGoogle } from './actions'
import { motion } from 'framer-motion'
import { Shield, Lock, ArrowRight } from 'lucide-react'

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-background bg-gradient-mesh flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="glass-card flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-6">
                        <Shield className="w-8 h-8 text-primary" />
                    </div>

                    <h1 className="text-3xl font-bold text-gradient mb-2 underline underline-offset-8">Fixxo Admin</h1>
                    <p className="text-muted-foreground mb-8">
                        Access the Sipahi Control Panel. Restricted access for authorized personnel only.
                    </p>

                    <div className="w-full space-y-4">
                        <button
                            onClick={() => loginWithGoogle()}
                            className="w-full h-12 bg-white text-black font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-white/90 transition-all active:scale-95 group"
                        >
                            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                            Sign in with Google
                            <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </button>
                    </div>

                    <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
                        <Lock className="w-3 h-3" />
                        <span>Secured by Supabase Auth</span>
                    </div>
                </div>

                <p className="text-center mt-6 text-sm text-muted-foreground/50">
                    © 2024 Endorphind. All rights reserved.
                </p>
            </motion.div>
        </div>
    )
}
