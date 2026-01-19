'use client';

import { useState } from 'react';
import { HotelLayout } from '@/components/layout/HotelLayout';
import {
    Monitor,
    UserCheck,
    BedDouble,
    AlertTriangle,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    RefreshCw,
    ChevronRight,
    X,
    Activity,
    Wifi,
    WifiOff,
} from 'lucide-react';
import {
    MOCK_HOTEL_KIOSKS,
    MOCK_GUEST_CHECKINS,
    HotelKiosk,
    getKioskStatusColor,
    getVerificationColor,
} from '@/lib/hotel-data';
import { useToast } from '@/components/ui/Toast';

// Stat Card Component with hover effect and click action
function StatCard({
    title,
    value,
    icon: Icon,
    color,
    subtitle,
    trend,
    onClick,
}: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    subtitle?: string;
    trend?: { value: number; positive: boolean };
    onClick?: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className="w-full text-left bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 group"
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
                    {subtitle && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
                    )}
                    {trend && (
                        <p className={`text-xs mt-1 ${trend.positive ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}% vs yesterday
                        </p>
                    )}
                </div>
                <div className={`p-2.5 rounded-lg ${color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
            </div>
        </button>
    );
}

// Kiosk Status Card with click to open modal
function KioskStatusCard({
    kiosk,
    onClick,
}: {
    kiosk: HotelKiosk;
    onClick: () => void;
}) {
    const statusConfig = {
        online: { label: 'Online', icon: CheckCircle2, color: 'text-emerald-500' },
        offline: { label: 'Offline', icon: XCircle, color: 'text-rose-500' },
        maintenance: { label: 'Maintenance', icon: AlertCircle, color: 'text-amber-500' },
    };

    const { label, icon: StatusIcon, color } = statusConfig[kiosk.status];

    return (
        <button
            onClick={onClick}
            className="w-full text-left bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 group"
        >
            <div className="flex items-start gap-4">
                <div className="relative">
                    <div className={`w-3 h-3 rounded-full ${getKioskStatusColor(kiosk.status)}`} />
                    {kiosk.status === 'online' && (
                        <div className={`absolute inset-0 w-3 h-3 rounded-full ${getKioskStatusColor(kiosk.status)} animate-ping opacity-75`} />
                    )}
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{kiosk.name}</h3>
                        <div className={`flex items-center gap-1 ${color}`}>
                            <StatusIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">{label}</span>
                        </div>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{kiosk.location}</p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                            <Clock className="w-3.5 h-3.5" />
                            {kiosk.lastHeartbeat}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm">
                                <span className="font-semibold text-slate-900 dark:text-white">{kiosk.todayCheckIns}</span>
                                <span className="text-slate-500 dark:text-slate-400 ml-1">check-ins</span>
                            </span>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>
            </div>
        </button>
    );
}

// Kiosk Detail Modal
function KioskDetailModal({
    kiosk,
    onClose
}: {
    kiosk: HotelKiosk | null;
    onClose: () => void;
}) {
    if (!kiosk) return null;

    const statusConfig = {
        online: { label: 'Online', icon: Wifi, bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400' },
        offline: { label: 'Offline', icon: WifiOff, bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-700 dark:text-rose-400' },
        maintenance: { label: 'Maintenance', icon: AlertCircle, bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' },
    };

    const { label, icon: StatusIcon, bg, text } = statusConfig[kiosk.status];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${bg}`}>
                            <Monitor className={`w-5 h-5 ${text}`} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{kiosk.name}</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{kiosk.location}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                    {/* Status Banner */}
                    <div className={`flex items-center gap-3 p-4 rounded-xl ${bg}`}>
                        <StatusIcon className={`w-6 h-6 ${text}`} />
                        <div>
                            <p className={`font-semibold ${text}`}>{label}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Last seen: {kiosk.lastHeartbeat}</p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
                            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Today's Check-ins</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{kiosk.todayCheckIns}</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
                            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Firmware</p>
                            <p className="text-lg font-semibold text-slate-900 dark:text-white mt-1">{kiosk.firmware}</p>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                            <span className="text-sm text-slate-500 dark:text-slate-400">Serial Number</span>
                            <span className="text-sm font-mono text-slate-900 dark:text-white">{kiosk.id.toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                            <span className="text-sm text-slate-500 dark:text-slate-400">Location</span>
                            <span className="text-sm text-slate-900 dark:text-white">{kiosk.location}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-slate-200 dark:border-slate-700 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                        Close
                    </button>
                    <button className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
                        View Full Details
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function HotelDashboard() {
    const { addToast } = useToast();
    const [selectedKiosk, setSelectedKiosk] = useState<HotelKiosk | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Calculate stats
    const totalCheckIns = MOCK_GUEST_CHECKINS.length;
    const failedCheckIns = MOCK_GUEST_CHECKINS.filter(c => c.verification === 'failed').length;
    const onlineKiosks = MOCK_HOTEL_KIOSKS.filter(k => k.status === 'online').length;

    // Get recent activity (last 5)
    const recentActivity = MOCK_GUEST_CHECKINS.slice(0, 5);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsRefreshing(false);
        addToast('success', 'Refreshed', 'Dashboard data updated');
    };

    return (
        <HotelLayout>
            <div className="p-4 sm:p-6 max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Lobby Dashboard</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Real-time kiosk status and check-in activity
                        </p>
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-all"
                    >
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        {isRefreshing ? 'Refreshing...' : 'Refresh'}
                    </button>
                </div>

                {/* Kiosk Alert Banner (if any offline) */}
                {MOCK_HOTEL_KIOSKS.some(k => k.status === 'offline') && (
                    <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-3 animate-in slide-in-from-top duration-300">
                        <div className="p-2 bg-rose-100 dark:bg-rose-900/50 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-rose-800 dark:text-rose-300">
                                Kiosk Offline Alert
                            </p>
                            <p className="text-sm text-rose-600 dark:text-rose-400">
                                One or more kiosks need attention. Tap to view details.
                            </p>
                        </div>
                        <button className="px-3 py-1.5 text-sm font-medium text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/50 rounded-lg hover:bg-rose-200 dark:hover:bg-rose-900 transition-colors">
                            View
                        </button>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <StatCard
                        title="Today's Check-ins"
                        value={totalCheckIns}
                        icon={UserCheck}
                        color="bg-emerald-500"
                        trend={{ value: 12, positive: true }}
                        onClick={() => addToast('info', 'Check-ins', 'Navigating to guest log...')}
                    />
                    <StatCard
                        title="Rooms Assigned"
                        value={totalCheckIns}
                        icon={BedDouble}
                        color="bg-blue-500"
                        onClick={() => addToast('info', 'Rooms', 'Navigating to room status...')}
                    />
                    <StatCard
                        title="Kiosks Online"
                        value={`${onlineKiosks}/${MOCK_HOTEL_KIOSKS.length}`}
                        icon={Monitor}
                        color="bg-indigo-500"
                        subtitle="All systems operational"
                    />
                    <StatCard
                        title="Failed Verifications"
                        value={failedCheckIns}
                        icon={AlertTriangle}
                        color={failedCheckIns > 0 ? 'bg-rose-500' : 'bg-slate-400'}
                        subtitle={failedCheckIns > 0 ? 'Click to review' : 'All verified'}
                        onClick={failedCheckIns > 0 ? () => addToast('warning', 'Attention', 'Reviewing failed verifications...') : undefined}
                    />
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Kiosk Status */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                Kiosk Health
                            </h2>
                            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                <Activity className="w-3.5 h-3.5" />
                                Live
                            </span>
                        </div>
                        <div className="space-y-3">
                            {MOCK_HOTEL_KIOSKS.map((kiosk) => (
                                <KioskStatusCard
                                    key={kiosk.id}
                                    kiosk={kiosk}
                                    onClick={() => setSelectedKiosk(kiosk)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                Recent Activity
                            </h2>
                            <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                                View all
                            </button>
                        </div>
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700 overflow-hidden">
                            {recentActivity.map((activity, index) => (
                                <div
                                    key={activity.id}
                                    className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center">
                                        <BedDouble className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                                Room {activity.roomNumber} — {activity.guestName}
                                            </p>
                                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getVerificationColor(activity.verification)}`}>
                                                {activity.verification}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                                {activity.checkInTime}
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                                {activity.language}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Kiosk Detail Modal */}
            <KioskDetailModal
                kiosk={selectedKiosk}
                onClose={() => setSelectedKiosk(null)}
            />
        </HotelLayout>
    );
}
