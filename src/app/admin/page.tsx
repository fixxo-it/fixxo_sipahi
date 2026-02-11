import { createClient } from '@/utils/supabase/server'
import {
    TrendingUp,
    AlertCircle,
    Clock,
    ArrowUpRight,
    Package,
    Activity
} from 'lucide-react'

export default async function AdminDashboard() {
    const supabase = await createClient()

    // Fetch some stats using head: true for efficiency
    const { count: totalRequests } = await supabase
        .from('requests')
        .select('*', { count: 'exact', head: true })

    const { count: activeRiders } = await supabase
        .from('riders')
        .select('*', { count: 'exact', head: true })
        .eq('is_available', true)

    const { count: pendingRequests } = await supabase
        .from('requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'new')

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gradient">System Overview</h1>
                <p className="text-muted-foreground mt-1">Real-time status of the Fixxo service network.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Total Requests"
                    value={totalRequests || 0}
                    icon={<Package className="w-5 h-5 text-primary" />}
                    trend="+12%"
                />
                <StatsCard
                    title="Active Riders"
                    value={activeRiders || 0}
                    icon={<Activity className="w-5 h-5 text-green-500" />}
                    trend="+3"
                />
                <StatsCard
                    title="Pending Requests"
                    value={pendingRequests || 0}
                    icon={<Clock className="w-5 h-5 text-yellow-500" />}
                    trend="-5%"
                />
                <StatsCard
                    title="Avg Success Rate"
                    value="98.2%"
                    icon={<TrendingUp className="w-5 h-5 text-blue-500" />}
                    trend="+0.4%"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold">Recent Activity</h2>
                        <button className="text-xs text-primary hover:underline flex items-center gap-1">
                            View All <ArrowUpRight className="w-3 h-3" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                                    <AlertCircle className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">New request received for {['Ironing', 'Dog Walking', 'Nanny'][i - 1]}</p>
                                    <p className="text-xs text-muted-foreground">Area: {['Powai', 'Andheri', 'Bandra'][i - 1]} • {i * 5} mins ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-card">
                    <h2 className="text-lg font-semibold mb-6">Service Distribution</h2>
                    <div className="space-y-4">
                        <ServiceProgress name="Ironing" percentage={45} />
                        <ServiceProgress name="Dog Walking" percentage={25} />
                        <ServiceProgress name="Nanny" percentage={15} />
                        <ServiceProgress name="Gardener" percentage={15} />
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatsCard({ title, value, icon, trend }: { title: string, value: string | number, icon: React.ReactNode, trend: string }) {
    return (
        <div className="glass-card">
            <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                    {icon}
                </div>
                <span className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">{trend}</span>
            </div>
            <div>
                <p className="text-sm text-muted-foreground">{title}</p>
                <p className="text-2xl font-bold mt-1 text-white">{value}</p>
            </div>
        </div>
    )
}

function ServiceProgress({ name, percentage }: { name: string, percentage: number }) {
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{name}</span>
                <span className="font-medium text-white">{percentage}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                <div
                    className="h-full bg-primary transition-all duration-1000"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    )
}
