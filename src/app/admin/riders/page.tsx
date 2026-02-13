import { createClient } from '@/utils/supabase/server'
import { Search, Filter, MoreVertical, Bike, Star, CheckCircle2, Users, MapPin } from 'lucide-react'
import RiderFormDialog from './rider-form-dialog'
import RiderActions from './rider-actions'

export default async function RidersPage() {
    const supabase = await createClient()

    const { data: riders, error } = await supabase
        .from('riders')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching riders:', error)
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gradient">Riders Management</h1>
                    <p className="text-muted-foreground mt-1">Manage your fleet and add new service providers.</p>
                </div>
                <RiderFormDialog />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-card flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Total Riders</p>
                        <p className="text-2xl font-bold">{riders?.length || 0}</p>
                    </div>
                </div>
                <div className="glass-card flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Active Now</p>
                        <p className="text-2xl font-bold">{riders?.filter(r => r.is_available).length || 0}</p>
                    </div>
                </div>
                <div className="glass-card flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                        <Star className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Avg Rating</p>
                        <p className="text-2xl font-bold">4.8</p>
                    </div>
                </div>
            </div>

            <div className="glass rounded-2xl overflow-hidden border border-white/10">
                <div className="p-4 border-b border-white/10 flex flex-col md:flex-row gap-4 items-center justify-between bg-white/5">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search riders by name, phone or service..."
                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition-colors">
                            <Filter className="w-4 h-4" />
                            Filter
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-xs uppercase tracking-wider text-muted-foreground">
                                <th className="px-6 py-4 font-semibold">Rider Details</th>
                                <th className="px-6 py-4 font-semibold">Service & Address</th>
                                <th className="px-6 py-4 font-semibold">Availability</th>
                                <th className="px-6 py-4 font-semibold">Rating</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {riders?.map((rider) => (
                                <tr key={rider.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
                                                <span className="font-bold text-primary">{rider.name[0]}</span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">{rider.name}</p>
                                                <p className="text-sm text-muted-foreground">{rider.phone}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="max-w-[200px]">
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 capitalize mb-1 inline-block">
                                                {rider.service.replace('_', ' ')}
                                            </span>
                                            {rider.address && (
                                                <p className="text-xs text-muted-foreground truncate" title={rider.address}>
                                                    {rider.address}
                                                </p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            {rider.is_available ? (
                                                <div className="flex items-center gap-1.5 text-green-500 text-sm">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                    Available
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-red-500 text-sm">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                                    Unavailable
                                                </div>
                                            )}
                                            {rider.latitude && rider.longitude && (
                                                <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                    <MapPin className="w-2.5 h-2.5" />
                                                    Pinned Location
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                            <span className="text-sm font-medium">{rider.rating || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <RiderActions rider={rider} />
                                    </td>
                                </tr>
                            ))}
                            {(!riders || riders.length === 0) && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center gap-2">
                                            <Bike className="w-12 h-12 opacity-20" />
                                            <p>No riders found. Start by adding one!</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
