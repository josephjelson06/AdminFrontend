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
    { name: 'Hotels', description: 'Manage hotel registry', href: '/hotels', icon: Building2, color: 'bg-info/10 text-info' },
    { name: 'Kiosk Fleet', description: 'Monitor device health', href: '/fleet', icon: Cpu, color: 'bg-success/10 text-success' },
    { name: 'Subscriptions', description: 'View entitlements', href: '/subscriptions', icon: IndianRupee, color: 'bg-warning/10 text-warning' },
    { name: 'Reports', description: 'Analytics & insights', href: '/reports', icon: BarChart3, color: 'bg-secondary/10 text-secondary' },
    { name: 'Team & Users', description: 'Manage access', href: '/users', icon: Users, color: 'bg-primary/10 text-primary' },
    { name: 'Settings', description: 'System configuration', href: '/settings', icon: Settings, color: 'bg-surface-elevated text-muted' },
];

function AlertIcon({ type }: { type: string }) {
    switch (type) {
        case 'offline':
            return <WifiOff className="w-4 h-4 text-danger" />;
        case 'payment':
            return <CreditCard className="w-4 h-4 text-warning" />;
        case 'contract':
            return <FileText className="w-4 h-4 text-info" />;
        default:
            return <AlertTriangle className="w-4 h-4 text-muted" />;
    }
}

