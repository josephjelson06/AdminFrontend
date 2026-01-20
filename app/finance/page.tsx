'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    IndianRupee,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    Calendar,
    CreditCard,
    FileText,
    ChevronRight,
    Download,
    Building2,
    Clock,
    CheckCircle,
    XCircle,
    ArrowUpRight,
} from 'lucide-react';
import {
    MOCK_FINANCIAL_METRICS,
    MOCK_REVENUE_DATA,
    MOCK_MRR_TREND,
    MOCK_AT_RISK_ITEMS,
    MOCK_CASH_FLOW,
    MOCK_SUBSCRIPTIONS,
} from '@/lib/finance-data';
import { AreaChartComponent, BarChartComponent, StackedBarChartComponent } from '@/components/ui/Charts';

function formatCurrency(amount: number): string {
    if (amount >= 100000) {
        return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
}

function formatFullCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
}

function TrendBadge({ value, suffix = '' }: { value: number; suffix?: string }) {
    const isPositive = value >= 0;
    return (
        <span className={`inline-flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {isPositive ? '+' : ''}{value.toFixed(1)}%{suffix}
        </span>
    );
}

function SeverityIcon({ severity }: { severity: 'critical' | 'warning' | 'info' }) {
    const config = {
        critical: { icon: XCircle, color: 'text-rose-500' },
        warning: { icon: AlertTriangle, color: 'text-amber-500' },
        info: { icon: Clock, color: 'text-blue-500' },
    };
    const { icon: Icon, color } = config[severity];
    return <Icon className={`w-4 h-4 ${color}`} />;
}

function RiskTypeIcon({ type }: { type: 'overdue_payment' | 'expiring_contract' | 'payment_failed' }) {
    const config = {
        overdue_payment: { icon: IndianRupee, color: 'text-rose-500' },
        expiring_contract: { icon: FileText, color: 'text-amber-500' },
        payment_failed: { icon: CreditCard, color: 'text-orange-500' },
    };
    const { icon: Icon, color } = config[type];
    return <Icon className={`w-4 h-4 ${color}`} />;
}

// Mini sparkline component
function Sparkline({ data, color = '#10b981' }: { data: { value: number }[]; color?: string }) {
    const values = data.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const height = 24;
    const width = 80;
    const points = values.map((v, i) => {
        const x = (i / (values.length - 1)) * width;
        const y = height - ((v - min) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg width={width} height={height} className="mt-1">
            <polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default function FinancePage() {
    const metrics = MOCK_FINANCIAL_METRICS;
    const cashFlow = MOCK_CASH_FLOW;
    const atRiskItems = MOCK_AT_RISK_ITEMS;
    const subscriptions = MOCK_SUBSCRIPTIONS;

    // Calculate collection rate
    const totalBilled = cashFlow.collected + cashFlow.outstanding;
    const collectionRate = totalBilled > 0 ? (cashFlow.collected / totalBilled) * 100 : 0;

    // Subscription stats
    const autoPayCount = subscriptions.filter(s => s.paymentMethod === 'auto').length;
    const manualPayCount = subscriptions.filter(s => s.paymentMethod !== 'auto').length;
    const failedCount = subscriptions.filter(s => s.paymentStatus === 'failed' || s.paymentStatus === 'grace_period').length;

    return (
        <div className="p-4 sm:p-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Financial Overview</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Revenue, subscriptions, and billing health</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600 dark:text-slate-300">Last 6 months</span>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium rounded-md hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* KPI Cards - Row 1 */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
                {/* MRR */}
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">MRR</p>
                            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{formatCurrency(metrics.mrr)}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                            <IndianRupee className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </div>
                    <Sparkline data={MOCK_MRR_TREND} color="#10b981" />
                </div>

                {/* ARR */}
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">ARR</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{formatCurrency(metrics.arr)}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        Projected annual revenue
                    </div>
                </div>

                {/* QoQ Growth */}
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">QoQ Growth</p>
                            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">+{metrics.mrrGrowthQoQ}%</p>
                        </div>
                        <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                            <ArrowUpRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </div>
                    <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        vs previous quarter
                    </div>
                </div>

                {/* YoY Growth */}
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">YoY Growth</p>
                            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">+{metrics.mrrGrowthYoY}%</p>
                        </div>
                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                            <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                    <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        vs same period last year
                    </div>
                </div>

                {/* Collection Rate */}
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 shadow-sm col-span-2 lg:col-span-1">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Collected</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{formatCurrency(cashFlow.collected)}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700">
                            <CheckCircle className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </div>
                    </div>
                    <div className="mt-2">
                        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                            <span>Collection rate</span>
                            <span>{collectionRate.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                            <div
                                className="bg-emerald-500 h-1.5 rounded-full"
                                style={{ width: `${collectionRate}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
                {/* Revenue by Stream */}
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Revenue by Stream</h3>
                        <div className="flex items-center gap-4 text-xs">
                            <span className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                Subscription
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                                Hardware
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                AMC
                            </span>
                        </div>
                    </div>
                    <StackedBarChartComponent
                        data={MOCK_REVENUE_DATA}
                        bars={[
                            { dataKey: 'subscription', color: '#10b981', name: 'Subscription' },
                            { dataKey: 'hardware', color: '#3b82f6', name: 'Hardware' },
                            { dataKey: 'amc', color: '#f59e0b', name: 'AMC' },
                        ]}
                        height={220}
                    />
                </div>

                {/* Cash Flow Summary */}
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Cash Flow Summary</h3>
                        <Link href="/invoices" className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1">
                            View invoices <ChevronRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {/* Collected */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">Collected</span>
                                </div>
                                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{formatFullCurrency(cashFlow.collected)}</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3">
                                <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '91.7%' }} />
                            </div>
                        </div>

                        {/* Outstanding */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-amber-500" />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">Outstanding</span>
                                </div>
                                <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">{formatFullCurrency(cashFlow.outstanding)}</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3">
                                <div className="bg-amber-500 h-3 rounded-full" style={{ width: '8.3%' }} />
                            </div>
                        </div>

                        {/* Overdue */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-2">
                                    <XCircle className="w-4 h-4 text-rose-500" />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">Overdue</span>
                                </div>
                                <span className="text-sm font-semibold text-rose-600 dark:text-rose-400">{formatFullCurrency(cashFlow.overdue)}</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3">
                                <div className="bg-rose-500 h-3 rounded-full" style={{ width: '5.9%' }} />
                            </div>
                        </div>
                    </div>

                    {/* Summary Stats */}
                    <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 grid grid-cols-3 gap-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{autoPayCount}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Auto-pay</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{manualPayCount}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Manual</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">{failedCount}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">At Risk</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* At-Risk Revenue Alert */}
            {atRiskItems.length > 0 && (
                <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                        <h3 className="text-sm font-semibold text-rose-900 dark:text-rose-100">
                            At-Risk Revenue: {atRiskItems.length} items require attention
                        </h3>
                        <span className="ml-auto text-sm font-semibold text-rose-700 dark:text-rose-300">
                            {formatFullCurrency(atRiskItems.reduce((sum, item) => sum + item.amount, 0))}
                        </span>
                    </div>
                    <div className="space-y-2">
                        {atRiskItems.map((item) => (
                            <Link
                                key={item.id}
                                href={`/finance/subscriptions/${item.hotelId}`}
                                className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                            >
                                <SeverityIcon severity={item.severity} />
                                <RiskTypeIcon type={item.type} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{item.hotelName}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.message}</p>
                                </div>
                                <span className="text-sm font-semibold text-slate-900 dark:text-white">{formatFullCurrency(item.amount)}</span>
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Quick Links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                    href="/finance/subscriptions"
                    className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors group"
                >
                    <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                        <Building2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">Subscriptions</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{metrics.activeSubscriptions} active hotels</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                </Link>

                <Link
                    href="/invoices"
                    className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors group"
                >
                    <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">Invoices</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Billing & payment history</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                </Link>

                <Link
                    href="/reports"
                    className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors group"
                >
                    <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                        <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">Reports</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Analytics & exports</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                </Link>
            </div>
        </div>
    );
}
