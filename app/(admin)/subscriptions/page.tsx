'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
    Building2,
    CreditCard,
    Wallet,
    AlertTriangle,
    Clock,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Search,
    Download,
    CheckCircle,
    XCircle,
    TrendingUp,
    MoreVertical,
    FileText,
} from 'lucide-react';
import { MOCK_SUBSCRIPTIONS, MOCK_FINANCIAL_METRICS } from '@/lib/admin/finance-data';
import type { HotelSubscription } from '@/types/finance';
import { SelectDropdown } from '@/components/shared/ui/Dropdown';

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
        active: { label: 'Active', style: 'badge-success' },
        suspended: { label: 'Suspended', style: 'badge-danger' },
        grace_period: { label: 'Grace Period', style: 'badge-warning' },
        cancelled: { label: 'Cancelled', style: 'badge-default' },
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
            ? 'bg-gradient-to-r from-warning to-warning/80 text-inverse'
            : 'surface-glass-soft text-secondary-text'
            }`}>
            {plan}
        </span>
    );
}

function PaymentMethodIcon({ method }: { method: HotelSubscription['paymentMethod'] }) {
    const config = {
        auto: { icon: CreditCard, color: 'text-success', label: 'Auto-pay' },
        manual: { icon: Wallet, color: 'text-info', label: 'Manual' },
        bank_transfer: { icon: Building2, color: 'text-info', label: 'Bank' },
        upi: { icon: Wallet, color: 'text-warning', label: 'UPI' },
        cheque: { icon: Wallet, color: 'text-muted', label: 'Cheque' },
    };
    const { icon: Icon, color, label } = config[method];
    return (
        <span className="inline-flex items-center gap-1.5 text-xs text-secondary-text">
            <Icon className={`w-3.5 h-3.5 ${color}`} />
            {label}
        </span>
    );
}

function PaymentStatusIndicator({ status }: { status: HotelSubscription['paymentStatus'] }) {
    const config = {
        active: { icon: CheckCircle, color: 'text-success' },
        failed: { icon: XCircle, color: 'text-danger' },
        grace_period: { icon: Clock, color: 'text-warning' },
        paused: { icon: Clock, color: 'text-muted' },
    };
    const { icon: Icon, color } = config[status];
    return <Icon className={`w-4 h-4 ${color}`} />;
}

// Export Dropdown Component
function ExportDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleExport = (format: 'pdf' | 'excel') => {
        // TODO: Implement actual export logic
        console.log(`Exporting as ${format}`);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="btn-secondary"
            >
                <Download className="w-4 h-4" />
                Export
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-1 w-40 surface-glass-strong border border-glass rounded-md shadow-lg z-50">
                    <button
                        onClick={() => handleExport('pdf')}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-secondary-text glass-hover transition-colors"
                    >
                        <FileText className="w-4 h-4" />
                        Export as PDF
                    </button>
                    <button
                        onClick={() => handleExport('excel')}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-secondary-text glass-hover transition-colors"
                    >
                        <FileText className="w-4 h-4" />
                        Export as Excel
                    </button>
                </div>
            )}
        </div>
    );
}

// Row Actions Menu Component
function RowActionsMenu({ hotelId }: { hotelId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md glass-hover transition-colors"
            >
                <MoreVertical className="w-4 h-4 text-muted" />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-1 w-36 surface-glass-strong border border-glass rounded-md shadow-lg z-50">
                    <Link
                        href={`/subscriptions/${hotelId}`}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-primary glass-hover transition-colors rounded-md"
                    >
                        More Details
                    </Link>
                </div>
            )}
        </div>
    );
}

// Pagination Footer Component
function PaginationFooter({
    currentPage,
    totalPages,
    rowsPerPage,
    totalItems,
    onPageChange,
    onRowsPerPageChange,
}: {
    currentPage: number;
    totalPages: number;
    rowsPerPage: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onRowsPerPageChange: (rows: number) => void;
}) {
    const startItem = (currentPage - 1) * rowsPerPage + 1;
    const endItem = Math.min(currentPage * rowsPerPage, totalItems);

    return (
        <div className="px-4 py-3 border-t border-glass flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
                <span className="text-sm text-muted">Rows per page:</span>
                <div className="w-20">
                    <SelectDropdown
                        value={String(rowsPerPage)}
                        onChange={(val) => onRowsPerPageChange(Number(val))}
                        options={[
                            { value: '5', label: '5' },
                            { value: '10', label: '10' },
                            { value: '15', label: '15' },
                        ]}
                    />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-sm text-muted">
                    {startItem}–{endItem} of {totalItems}
                </span>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-1.5 rounded-md glass-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4 text-muted" />
                    </button>
                    <span className="px-2 text-sm text-secondary-text">
                        {currentPage} / {totalPages}
                    </span>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-1.5 rounded-md glass-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight className="w-4 h-4 text-muted" />
                    </button>
                </div>
            </div>
        </div>
    );
}

type TabType = 'all' | 'auto_pay' | 'manual' | 'failed' | 'grace_period';

export default function SubscriptionsPage() {
    const [activeTab, setActiveTab] = useState<TabType>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [planFilter, setPlanFilter] = useState<'all' | 'standard' | 'advanced'>('all');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'grace_period'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

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

    // Pagination
    const totalPages = Math.max(1, Math.ceil(filteredSubscriptions.length / rowsPerPage));
    const paginatedSubscriptions = filteredSubscriptions.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, searchQuery, planFilter, statusFilter, rowsPerPage]);

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
        <div className="p-4 sm:p-6 animate-in fade-in duration-normal">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl font-semibold text-primary">Subscription Management</h1>
                    <p className="text-sm text-muted">Track entitlements and subscription status</p>
                </div>
                <div className="flex items-center gap-3">
                    <ExportDropdown />
                </div>
            </div>

            {/* KPI Summary - LOCKED (Do Not Modify) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <div className="surface-glass-strong rounded-lg border border-glass p-4">
                    <p className="text-xs font-medium text-muted uppercase tracking-wide">Active</p>
                    <p className="text-2xl font-bold text-primary mt-1">{metrics.activeSubscriptions}</p>
                    <p className="text-xs text-muted mt-1">subscriptions</p>
                </div>
                <div className="surface-glass-strong rounded-lg border border-glass p-4">
                    <p className="text-xs font-medium text-muted uppercase tracking-wide">New</p>
                    <p className="text-2xl font-bold text-success mt-1">+{metrics.newSubscriptionsThisMonth}</p>
                    <p className="text-xs text-muted mt-1">this month</p>
                </div>
                <div className="surface-glass-strong rounded-lg border border-glass p-4">
                    <p className="text-xs font-medium text-muted uppercase tracking-wide">Churned</p>
                    <p className="text-2xl font-bold text-primary mt-1">{metrics.churnedThisMonth}</p>
                    <p className="text-xs text-muted mt-1">this month</p>
                </div>
                <div className="surface-glass-strong rounded-lg border border-glass p-4">
                    <p className="text-xs font-medium text-muted uppercase tracking-wide">Net Growth</p>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-2xl font-bold text-success">+{metrics.newSubscriptionsThisMonth - metrics.churnedThisMonth}</p>
                        <TrendingUp className="w-5 h-5 text-success" />
                    </div>
                    <p className="text-xs text-success mt-1">+{((metrics.newSubscriptionsThisMonth / metrics.activeSubscriptions) * 100).toFixed(1)}%</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="surface-glass-strong rounded-lg border border-glass">
                <div className="border-b border-glass overflow-x-auto">
                    <div className="flex">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted hover:text-secondary-text'
                                    }`}
                            >
                                {tab.label}
                                <span className={`px-1.5 py-0.5 rounded text-xs ${activeTab === tab.id
                                    ? 'bg-primary text-inverse'
                                    : `surface-glass-soft ${tab.color || 'text-muted'}`
                                    }`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Filters */}
                <div className="px-4 py-3 border-b border-glass flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                        <input
                            type="text"
                            placeholder="Search hotels..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-glass pl-10"
                        />
                    </div>
                    <div className="w-40">
                        <SelectDropdown
                            value={planFilter}
                            onChange={(val) => setPlanFilter(val as typeof planFilter)}
                            options={[
                                { value: 'all', label: 'All Plans' },
                                { value: 'standard', label: 'Standard' },
                                { value: 'advanced', label: 'Advanced' },
                            ]}
                        />
                    </div>
                    <div className="w-40">
                        <SelectDropdown
                            value={statusFilter}
                            onChange={(val) => setStatusFilter(val as typeof statusFilter)}
                            options={[
                                { value: 'all', label: 'All Status' },
                                { value: 'active', label: 'Active' },
                                { value: 'suspended', label: 'Suspended' },
                                { value: 'grace_period', label: 'Grace Period' },
                            ]}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="table-glass">
                        <thead>
                            <tr className="surface-glass-soft border-b border-glass">
                                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Hotel</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Plan</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Status</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Payment</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Kiosk Usage</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Next Billing</th>
                                <th className="text-center px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-glass">
                            {paginatedSubscriptions.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted">
                                        No subscriptions found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                paginatedSubscriptions.map((sub) => (
                                    <tr key={sub.hotelId} className="glass-hover transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg surface-glass-soft">
                                                    <Building2 className="w-4 h-4 text-muted" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-primary">{sub.hotelName}</p>
                                                    <p className="text-xs text-muted">{sub.location}</p>
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
                                                        <p className="text-xs text-muted">•••• {sub.cardLast4}</p>
                                                    )}
                                                    {sub.failedAttempts && sub.failedAttempts > 0 && (
                                                        <p className="text-xs text-danger">{sub.failedAttempts} failed</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 surface-glass-soft rounded-full h-1.5">
                                                    <div
                                                        className="bg-success h-1.5 rounded-full"
                                                        style={{ width: `${(sub.kioskUsage / sub.kioskLimit) * 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-secondary-text">
                                                    {sub.kioskUsage}/{sub.kioskLimit}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm text-secondary-text">
                                                {formatDate(sub.nextBillingDate)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <RowActionsMenu hotelId={sub.hotelId} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <PaginationFooter
                    currentPage={currentPage}
                    totalPages={totalPages}
                    rowsPerPage={rowsPerPage}
                    totalItems={filteredSubscriptions.length}
                    onPageChange={setCurrentPage}
                    onRowsPerPageChange={setRowsPerPage}
                />
            </div>
        </div>
    );
}
