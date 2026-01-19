'use client';

import Link from 'next/link';
import {
    Building2,
    Cpu,
    IndianRupee,
    AlertTriangle,
    TrendingUp,
    MapPin,
    Clock,
    CreditCard,
    FileText,
    ChevronRight,
    Wifi,
    WifiOff
} from 'lucide-react';
import { MOCK_HOTELS, MOCK_METRICS, MOCK_KIOSKS } from '@/lib/mock-data';
import type { Status, HotelPlan } from '@/types/schema';
import { AreaChartComponent, BarChartComponent, DonutChartComponent } from '@/components/ui/Charts';

// Mock 7-day check-in data
const CHECKIN_TREND = [
    { name: 'Mon', checkins: 145 },
    { name: 'Tue', checkins: 178 },
    { name: 'Wed', checkins: 156 },
    { name: 'Thu', checkins: 189 },
    { name: 'Fri', checkins: 234 },
    { name: 'Sat', checkins: 267 },
    { name: 'Sun', checkins: 198 },
];

// Mock revenue trend
const REVENUE_TREND = [
    { name: 'Aug', value: 420000 },
    { name: 'Sep', value: 480000 },
    { name: 'Oct', value: 520000 },
    { name: 'Nov', value: 590000 },
    { name: 'Dec', value: 680000 },
    { name: 'Jan', value: 750000 },
];

// Kiosk status distribution
const KIOSK_STATUS = [
    { name: 'Online', value: MOCK_KIOSKS.filter(k => k.status === 'online').length },
    { name: 'Offline', value: MOCK_KIOSKS.filter(k => k.status === 'offline').length },
    { name: 'Warning', value: MOCK_KIOSKS.filter(k => k.status === 'warning').length },
];

// Mock alerts
const MOCK_ALERTS = [
    {
        id: 'a-001',
        type: 'offline',
        title: 'Kiosk Offline > 24hrs',
        message: 'ATC-SN-7766 at Lemon Tree Premier',
        severity: 'critical',
        time: '2 hours ago',
    },
    {
        id: 'a-002',
        type: 'payment',
        title: 'Payment Overdue',
        message: 'Lemon Tree Premier - ₹25,000',
        severity: 'warning',
        time: '9 days overdue',
    },
    {
        id: 'a-003',
        type: 'contract',
        title: 'Contract Expiring',
        message: 'Ginger Hotel - expires in 15 days',
        severity: 'info',
        time: 'Action needed',
    },
];

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
}

function StatusBadge({ status }: { status: Status }) {
    const styles: Record<Status, string> = {
        active: 'bg-emerald-100 text-emerald-700',
        inactive: 'bg-slate-100 text-slate-600',
        suspended: 'bg-rose-100 text-rose-700',
        pending: 'bg-amber-100 text-amber-700',
        onboarding: 'bg-blue-100 text-blue-700',
    };

    return (
        <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${styles[status]}`}>
            {status}
        </span>
    );
}

function PlanBadge({ plan }: { plan: HotelPlan }) {
    return (
        <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${plan === 'advanced'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
                : 'bg-slate-700 text-white'
            }`}>
            {plan}
        </span>
    );
}

function AlertIcon({ type }: { type: string }) {
    switch (type) {
        case 'offline':
            return <WifiOff className="w-4 h-4 text-rose-500" />;
        case 'payment':
            return <CreditCard className="w-4 h-4 text-amber-500" />;
        case 'contract':
            return <FileText className="w-4 h-4 text-blue-500" />;
        default:
            return <AlertTriangle className="w-4 h-4 text-slate-400" />;
    }
}

function SeverityDot({ severity }: { severity: string }) {
    const colors: Record<string, string> = {
        critical: 'bg-rose-500',
        warning: 'bg-amber-500',
        info: 'bg-blue-500',
    };
    return <span className={`w-2 h-2 rounded-full ${colors[severity] || 'bg-slate-400'}`} />;
}

