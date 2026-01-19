import { Shield, Calendar, User, Activity, Filter, Download } from 'lucide-react';

// Mock audit log data
const MOCK_AUDIT_LOGS = [
    {
        id: 'log-001',
        timestamp: '2026-01-19T11:45:00Z',
        user: 'Rahul Sharma',
        action: 'Hotel Status Changed',
        details: 'Changed Lemon Tree Premier status from Active to Suspended',
        category: 'hotel',
    },
    {
        id: 'log-002',
        timestamp: '2026-01-19T10:30:00Z',
        user: 'Priya Menon',
        action: 'Kiosk Assigned',
        details: 'Assigned kiosk ATC-SN-9988 to Royal Orchid Bangalore',
        category: 'kiosk',
    },
    {
        id: 'log-003',
        timestamp: '2026-01-19T09:15:00Z',
        user: 'System',
        action: 'Heartbeat Alert',
        details: 'Kiosk ATC-SN-7766 offline for more than 24 hours',
        category: 'alert',
    },
    {
        id: 'log-004',
        timestamp: '2026-01-18T16:00:00Z',
        user: 'Amit Patel',
        action: 'Invoice Generated',
        details: 'Generated invoice INV-2026-001 for Royal Orchid Bangalore',
        category: 'billing',
    },
    {
        id: 'log-005',
        timestamp: '2026-01-18T14:30:00Z',
        user: 'Rahul Sharma',
        action: 'User Created',
        details: 'Created new user account for sneha@atc.in',
        category: 'user',
    },
    {
        id: 'log-006',
        timestamp: '2026-01-18T11:00:00Z',
        user: 'Priya Menon',
        action: 'Hotel Onboarded',
        details: 'Onboarded new hotel: Sayaji Hotel, Indore',
        category: 'hotel',
    },
];

function CategoryBadge({ category }: { category: string }) {
    const styles: Record<string, string> = {
        hotel: 'bg-blue-100 text-blue-700',
        kiosk: 'bg-purple-100 text-purple-700',
        alert: 'bg-rose-100 text-rose-700',
        billing: 'bg-emerald-100 text-emerald-700',
        user: 'bg-amber-100 text-amber-700',
    };

    return (
        <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${styles[category] || 'bg-slate-100 text-slate-600'}`}>
            {category}
        </span>
    );
}

export default function AuditPage() {
    return (
        <div className="p-6">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900">Audit Logs</h1>
                    <p className="text-sm text-slate-500">Security and activity log (read-only)</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-sm text-slate-600 rounded-md hover:bg-slate-50 transition-colors">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800 transition-colors">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Audit Log Table */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                Timestamp
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                User
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                Action
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                Category
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                Details
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {MOCK_AUDIT_LOGS.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                        {new Date(log.timestamp).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        {log.user === 'System' ? (
                                            <Activity className="w-4 h-4 text-slate-400" />
                                        ) : (
                                            <User className="w-4 h-4 text-slate-400" />
                                        )}
                                        <span className="text-sm text-slate-900">{log.user}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="text-sm font-medium text-slate-900">{log.action}</span>
                                </td>
                                <td className="px-4 py-3">
                                    <CategoryBadge category={log.category} />
                                </td>
                                <td className="px-4 py-3">
                                    <span className="text-sm text-slate-500">{log.details}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="mt-4 text-sm text-slate-500">
                Showing <span className="font-medium text-slate-700">{MOCK_AUDIT_LOGS.length}</span> recent logs
            </div>
        </div>
    );
}
