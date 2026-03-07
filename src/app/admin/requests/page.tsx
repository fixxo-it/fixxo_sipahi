import { api } from '@/utils/api'
import { getRiderToken } from '@/utils/auth'
import RequestsList from './requests-list'
import { Package, Clock, CheckCircle2, AlertCircle } from 'lucide-react'

export default async function RequestsPage() {
    const token = await getRiderToken()

    // Fetch requests with rider data from the backend
    const { data: requests, error } = await api.get<any[]>('/admin/requests', token || undefined)

    // Fetch riders for the filter dropdown
    const { data: riders } = await api.get<any[]>('/admin/riders', token || undefined)

    if (error) {
        console.error('Error fetching requests:', error)
    }

    const stats = {
        total: requests?.length || 0,
        pending: requests?.filter((r: any) => r.status === 'new').length || 0,
        completed: requests?.filter((r: any) => r.status === 'completed').length || 0,
        unassigned: requests?.filter((r: any) => !r.assigned_rider_id).length || 0
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gradient">Requests Management</h1>
                <p className="text-muted-foreground mt-1">Monitor, assign and track service requests in real-time.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-card flex items-center gap-4 py-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                        <Package className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Total Requests</p>
                        <p className="text-xl font-bold">{stats.total}</p>
                    </div>
                </div>
                <div className="glass-card flex items-center gap-4 py-4">
                    <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                        <Clock className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Pending</p>
                        <p className="text-xl font-bold">{stats.pending}</p>
                    </div>
                </div>
                <div className="glass-card flex items-center gap-4 py-4">
                    <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Completed</p>
                        <p className="text-xl font-bold">{stats.completed}</p>
                    </div>
                </div>
                <div className="glass-card flex items-center gap-4 py-4">
                    <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Unassigned</p>
                        <p className="text-xl font-bold">{stats.unassigned}</p>
                    </div>
                </div>
            </div>

            <RequestsList initialRequests={requests || []} riders={riders || []} />
        </div>
    )
}
