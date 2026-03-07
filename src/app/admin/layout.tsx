import { Shield, Users, ClipboardList, LogOut, Settings, Package } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getRiderSession, clearRiderAuth } from '@/utils/auth'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getRiderSession()

    if (!session) {
        redirect('/login')
    }

    // TODO: Add proper admin role check
    // For now, any authenticated user can access admin

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
                        href="/admin/requests"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors group"
                    >
                        <Package className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span>Requests</span>
                    </Link>
                    <Link
                        href="/admin/riders"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors group"
                    >
                        <Users className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
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
                    <form action={async () => {
                        'use server'
                        await clearRiderAuth()
                        redirect('/login')
                    }}>
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