export default function Dashboard() {
    const totalMRR = MOCK_HOTELS.reduce((sum, h) => sum + h.mrr, 0);
    const onlineKiosks = MOCK_KIOSKS.filter((k) => k.status === 'online').length;
    const offlineKiosks = MOCK_KIOSKS.filter((k) => k.status === 'offline').length;
    const todayCheckins = CHECKIN_TREND[CHECKIN_TREND.length - 1].checkins;

    return (
        <div className="p-6">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
                <p className="text-sm text-slate-500">System overview and alerts</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Hotels</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{MOCK_METRICS.totalHotels}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-blue-100">
                            <Building2 className="w-5 h-5 text-blue-600" />
                        </div>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">
                        {MOCK_HOTELS.filter(h => h.status === 'active').length} active
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Active Kiosks</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{MOCK_METRICS.activeKiosks}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-emerald-100">
                            <Cpu className="w-5 h-5 text-emerald-600" />
                        </div>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs">
                        <span className="flex items-center gap-1 text-emerald-600">
                            <Wifi className="w-3 h-3" /> {onlineKiosks} online
                        </span>
                        {offlineKiosks > 0 && (
                            <span className="flex items-center gap-1 text-rose-500">
                                <WifiOff className="w-3 h-3" /> {offlineKiosks} offline
                            </span>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Revenue MTD</p>
                            <p className="text-2xl font-bold text-emerald-600 mt-1">{formatCurrency(totalMRR)}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-emerald-100">
                            <IndianRupee className="w-5 h-5 text-emerald-600" />
                        </div>
                    </div>
                    <div className="mt-2 text-xs text-emerald-600 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> +12% vs last month
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Check-ins Today</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{todayCheckins}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-purple-100">
                            <TrendingUp className="w-5 h-5 text-purple-600" />
                        </div>
                    </div>
                    <div className="mt-2 text-xs text-purple-600 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> +8% vs yesterday
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-3 gap-6 mb-6">
                {/* 7-Day Check-in Trend */}
                <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-900 mb-4">7-Day Check-in Trend</h3>
                    <BarChartComponent
                        data={CHECKIN_TREND}
                        dataKey="checkins"
                        color="#10b981"
                        height={180}
                    />
                </div>

                {/* Revenue Trend */}
                <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-900 mb-4">Revenue Trend (6 Months)</h3>
                    <AreaChartComponent
                        data={REVENUE_TREND}
                        dataKey="value"
                        color="#6366f1"
                        height={180}
                        gradientId="revenueGradient"
                    />
                </div>

                {/* Kiosk Status Donut */}
                <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-900 mb-2">Kiosk Status</h3>
                    <DonutChartComponent data={KIOSK_STATUS} height={180} />
                    <div className="flex justify-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-xs text-slate-600">Online</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-indigo-500" />
                            <span className="text-xs text-slate-600">Offline</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            <span className="text-xs text-slate-600">Warning</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-3 gap-6">
                {/* Alert Feed */}
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
                    <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                            Critical Alerts
                        </h3>
                        <span className="px-1.5 py-0.5 bg-rose-100 text-rose-700 text-xs font-medium rounded">
                            {MOCK_ALERTS.length}
                        </span>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {MOCK_ALERTS.map((alert) => (
                            <div key={alert.id} className="px-4 py-3 hover:bg-slate-50 transition-colors">
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5">
                                        <AlertIcon type={alert.type} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <SeverityDot severity={alert.severity} />
                                            <span className="text-sm font-medium text-slate-900">{alert.title}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-0.5">{alert.message}</p>
                                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {alert.time}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="px-4 py-2 border-t border-slate-200">
                        <Link
                            href="/audit"
                            className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1"
                        >
                            View all alerts <ChevronRight className="w-3 h-3" />
                        </Link>
                    </div>
                </div>

                {/* Hotels List */}
                <div className="col-span-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                    <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-slate-900">Recent Hotels</h3>
                        <Link
                            href="/hotels"
                            className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1"
                        >
                            View all <ChevronRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="text-left px-4 py-2 text-xs font-semibold text-slate-600 uppercase">Hotel</th>
                                <th className="text-left px-4 py-2 text-xs font-semibold text-slate-600 uppercase">Status</th>
                                <th className="text-left px-4 py-2 text-xs font-semibold text-slate-600 uppercase">Plan</th>
                                <th className="text-center px-4 py-2 text-xs font-semibold text-slate-600 uppercase">Kiosks</th>
                                <th className="text-right px-4 py-2 text-xs font-semibold text-slate-600 uppercase">MRR</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {MOCK_HOTELS.slice(0, 4).map((hotel) => (
                                <tr key={hotel.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-2.5">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="w-4 h-4 text-slate-400" />
                                            <div>
                                                <div className="text-sm font-medium text-slate-900">{hotel.name}</div>
                                                <div className="text-xs text-slate-500 flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {hotel.location}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2.5">
                                        <StatusBadge status={hotel.status} />
                                    </td>
                                    <td className="px-4 py-2.5">
                                        <PlanBadge plan={hotel.plan} />
                                    </td>
                                    <td className="px-4 py-2.5 text-center">
                                        <span className="text-sm text-slate-700">{hotel.kioskCount}</span>
                                    </td>
                                    <td className="px-4 py-2.5 text-right">
                                        <span className={`text-sm font-semibold ${hotel.mrr > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                                            {hotel.mrr > 0 ? formatCurrency(hotel.mrr) : '—'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
