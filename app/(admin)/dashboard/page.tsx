'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Building2,
    Cpu,
    AlertTriangle,
    TrendingUp,
    Clock,
    CreditCard,
    FileText,
    ChevronRight,
    Wifi,
    WifiOff,
    RefreshCw,
    BarChart3,
    Zap,
    Calendar,
    Users,
    Settings,
    ScrollText,
    IndianRupee,
} from 'lucide-react';
import { MOCK_HOTELS, MOCK_METRICS, MOCK_KIOSKS } from '@/lib/admin/mock-data';
import { BarChartComponent, DonutChartComponent, AreaChartComponent } from '@/components/shared/ui/Charts';
import { useAuth } from '@/lib/shared/auth';
import { GlassCard } from '@/components/shared/ui/GlassCard';
import { DashboardFilter } from "@/components/admin/dashboard/DashboardFilter";
import { HoverActionButton } from "@/components/ui/hover-action-button";

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

// System health trend (online kiosks %)
const HEALTH_TREND = [
    { name: 'Mon', value: 92 },
    { name: 'Tue', value: 95 },
    { name: 'Wed', value: 88 },
    { name: 'Thu', value: 94 },
    { name: 'Fri', value: 96 },
    { name: 'Sat', value: 98 },
    { name: 'Sun', value: 95 },
];

// Kiosk status distribution
const KIOSK_STATUS = [
    { name: 'Online', value: MOCK_KIOSKS.filter(k => k.status === 'online').length },
    { name: 'Offline', value: MOCK_KIOSKS.filter(k => k.status === 'offline').length },
    { name: 'Warning', value: MOCK_KIOSKS.filter(k => k.status === 'warning').length },
];

// Mock alerts (simplified - no per-widget filters)
const MOCK_ALERTS = [
    {
        id: 'a-001',
        type: 'offline',
        title: 'Kiosk Offline > 24hrs',
        message: 'ATC-SN-7766 at Lemon Tree Premier',
        severity: 'critical',
        time: '2 hours ago',
        href: '/fleet',
    },
    {
        id: 'a-002',
        type: 'payment',
        title: 'Payment Overdue',
        message: 'Lemon Tree Premier - ₹25,000',
        severity: 'warning',
        time: '9 days overdue',
        href: '/invoices',
    },
    {
        id: 'a-003',
        type: 'contract',
        title: 'Contract Expiring',
        message: 'Ginger Hotel - expires in 15 days',
        severity: 'info',
        time: 'Action needed',
        href: '/hotels',
    },
];

