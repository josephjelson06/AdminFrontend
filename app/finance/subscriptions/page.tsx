'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Building2,
    CreditCard,
    Wallet,
    AlertTriangle,
    Clock,
    ChevronRight,
    Search,
    Filter,
    Download,
    CheckCircle,
    XCircle,
    Plus,
    TrendingUp,
    TrendingDown,
} from 'lucide-react';
import { MOCK_SUBSCRIPTIONS, MOCK_FINANCIAL_METRICS } from '@/lib/finance-data';
import type { HotelSubscription } from '@/types/finance';

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

function StatusBadge({ status }: { status: HotelSubscription['status'] }) {
    const config = {
        active: { label: 'Active', style: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
        suspended: { label: 'Suspended', style: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' },
        grace_period: { label: 'Grace Period', style: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
        cancelled: { label: 'Cancelled', style: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400' },
    };
    const { label, style } = config[status];
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${style}`}>
            {label}
        </span>
    );
}

function PlanBadge({ plan }: { plan: 'standard' | 'advanced' }) {
    return (
        <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${plan === 'advanced'
            ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
            : 'bg-slate-700 text-white dark:bg-slate-600'
            }`}>
            {plan}
        </span>
    );
}

function PaymentMethodIcon({ method }: { method: HotelSubscription['paymentMethod'] }) {
    const config = {
        auto: { icon: CreditCard, color: 'text-emerald-500', label: 'Auto-pay' },
        manual: { icon: Wallet, color: 'text-blue-500', label: 'Manual' },
        bank_transfer: { icon: Building2, color: 'text-purple-500', label: 'Bank' },
        upi: { icon: Wallet, color: 'text-orange-500', label: 'UPI' },
        cheque: { icon: Wallet, color: 'text-slate-500', label: 'Cheque' },
    };
    const { icon: Icon, color, label } = config[method];
    return (
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
            <Icon className={`w-3.5 h-3.5 ${color}`} />
            {label}
        </span>
    );
}

function PaymentStatusIndicator({ status }: { status: HotelSubscription['paymentStatus'] }) {
    const config = {
        active: { icon: CheckCircle, color: 'text-emerald-500' },
        failed: { icon: XCircle, color: 'text-rose-500' },
        grace_period: { icon: Clock, color: 'text-amber-500' },
        paused: { icon: Clock, color: 'text-slate-500' },
    };
    const { icon: Icon, color } = config[status];
    return <Icon className={`w-4 h-4 ${color}`} />;
}

type TabType = 'all' | 'auto_pay' | 'manual' | 'failed' | 'grace_period';

export default function SubscriptionsPage() {
    const [activeTab, setActiveTab] = useState<TabType>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [planFilter, setPlanFilter] = useState<'all' | 'standard' | 'advanced'>('all');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'grace_period'>('all');

    const metrics = MOCK_FINANCIAL_METRICS;
    const allSubscriptions = MOCK_SUBSCRIPTIONS;

    // Filter by tab
    const getTabFiltered = (subs: HotelSubscription[]) => {
        switch (activeTab) {
            case 'auto_pay':
                return subs.filter(s => s.paymentMethod === 'auto');
            case 'manual':
                return subs.filter(s => s.paymentMethod !== 'auto');
            case 'failed':
                return subs.filter(s => s.paymentStatus === 'failed');
            case 'grace_period':
                return subs.filter(s => s.paymentStatus === 'grace_period');
            default:
                return subs;
        }
    };

    // Apply all filters
    const filteredSubscriptions = getTabFiltered(allSubscriptions)
        .filter(s => {
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return s.hotelName.toLowerCase().includes(query) || s.location.toLowerCase().includes(query);
            }
            return true;
        })
        .filter(s => planFilter === 'all' || s.plan === planFilter)
        .filter(s => statusFilter === 'all' || s.status === statusFilter);

    // Tab counts
    const tabCounts = {
        all: allSubscriptions.length,
        auto_pay: allSubscriptions.filter(s => s.paymentMethod === 'auto').length,
        manual: allSubscriptions.filter(s => s.paymentMethod !== 'auto').length,
        failed: allSubscriptions.filter(s => s.paymentStatus === 'failed').length,
        grace_period: allSubscriptions.filter(s => s.paymentStatus === 'grace_period').length,
    };

    const tabs: { id: TabType; label: string; count: number; color?: string }[] = [
        { id: 'all', label: 'All Hotels', count: tabCounts.all },
        { id: 'auto_pay', label: 'Auto-Pay', count: tabCounts.auto_pay },
        { id: 'manual', label: 'Manual Pay', count: tabCounts.manual },
        { id: 'failed', label: 'Payment Failed', count: tabCounts.failed, color: 'text-rose-600' },
        { id: 'grace_period', label: 'Grace Period', count: tabCounts.grace_period, color: 'text-amber-600' },
    ];

    return (
        <div className="p-4 sm:p-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-2">
                        <Link href="/finance" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300">
                            Finance
                        </Link>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-900 dark:text-white">Subscriptions</span>
                    </div>
                    <h1 className="text-xl font-semibold text-slate-900 dark:text-white mt-1">Subscription Management</h1>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium rounded-md hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors">
                        <Plus className="w-4 h-4" />
                        Add Hotel
                    </button>
                </div>
            </div>

            {/* KPI Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Active</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{metrics.activeSubscriptions}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">subscriptions</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">New</p>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">+{metrics.newSubscriptionsThisMonth}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">this month</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Churned</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{metrics.churnedThisMonth}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">this month</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Net Growth</p>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">+{metrics.newSubscriptionsThisMonth - metrics.churnedThisMonth}</p>
                        <TrendingUp className="w-5 h-5 text-emerald-500" />
                    </div>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">+{((metrics.newSubscriptionsThisMonth / metrics.activeSubscriptions) * 100).toFixed(1)}%</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
                    <div className="flex">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                                    ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white'
                                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                                    }`}
                            >
                                {tab.label}
                                <span className={`px-1.5 py-0.5 rounded text-xs ${activeTab === tab.id
                                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                                    : `bg-slate-100 dark:bg-slate-700 ${tab.color || 'text-slate-600 dark:text-slate-400'}`
                                    }`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Filters */}
                <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search hotels..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                        />
                    </div>
                    <select
                        value={planFilter}
                        onChange={(e) => setPlanFilter(e.target.value as typeof planFilter)}
                        className="px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                    >
                        <option value="all">All Plans</option>
                        <option value="standard">Standard</option>
                        <option value="advanced">Advanced</option>
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                        className="px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                        <option value="grace_period">Grace Period</option>
                    </select>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Hotel</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Plan</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Status</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Payment</th>
                                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">MRR</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Next Billing</th>
                                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {filteredSubscriptions.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                                        No subscriptions found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredSubscriptions.map((sub) => (
                                    <tr key={sub.hotelId} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700">
                                                    <Building2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900 dark:text-white">{sub.hotelName}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{sub.location}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <PlanBadge plan={sub.plan} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusBadge status={sub.status} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <PaymentStatusIndicator status={sub.paymentStatus} />
                                                <div>
                                                    <PaymentMethodIcon method={sub.paymentMethod} />
                                                    {sub.cardLast4 && (
                                                        <p className="text-xs text-slate-400 dark:text-slate-500">•••• {sub.cardLast4}</p>
                                                    )}
                                                    {sub.failedAttempts && sub.failedAttempts > 0 && (
                                                        <p className="text-xs text-rose-500">{sub.failedAttempts} failed attempts</p>
                                                    )}
                                                    {sub.gracePeriodDaysRemaining && (
                                                        <p className="text-xs text-amber-500">{sub.gracePeriodDaysRemaining} days left</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                                {formatCurrency(sub.mrr)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm text-slate-700 dark:text-slate-300">
                                                {formatDate(sub.nextBillingDate)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <Link
                                                href={`/finance/subscriptions/${sub.hotelId}`}
                                                className="inline-flex items-center justify-center p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                            >
                                                <ChevronRight className="w-4 h-4 text-slate-400" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Showing {filteredSubscriptions.length} of {allSubscriptions.length} subscriptions
                    </p>
                </div>
            </div>
        </div>
    );
}