function SeverityDot({ severity }: { severity: string }) {
    const colors: Record<string, string> = {
        critical: 'bg-danger',
        warning: 'bg-warning',
        info: 'bg-info',
    };
    return <span className={`w-2 h-2 rounded-full ${colors[severity] || 'bg-muted'}`} />;
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
            <GlassCard className="p-4 h-full hover:border-primary/50 transition-all duration-normal ease-smooth">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-muted uppercase tracking-wide">{title}</p>
                        <p className="text-xl sm:text-2xl font-bold text-primary mt-1">{value}</p>
                    </div>
                    <div className={`p-2 rounded-lg ${iconBg} group-hover:scale-110 transition-transform duration-fast`}>
                        <Icon className={`w-5 h-5 ${iconColor}`} />
                    </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                    <div className="text-xs text-muted">
                        {subtitle}
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                {trend && (
                    <div className={`mt-1 text-xs flex items-center gap-1 ${trend.positive ? 'text-success' : 'text-danger'}`}>
                        <TrendingUp className={`w-3 h-3 ${!trend.positive && 'rotate-180'}`} />
                        {trend.value}
                    </div>
                )}
            </GlassCard>
        </Link>
    );

    return (
        <div className="p-4 sm:p-6 animate-in fade-in duration-normal">
            {/* Page Header with Global Time Control */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-primary">
                        {getGreeting()}, {user?.name?.split(' ')[0] || 'Admin'}
                    </h1>
                    <p className="text-sm text-muted">
                        {formatDate()} • {MOCK_ALERTS.filter(a => a.severity === 'critical').length} items need attention
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Global Time Selector */}
                    <DashboardFilter />
                </div>
            </div>

            {/* KPI Cards - 4 cards only (no financial totals) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <KPICard
                    title="Total Hotels"
                    value={MOCK_METRICS.totalHotels}
                    subtitle={<span>{MOCK_HOTELS.filter(h => h.status === 'active').length} active</span>}
                    icon={Building2}
                    iconBg="bg-info/10"
                    iconColor="text-info"
                    href="/hotels"
                />
                <KPICard
                    title="Active Kiosks"
                    value={MOCK_METRICS.activeKiosks}
                    subtitle={
                        <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 text-success">
                                <Wifi className="w-3 h-3" /> {onlineKiosks}
                            </span>
                            {offlineKiosks > 0 && (
                                <span className="flex items-center gap-1 text-danger">
                                    <WifiOff className="w-3 h-3" /> {offlineKiosks}
                                </span>
                            )}
                        </div>
                    }
                    icon={Cpu}
                    iconBg="bg-success/10"
                    iconColor="text-success"
                    href="/fleet"
                />
                <KPICard
                    title="AI Adoption"
                    value={`${aiAdoptionRate}%`}
                    subtitle={<span className="text-success">Guests using AI kiosk</span>}
                    icon={Zap}
                    iconBg="bg-warning/10"
                    iconColor="text-warning"
                    href="/reports"
                    trend={{ value: '+5% vs last period', positive: true }}
                />
                <KPICard
                    title="Check-ins Today"
                    value={todayCheckins}
                    subtitle={<span className="text-secondary">+8% vs yesterday</span>}
                    icon={BarChart3}
                    iconBg="bg-secondary/10"
                    iconColor="text-secondary"
                    href="/reports"
                    trend={{ value: '+8% vs yesterday', positive: true }}
                />
            </div>

            {/* Charts Row - Clickable, escalation-only */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
                {/* Check-in Trend - Links to Reports */}
                {/* Check-in Trend - Links to Reports */}
                <Link href="/reports/usage" className="block group">
                    <GlassCard className="p-4 hover:border-primary/50 transition-all duration-normal" auroraGlow>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-primary">Check-in Trend</h3>
                            <span className="text-xs text-primary flex items-center gap-1">
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
                    <GlassCard className="p-4 hover:border-primary/50 transition-all duration-normal" auroraGlow>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-primary">System Health</h3>
                            <span className="text-xs text-primary flex items-center gap-1">
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
                    <GlassCard className="p-4 hover:border-primary/50 transition-all duration-normal">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold text-primary">Kiosk Status</h3>
                            <span className="text-xs text-primary flex items-center gap-1">
                                Manage <ChevronRight className="w-3 h-3" />
                            </span>
                        </div>
                        <DonutChartComponent data={KIOSK_STATUS} height={160} />
                        <div className="flex justify-center gap-4 mt-2">
                            <div className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-success" />
                                <span className="text-xs text-muted">Online</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-secondary" />
                                <span className="text-xs text-muted">Offline</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-warning" />
                                <span className="text-xs text-muted">Warning</span>
                            </div>
                        </div>
                    </GlassCard>
                </Link>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Alert Feed - Simplified, no filters */}
                {/* Alert Feed - Simplified, no filters */}
                <GlassCard aurora>
                    <div className="px-4 py-3 border-b border-glass">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-warning" />
                                Attention Required
                            </h3>
                            <span className="badge-danger">
                                {MOCK_ALERTS.length}
                            </span>
                        </div>
                    </div>
                    <div className="divide-y divide-glass max-h-64 overflow-y-auto">
                        {MOCK_ALERTS.length === 0 ? (
                            <div className="px-4 py-8 text-center">
                                <p className="text-sm text-success">✓ All systems operational</p>
                            </div>
                        ) : (
                            MOCK_ALERTS.map((alert) => (
                                <Link
                                    key={alert.id}
                                    href={alert.href}
                                    className="block px-4 py-3 glass-hover transition-all duration-fast cursor-pointer group"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5">
                                            <AlertIcon type={alert.type} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <SeverityDot severity={alert.severity} />
                                                <span className="text-sm font-medium text-primary group-hover:text-primary transition-colors">{alert.title}</span>
                                            </div>
                                            <p className="text-xs text-muted mt-0.5">{alert.message}</p>
                                            <p className="text-xs text-muted mt-1 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {alert.time}
                                            </p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                    <div className="px-4 py-2 border-t border-glass">
                        <Link
                            href="/audit"
                            className="text-xs text-muted hover:text-primary flex items-center gap-1 transition-colors"
                        >
                            View audit logs <ChevronRight className="w-3 h-3" />
                        </Link>
                    </div>
                </GlassCard>

                {/* Quick Access - Replaces Hotels Table */}
                {/* Quick Access - Replaces Hotels Table */}
                <GlassCard className="lg:col-span-2">
                    <div className="px-4 py-3 border-b border-glass">
                        <h3 className="text-sm font-semibold text-primary">Quick Access</h3>
                    </div>
                    <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {QUICK_ACCESS.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center gap-3 p-3 rounded-xl border border-glass glass-hover transition-all duration-fast group"
                            >
                                <div className={`p-2 rounded-lg ${item.color}`}>
                                    <item.icon className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-primary group-hover:text-primary transition-colors">{item.name}</p>
                                    <p className="text-xs text-muted truncate">{item.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
