import { Cpu, Wifi, WifiOff, AlertTriangle, Clock, Building2 } from 'lucide-react';
import { MOCK_KIOSKS } from '@/lib/mock-data';
import type { KioskStatus } from '@/types/schema';

function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function KioskStatusBadge({ status }: { status: KioskStatus }) {
    const config: Record<KioskStatus, { icon: typeof Wifi; color: string; bg: string; label: string }> = {
        online: {
            icon: Wifi,
            color: 'text-emerald-600',
            bg: 'bg-emerald-100 border-emerald-200',
            label: 'Online',
        },
        offline: {
            icon: WifiOff,
            color: 'text-rose-600',
            bg: 'bg-rose-100 border-rose-200',
            label: 'Offline',
        },
        warning: {
            icon: AlertTriangle,
            color: 'text-amber-600',
            bg: 'bg-amber-100 border-amber-200',
            label: 'Warning',
        },
    };

    const { icon: Icon, color, bg, label } = config[status];

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${bg} ${color}`}>
            <Icon className="w-3 h-3" />
            {label}
        </span>
    );
}

export default function FleetPage() {
    const onlineCount = MOCK_KIOSKS.filter((k) => k.status === 'online').length;
    const offlineCount = MOCK_KIOSKS.filter((k) => k.status === 'offline').length;

    return (
        <div className="p-6">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900">Kiosk Fleet</h1>
                    <p className="text-sm text-slate-500">Monitor hardware status and health</p>
                </div>
                <div className="flex items-center gap-4">
                    {/* Status Summary */}
                    <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-lg border border-slate-200">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-sm font-medium text-slate-700">{onlineCount} Online</span>
                        </div>
                        <div className="w-px h-4 bg-slate-200" />
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-rose-500" />
                            <span className="text-sm font-medium text-slate-700">{offlineCount} Offline</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Kiosk Grid */}
            <div className="grid grid-cols-3 gap-4">
                {MOCK_KIOSKS.map((kiosk) => (
                    <div
                        key={kiosk.id}
                        className={`bg-white rounded-lg border p-4 transition-all hover:shadow-md ${kiosk.status === 'offline'
                                ? 'border-rose-200 bg-rose-50/30'
                                : 'border-slate-200'
                            }`}
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${kiosk.status === 'online' ? 'bg-emerald-100' : 'bg-slate-100'
                                    }`}>
                                    <Cpu className={`w-4 h-4 ${kiosk.status === 'online' ? 'text-emerald-600' : 'text-slate-500'
                                        }`} />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-slate-900">{kiosk.serialNumber}</div>
                                    <div className="text-xs text-slate-500">{kiosk.model}</div>
                                </div>
                            </div>
                            <KioskStatusBadge status={kiosk.status} />
                        </div>

                        {/* Details */}
                        <div className="space-y-2 pt-3 border-t border-slate-100">
                            <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-1.5 text-slate-500">
                                    <Building2 className="w-3.5 h-3.5" />
                                    Assigned To
                                </span>
                                <span className="font-medium text-slate-700 truncate max-w-[140px]">
                                    {kiosk.assignedHotelName || 'Unassigned'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Firmware</span>
                                <span className="font-mono text-xs px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">
                                    {kiosk.firmwareVersion}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-1.5 text-slate-500">
                                    <Clock className="w-3.5 h-3.5" />
                                    Last Heartbeat
                                </span>
                                <span className={`font-medium ${kiosk.status === 'offline' ? 'text-rose-600' : 'text-slate-600'
                                    }`}>
                                    {formatTimeAgo(kiosk.lastHeartbeat)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="mt-6 text-sm text-slate-500">
                Total Fleet: <span className="font-medium text-slate-700">{MOCK_KIOSKS.length}</span> kiosks
            </div>
        </div>
    );
}
