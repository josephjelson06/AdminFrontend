'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    Users,
    BedDouble,
    Monitor,
    TrendingUp,
    Clock,
    CheckCircle2,
    AlertCircle,
    RotateCw,
    Calendar,
    ChevronDown,
} from 'lucide-react';
import { HotelLayout } from '@/components/hotel/layout/HotelLayout';
import { useAuth } from '@/lib/shared/auth';
import {
    MOCK_HOTEL_KIOSKS,
    MOCK_GUEST_CHECKINS,
    MOCK_ROOMS,
    GuestCheckIn,
    HotelKiosk,
} from '@/lib/hotel/hotel-data';
import { TinySparkline } from '@/components/shared/ui/TinySparkline';
import { useToast } from '@/components/shared/ui/Toast';

// ==========================================
// SUB-COMPONENTS
// ==========================================

// Stats Card with Sparkline & Click Action
function StatCard({
    title,
    value,
    icon: Icon,
    trend,
    color,
    sparklineData,
    onClick,
    isAlert,
}: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    trend?: string;
    color: string;
    sparklineData?: number[];
    onClick?: () => void;
    isAlert?: boolean;
}) {
    return (
        <div
            onClick={onClick}
            className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 transition-all ${onClick ? 'cursor-pointer hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-900' : ''
                }`}
        >
            <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${color}`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
                {trend && (
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                        {trend}
                    </span>
                )}
            </div>
            <div className="flex items-end justify-between">
                <div>
                    <p className={`text-2xl font-bold ${isAlert ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                        {value}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
                </div>
                {sparklineData && (
                    <TinySparkline data={sparklineData} color={isAlert ? 'stroke-rose-500' : 'stroke-emerald-500'} />
                )}
            </div>
        </div>
    );
}

// Recent Check-in Row with Expandable Details
function RecentCheckInItem({ guest }: { guest: GuestCheckIn }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="border-b border-slate-100 dark:border-slate-700 last:border-0">
            <div
                className="flex items-center justify-between py-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 px-2 rounded-lg transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                        <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                            {guest.guestName.split(' ').map(n => n[0]).join('')}
                        </span>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{guest.guestName}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Room {guest.roomNumber}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">{guest.checkInTime}</p>
                    {guest.verification === 'verified' && (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" />
                            Verified
                        </span>
                    )}
                    {guest.verification === 'manual' && (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                            <AlertCircle className="w-3 h-3" />
                            Manual
                        </span>
                    )}
                    {guest.verification === 'failed' && (
                        <span className="inline-flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400">
                            <AlertCircle className="w-3 h-3" />
                            Failed
                        </span>
                    )}
                </div>
            </div>
            {isExpanded && (
                <div className="px-14 pb-3 pt-0 text-xs text-slate-500 dark:text-slate-400 grid grid-cols-2 gap-2 animate-in slide-in-from-top-1 fade-in duration-200">
                    <div>
                        <span className="block text-slate-400 dark:text-slate-500">Booking ID</span>
                        <span className="font-mono text-slate-700 dark:text-slate-300">{guest.bookingId}</span>
                    </div>
                    <div>
                        <span className="block text-slate-400 dark:text-slate-500">Kiosk</span>
                        <span>{guest.kioskId}</span>
                    </div>
                    <div>
                        <span className="block text-slate-400 dark:text-slate-500">Language</span>
                        <span>{guest.language}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

// Kiosk Status Card with Reboot Action
function KioskStatusCard({ kiosk }: { kiosk: HotelKiosk }) {
    const { addToast } = useToast();

    // Check if heartbeat is older than 10 mins (simple string check for 'mins ago')
    const parseMinutesAgo = (str: string) => {
        const match = str.match(/(\d+)\s+mins?\s+ago/);
        return match ? parseInt(match[1], 10) : 0;
    };

    const minutesAgo = parseMinutesAgo(kiosk.lastHeartbeat);
    const isStale = minutesAgo > 10;

    // Determine status color
    let statusColor = 'bg-emerald-500';
    if (kiosk.status === 'offline') statusColor = 'bg-rose-500';
    else if (kiosk.status === 'maintenance' || isStale) statusColor = 'bg-amber-500';

    const handleReboot = () => {
        addToast('success', 'Reboot Signal Sent', `Reboot command sent to ${kiosk.name}.`);
    };

    return (
        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg group">
            <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${statusColor}`} />
                <div>
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{kiosk.name}</p>
                        {isStale && kiosk.status === 'online' && (
                            <span className="text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded">
                                Stale
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{kiosk.location} • {kiosk.lastHeartbeat}</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{kiosk.todayCheckIns}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">check-ins</p>
                </div>
                <button
                    onClick={handleReboot}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                    title="Reboot Kiosk"
                >
                    <RotateCw className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

// ==========================================
// MAIN DASHBOARD COMPONENT
// ==========================================

export default function HotelDashboard() {
    const router = useRouter();
    const { user } = useAuth();

    // State handling
    const [dateRange, setDateRange] = useState<'Today' | 'Last 7 Days' | 'Custom'>('Today');
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [activityFilter, setActivityFilter] = useState<'All' | 'Failed' | 'Success'>('All');

    // Redirect maintenance staff
    useEffect(() => {
        if (user?.role === 'maintenance_staff') {
            router.push('/hotel/incidents');
        }
    }, [user, router]);

    // Handle refresh
    const handleRefresh = () => {
        setLastUpdated(new Date());
    };

    if (user?.role === 'maintenance_staff') {
        return (
            <HotelLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
                </div>
            </HotelLayout>
        );
    }

    // Calculations & Filtering
    const todayCheckIns = MOCK_GUEST_CHECKINS.length;
    const onlineKiosks = MOCK_HOTEL_KIOSKS.filter(k => k.status === 'online').length;
    const totalKiosks = MOCK_HOTEL_KIOSKS.length;
    const readyRooms = MOCK_ROOMS.filter(r => r.status === 'ready').length;
    const totalRooms = MOCK_ROOMS.length;
    const occupiedRooms = MOCK_ROOMS.filter(r => r.status === 'occupied').length;
    const failedVerifications = MOCK_GUEST_CHECKINS.filter(g => g.verification === 'failed').length;

    // Filter Activity Feed
    const filteredActivity = MOCK_GUEST_CHECKINS.filter(item => {
        if (activityFilter === 'All') return true;
        if (activityFilter === 'Failed') return item.verification === 'failed';
        if (activityFilter === 'Success') return item.verification === 'verified';
        return true;
    });

    // Grouping by Kiosk (simple grouping logic)
    // For visual simplicity, we'll just sort by kioskId if not "All", or keep time order.
    // The requirement says "Visually group items by kioskId". 
    // Let's sort by kioskId then timestamp for the list.
    const displayActivity = [...filteredActivity].sort((a, b) => {
        if (a.kioskId === b.kioskId) return 0;
        return a.kioskId > b.kioskId ? 1 : -1;
    });

    return (
        <HotelLayout>
            <div className="max-w-6xl mx-auto">
                {/* Page Header with Time Filter & Refresh */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Welcome back, {user?.name}!
                            </p>
                            <span className="text-xs text-slate-400">•</span>
                            <span className="text-xs text-slate-400">
                                Last updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <button onClick={handleRefresh} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors" title="Refresh Data">
                                <RotateCw className="w-3.5 h-3.5 text-slate-400" />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <select
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value as any)}
                                className="appearance-none pl-9 pr-8 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option>Today</option>
                                <option>Last 7 Days</option>
                                <option>Custom</option>
                            </select>
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <StatCard
                        title="Today's Check-ins"
                        value={todayCheckIns}
                        icon={Users}
                        trend="+12%"
                        color="bg-indigo-600"
                        sparklineData={[12, 18, 14, 25, 20, 32, 24]} // Mock data
                    />
                    <StatCard
                        title="Failed Verifications"
                        value={failedVerifications}
                        icon={AlertCircle}
                        color="bg-rose-600"
                        isAlert={failedVerifications > 0}
                        sparklineData={[0, 1, 0, 2, 1, 0, failedVerifications]}
                        onClick={() => router.push('/hotel/guests?status=failed')}
                    />
                    <StatCard
                        title="Kiosks Online"
                        value={`${onlineKiosks}/${totalKiosks}`}
                        icon={Monitor}
                        color="bg-emerald-600"
                        sparklineData={[50, 60, 55, 70, 65, 80, 75]} // Mock health score
                    />
                    <StatCard
                        title="Rooms Ready"
                        value={`${readyRooms}/${totalRooms}`}
                        icon={BedDouble}
                        color="bg-blue-600"
                        sparklineData={[40, 45, 42, 48, 46, 50, 48]}
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Activity Feed */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex flex-col h-[500px]">
                        <div className="flex items-center justify-between mb-4 flex-shrink-0">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Activity</h2>
                            <div className="flex bg-slate-100 dark:bg-slate-700/50 rounded-lg p-1">
                                {['All', 'Failed', 'Success'].map(filter => (
                                    <button
                                        key={filter}
                                        onClick={() => setActivityFilter(filter as any)}
                                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activityFilter === filter
                                            ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                                            }`}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="overflow-y-auto flex-1 pr-2 -mr-2">
                            {displayActivity.length > 0 ? (
                                <div className="space-y-1">
                                    {displayActivity.map((guest, index) => {
                                        // Visual grouping header if kioskId changes (and sorting matches)
                                        const prevGuest = displayActivity[index - 1];
                                        const showGroupHeader = !prevGuest || prevGuest.kioskId !== guest.kioskId;

                                        return (
                                            <div key={guest.id}>
                                                {showGroupHeader && (
                                                    <div className="sticky top-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur py-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider z-10">
                                                        {MOCK_HOTEL_KIOSKS.find(k => k.id === guest.kioskId)?.name || guest.kioskId}
                                                    </div>
                                                )}
                                                <RecentCheckInItem guest={guest} />
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                    <Clock className="w-10 h-10 mb-2 opacity-50" />
                                    <p className="text-sm">No activity found</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Kiosk Health */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 h-fit">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Kiosk Health</h2>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                {onlineKiosks} Online
                            </span>
                        </div>
                        <div className="space-y-3">
                            {MOCK_HOTEL_KIOSKS.map(kiosk => (
                                <KioskStatusCard key={kiosk.id} kiosk={kiosk} />
                            ))}
                        </div>

                        {/* Additional Info / Footer */}
                        <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
                            <div className="flex items-start gap-3">
                                <Monitor className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-semibold text-indigo-900 dark:text-indigo-300">System Status</h4>
                                    <p className="text-xs text-indigo-700 dark:text-indigo-400 mt-1">
                                        All systems functionality normal. Next scheduled maintenance window is in 3 days.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </HotelLayout>
    );
}


