'use client'

import { motion } from 'framer-motion'
import { ShieldAlert, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen bg-background bg-gradient-mesh flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full"
            >
                <div className="glass-card text-center">
                    <div className="w-20 h-20 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-destructive/30">
                        <ShieldAlert className="w-10 h-10 text-destructive" />
                    </div>

                    <h1 className="text-3xl font-bold text-gradient mb-4">Unauthorized Access</h1>
                    <p className="text-muted-foreground mb-8">
                        Your account does not have permission to access the Sipahi Control Panel.
                        This area is restricted to authorized administrative personnel only.
                    </p>

                    <div className="space-y-4">
                        <Link
                            href="/login"
                            className="w-full h-12 bg-white/5 border border-white/10 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all font-semibold"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Return to Login
                        </Link>
                    </div>

                    <p className="mt-8 text-xs text-muted-foreground/50">
                        Security Event ID: {Math.random().toString(36).substring(7).toUpperCase()}
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
