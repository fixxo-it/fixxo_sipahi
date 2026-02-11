import { Shield, Users, ClipboardList, LogOut, Settings } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const ALLOWED_USER_ID = '3431eac0-9d65-4f9a-82d7-91e125631cb8'
    const ALLOWED_EMAIL = 'founder@fixxoit.com'

    if (user.id !== ALLOWED_USER_ID || user.email !== ALLOWED_EMAIL) {
        redirect('/unauthorized')
    }

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-md hidden md:flex flex-col">
                <div className="p-6">
                    <div className="flex items-center gap-2 font-bold text-xl text-gradient">
                        <Shield className="w-6 h-6 text-primary" />
                        <span>Fixxo Sipahi</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors group"
                    >
                        <ClipboardList className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span>Dashboard</span>
                    </Link>
                    <Link
                        href="/admin/riders"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary group"
                    >
                        <Users className="w-5 h-5" />
                        <span>Riders</span>
                    </Link>
                    <Link
                        href="/admin/settings"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors group"
                    >
                        <Settings className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span>Settings</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-border">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                            {user.email?.[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user.email}</p>
                        </div>
                    </div>
                    <form action="/auth/signout" method="post">
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors mt-2">
                            <LogOut className="w-5 h-5" />
                            <span>Sign Out</span>
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <header className="h-16 border-b border-border bg-card/50 backdrop-blur-md md:hidden flex items-center px-4 justify-between">
                    <div className="flex items-center gap-2 font-bold text-lg text-gradient">
                        <Shield className="w-5 h-5 text-primary" />
                        <span>Sipahi</span>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-white/5">
                        <Users className="w-6 h-6" />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto bg-gradient-mesh">
                    <div className="max-w-7xl mx-auto p-4 md:p-8">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}
