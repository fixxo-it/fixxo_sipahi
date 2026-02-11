'use client'

import { useState, useMemo } from 'react'
import {
    Search,
    Filter,
    Package,
    User,
    Clock,
    CheckCircle2,
    XCircle,
    MapPin,
    Phone,
    Calendar,
    ChevronDown,
    MoreVertical,
    CheckCircle,
    Bike
} from 'lucide-react'
// Removed date-fns import

interface Rider {
    id: string
    name: string
    phone: string
    service: string
}

interface RequestDetails {
    lat?: number
    lng?: number
    area?: string
    time?: string
    duration?: string
}

interface Request {
    id: string
    user_id: string
    user_phone: string
    service: string
    details: string | RequestDetails
    status: string
    assigned_rider_id: string | null
    created_at: string
    updated_at: string
    rider?: Rider // Joined rider data
}

interface RequestsListProps {
    initialRequests: Request[]
    riders: Rider[]
}

export default function RequestsList({ initialRequests, riders }: RequestsListProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [serviceFilter, setServiceFilter] = useState('all')
    const [assignmentFilter, setAssignmentFilter] = useState('all') // all, assigned, unassigned
    const [riderFilter, setRiderFilter] = useState('all')

    const filteredRequests = useMemo(() => {
        return initialRequests.filter(req => {
            // Search filter
            const matchesSearch =
                (req.id?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
                (req.user_phone?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
                (typeof req.details === 'string' ? req.details : JSON.stringify(req.details)).toLowerCase().includes(searchQuery.toLowerCase())

            // Service filter
            const matchesService = serviceFilter === 'all' || req.service === serviceFilter

            // Assignment filter
            const matchesAssignment =
                assignmentFilter === 'all' ||
                (assignmentFilter === 'assigned' && req.assigned_rider_id) ||
                (assignmentFilter === 'unassigned' && !req.assigned_rider_id)

            // Rider filter
            const matchesRider = riderFilter === 'all' || req.assigned_rider_id === riderFilter

            return matchesSearch && matchesService && matchesAssignment && matchesRider
        })
    }, [initialRequests, searchQuery, serviceFilter, assignmentFilter, riderFilter])

    const services = Array.from(new Set(initialRequests.map(r => r.service)))

    const parseDetails = (details: string | RequestDetails): RequestDetails => {
        if (typeof details === 'object' && details !== null) return details
        try {
            return JSON.parse(details)
        } catch (e) {
            console.error('Failed to parse details:', details)
            return {}
        }
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'new': return 'text-blue-500 bg-blue-500/10 border-blue-500/20'
            case 'completed': return 'text-green-500 bg-green-500/10 border-green-500/20'
            case 'cancelled': return 'text-red-500 bg-red-500/10 border-red-500/20'
            case 'assigned': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20'
            default: return 'text-muted-foreground bg-white/5 border-white/10'
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by ID, phone, or area..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                        <select
                            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none min-w-[120px]"
                            value={serviceFilter}
                            onChange={(e) => setServiceFilter(e.target.value)}
                        >
                            <option value="all">All Services</option>
                            {services.map(s => (
                                <option key={s} value={s}>{s.replace('_', ' ').charAt(0).toUpperCase() + s.slice(1)}</option>
                            ))}
                        </select>
                    </div>

                    <select
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none min-w-[120px]"
                        value={assignmentFilter}
                        onChange={(e) => setAssignmentFilter(e.target.value)}
                    >
                        <option value="all">All Assignments</option>
                        <option value="assigned">Assigned</option>
                        <option value="unassigned">Unassigned</option>
                    </select>

                    <select
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none min-w-[150px]"
                        value={riderFilter}
                        onChange={(e) => setRiderFilter(e.target.value)}
                    >
                        <option value="all">All Riders</option>
                        {riders.map(r => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="glass rounded-2xl overflow-hidden border border-white/10">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-xs uppercase tracking-wider text-muted-foreground">
                                <th className="px-6 py-4 font-semibold">Service & ID</th>
                                <th className="px-6 py-4 font-semibold">Customer</th>
                                <th className="px-6 py-4 font-semibold">Location & Time</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">Assigned Rider</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-medium">
                            {filteredRequests.map((req) => {
                                const details = parseDetails(req.details)
                                return (
                                    <tr key={req.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                                    <Package className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-white capitalize">{req.service.replace('_', ' ')}</p>
                                                    <p className="text-[10px] text-muted-foreground font-mono uppercase">#{req.id?.slice(0, 8)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm text-white">
                                                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                                                    {req.user_phone || 'N/A'}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <Phone className="w-3.5 h-3.5" />
                                                    Customer ID: {req.user_id?.slice(0, 8) || 'N/A'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="max-w-[250px] space-y-1.5">
                                                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                                                    <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                                    <span className="line-clamp-2">{details.area || 'No location details'}</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-1.5 text-[10px] text-primary">
                                                        <Calendar className="w-3 h-3" />
                                                        {details.time ? new Date(details.time).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }) : 'N/A'}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                                        <Clock className="w-3 h-3" />
                                                        {details.duration || 'N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(req.status)} uppercase tracking-wider`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {req.rider ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                                                        <span className="text-[10px] font-bold text-green-500">{req.rider.name[0]}</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-white">{req.rider.name}</p>
                                                        <p className="text-[10px] text-muted-foreground">{req.rider.phone}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 italic">
                                                        ?
                                                    </div>
                                                    Unassigned
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-muted-foreground hover:text-white">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                            {filteredRequests.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center gap-2">
                                            <Package className="w-12 h-12 opacity-20" />
                                            <p>No requests found matching your filters.</p>
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