// Quick Access Modules
const QUICK_ACCESS = [
    { name: 'Hotels', description: 'Manage hotel registry', href: '/hotels', icon: Building2, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
    { name: 'Kiosk Fleet', description: 'Monitor device health', href: '/fleet', icon: Cpu, color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' },
    { name: 'Subscriptions', description: 'View entitlements', href: '/subscriptions', icon: IndianRupee, color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' },
    { name: 'Reports', description: 'Analytics & insights', href: '/reports', icon: BarChart3, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
    { name: 'Team & Users', description: 'Manage access', href: '/users', icon: Users, color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' },
    { name: 'Settings', description: 'System configuration', href: '/settings', icon: Settings, color: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400' },
];

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
    const { user } = useAuth();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [timePeriod, setTimePeriod] = useState<'7D' | '30D' | '90D'>('7D');

    const onlineKiosks = MOCK_KIOSKS.filter((k) => k.status === 'online').length;
    const offlineKiosks = MOCK_KIOSKS.filter((k) => k.status === 'offline').length;
    const todayCheckins = CHECKIN_TREND[CHECKIN_TREND.length - 1].checkins;
    const aiAdoptionRate = 74; // Mock AI adoption rate

    // Get greeting based on time
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    // Format current date
    const formatDate = () => {
        return new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
        });
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    const KPICard = ({
        title,
        value,
        subtitle,
        icon: Icon,
        iconBg,
        iconColor,
        href,
        trend
    }: {
        title: string;
        value: string | number;
        subtitle: React.ReactNode;
        icon: React.ElementType;
        iconBg: string;
        iconColor: string;
        href: string;
        trend?: { value: string; positive: boolean };
    }) => (
        <Link href={href} className="block group">
            <GlassCard className="p-4 h-full hover:border-emerald-500/50 transition-colors">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{title}</p>
                        <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
                    </div>
                    <div className={`p-2 rounded-lg ${iconBg} group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-5 h-5 ${iconColor}`} />
                    </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                        {subtitle}
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                {trend && (
                    <div className={`mt-1 text-xs flex items-center gap-1 ${trend.positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        <TrendingUp className={`w-3 h-3 ${!trend.positive && 'rotate-180'}`} />
                        {trend.value}
                    </div>
                )}
            </GlassCard>
        </Link>
    );

    return (
        <div className="p-4 sm:p-6">
            {/* Page Header with Global Time Control */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
                        {getGreeting()}, {user?.name?.split(' ')[0] || 'Admin'}
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {formatDate()} • {MOCK_ALERTS.filter(a => a.severity === 'critical').length} items need attention
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Global Time Selector */}
                    <DashboardFilter />
                    <div className="flex items-center gap-3">
                        <DashboardFilter />
                        <HoverActionButton text="Action" onClick={() => console.log('Action clicked')} />
                    </div>
                </div>
            </div>

            {/* KPI Cards - 4 cards only (no financial totals) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <KPICard
                    title="Total Hotels"
                    value={MOCK_METRICS.totalHotels}
                    subtitle={<span>{MOCK_HOTELS.filter(h => h.status === 'active').length} active</span>}
                    icon={Building2}
                    iconBg="bg-blue-100 dark:bg-blue-900/30"
                    iconColor="text-blue-600 dark:text-blue-400"
                    href="/hotels"
                />
                <KPICard
                    title="Active Kiosks"
                    value={MOCK_METRICS.activeKiosks}
                    subtitle={
                        <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                                <Wifi className="w-3 h-3" /> {onlineKiosks}
                            </span>
                            {offlineKiosks > 0 && (
                                <span className="flex items-center gap-1 text-rose-500 dark:text-rose-400">
                                    <WifiOff className="w-3 h-3" /> {offlineKiosks}
                                </span>
                            )}
                        </div>
                    }
                    icon={Cpu}
                    iconBg="bg-emerald-100 dark:bg-emerald-900/30"
                    iconColor="text-emerald-600 dark:text-emerald-400"
                    href="/fleet"
                />
                <KPICard
                    title="AI Adoption"
                    value={`${aiAdoptionRate}%`}
                    subtitle={<span className="text-emerald-600 dark:text-emerald-400">Guests using AI kiosk</span>}
                    icon={Zap}
                    iconBg="bg-amber-100 dark:bg-amber-900/30"
                    iconColor="text-amber-600 dark:text-amber-400"
                    href="/reports"
                    trend={{ value: '+5% vs last period', positive: true }}
                />
                <KPICard
                    title="Check-ins Today"
                    value={todayCheckins}
                    subtitle={<span className="text-purple-600 dark:text-purple-400">+8% vs yesterday</span>}
                    icon={BarChart3}
                    iconBg="bg-purple-100 dark:bg-purple-900/30"
                    iconColor="text-purple-600 dark:text-purple-400"
                    href="/reports"
                    trend={{ value: '+8% vs yesterday', positive: true }}
                />
            </div>

            {/* Charts Row - Clickable, escalation-only */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
                {/* Check-in Trend - Links to Reports */}
                {/* Check-in Trend - Links to Reports */}
                <Link href="/reports/usage" className="block group">
                    <GlassCard className="p-4 hover:border-emerald-500/50 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Check-in Trend</h3>
                            <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                View Details <ChevronRight className="w-3 h-3" />
                            </span>
                        </div>
                        <BarChartComponent
                            data={CHECKIN_TREND}
                            dataKey="checkins"
                            color="#10b981"
                            height={160}
                        />
                    </GlassCard>
                </Link>

                {/* System Health Trend - Links to Fleet */}
                {/* System Health Trend - Links to Fleet */}
                <Link href="/fleet" className="block group">
                    <GlassCard className="p-4 hover:border-emerald-500/50 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">System Health</h3>
                            <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                View Fleet <ChevronRight className="w-3 h-3" />
                            </span>
                        </div>
                        <AreaChartComponent
                            data={HEALTH_TREND}
                            dataKey="value"
                            color="#6366f1"
                            height={160}
                            gradientId="healthGradient"
                        />
                    </GlassCard>
                </Link>

                {/* Kiosk Status - Links to Fleet */}
                {/* Kiosk Status - Links to Fleet */}
                <Link href="/fleet" className="block group">
                    <GlassCard className="p-4 hover:border-emerald-500/50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Kiosk Status</h3>
                            <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                Manage <ChevronRight className="w-3 h-3" />
                            </span>
                        </div>
                        <DonutChartComponent data={KIOSK_STATUS} height={160} />
                        <div className="flex justify-center gap-4 mt-2">
                            <div className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="text-xs text-slate-600 dark:text-slate-400">Online</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                                <span className="text-xs text-slate-600 dark:text-slate-400">Offline</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-amber-500" />
                                <span className="text-xs text-slate-600 dark:text-slate-400">Warning</span>
                            </div>
                        </div>
                    </GlassCard>
                </Link>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Alert Feed - Simplified, no filters */}
                {/* Alert Feed - Simplified, no filters */}
                <GlassCard>
                    <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-500" />
                                Attention Required
                            </h3>
                            <span className="px-1.5 py-0.5 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 text-xs font-medium rounded">
                                {MOCK_ALERTS.length}
                            </span>
                        </div>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-700 max-h-64 overflow-y-auto">
                        {MOCK_ALERTS.length === 0 ? (
                            <div className="px-4 py-8 text-center">
                                <p className="text-sm text-emerald-600 dark:text-emerald-400">✓ All systems operational</p>
                            </div>
                        ) : (
                            MOCK_ALERTS.map((alert) => (
                                <Link
                                    key={alert.id}
                                    href={alert.href}
                                    className="block px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5">
                                            <AlertIcon type={alert.type} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <SeverityDot severity={alert.severity} />
                                                <span className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{alert.title}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{alert.message}</p>
                                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {alert.time}
                                            </p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                    <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-700">
                        <Link
                            href="/audit"
                            className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1"
                        >
                            View audit logs <ChevronRight className="w-3 h-3" />
                        </Link>
                    </div>
                </GlassCard>

                {/* Quick Access - Replaces Hotels Table */}
                {/* Quick Access - Replaces Hotels Table */}
                <GlassCard className="lg:col-span-2">
                    <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Quick Access</h3>
                    </div>
                    <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {QUICK_ACCESS.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all group"
                            >
                                <div className={`p-2 rounded-lg ${item.color}`}>
                                    <item.icon className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{item.name}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{item.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
