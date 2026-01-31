'use client';

/**
 * SubscriptionList Component
 * 
 * Main component for managing subscriptions with card-based layout.
 */

import { useState, useRef, useEffect } from 'react';
import { Search, Download, ChevronDown, FileText } from 'lucide-react';
import { GlassCard } from '@/components/shared/ui/GlassCard';
import { PaginationBar } from '@/components/shared/ui/Pagination';
import { useSubscriptions, TabType } from './useSubscriptions';
import { SubscriptionMetricsCards } from './SubscriptionMetricsCards';
import { SubscriptionCard } from './SubscriptionCard';
import { Skeleton } from '@/components/shared/ui/Skeleton';
import type { TabCounts } from '@/lib/services/subscriptionService';

// Tab definitions
function getTabs(counts: TabCounts): { id: TabType; label: string; count: number; color?: string }[] {
    return [
        { id: 'all', label: 'All Hotels', count: counts.all },
        { id: 'auto_pay', label: 'Auto-Pay', count: counts.auto_pay },
        { id: 'manual', label: 'Manual Pay', count: counts.manual },
        { id: 'failed', label: 'Payment Failed', count: counts.failed, color: 'text-danger' },
        { id: 'grace_period', label: 'Grace Period', count: counts.grace_period, color: 'text-warning' },
    ];
}

const planOptions = [
    { value: 'all', label: 'All Plans' },
    { value: 'standard', label: 'Standard' },
    { value: 'advanced', label: 'Advanced' },
];

const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'grace_period', label: 'Grace Period' },
];

// Export Dropdown
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
                <div className="absolute right-0 mt-1 w-40 surface-glass-strong border border-glass rounded-xl shadow-lg z-50">
                    <button
                        onClick={() => handleExport('pdf')}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-secondary-text glass-hover transition-colors rounded-t-xl"
                    >
                        <FileText className="w-4 h-4" />
                        Export as PDF
                    </button>
                    <button
                        onClick={() => handleExport('excel')}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-secondary-text glass-hover transition-colors rounded-b-xl"
                    >
                        <FileText className="w-4 h-4" />
                        Export as Excel
                    </button>
                </div>
            )}
        </div>
    );
}

export function SubscriptionList() {
    const {
        subscriptions,
        isLoading,
        error,
        metrics,
        tabCounts,
        activeTab,
        setActiveTab,
        page,
        pageSize,
        totalPages,
        totalItems,
        setPage,
        setPageSize,
        filters,
        setFilter,
    } = useSubscriptions();

    const tabs = getTabs(tabCounts);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-primary">Subscriptions</h1>
                    <p className="text-sm text-muted">Track entitlements and subscription status</p>
                </div>
                <div className="flex items-center gap-3">
                    <ExportDropdown />
                </div>
            </div>

            {/* Metrics Cards */}
            <SubscriptionMetricsCards metrics={metrics} />

            {/* Tabs */}
            <GlassCard padding="none">
                <div className="border-b border-glass overflow-x-auto">
                    <div className="flex px-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted hover:text-secondary-text'
                                    }`}
                            >
                                {tab.label}
                                <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id
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
                <div className="p-4 border-b border-glass flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search hotels..."
                            value={filters.search}
                            onChange={(e) => setFilter('search', e.target.value)}
                            className="input-glass w-full pl-11"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            value={filters.plan}
                            onChange={(e) => setFilter('plan', e.target.value as typeof filters.plan)}
                            className="input-glass"
                        >
                            {planOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilter('status', e.target.value as typeof filters.status)}
                            className="input-glass"
                        >
                            {statusOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </GlassCard>

            {/* Subscription Cards Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton key={i} className="h-72 rounded-2xl" />
                    ))}
                </div>
            ) : subscriptions.length === 0 ? (
                <GlassCard className="text-center py-16">
                    <p className="text-muted">No subscriptions found matching filters</p>
                </GlassCard>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {subscriptions.map((subscription) => (
                        <SubscriptionCard
                            key={subscription.hotelId}
                            subscription={subscription}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {subscriptions.length > 0 && (
                <PaginationBar
                    currentPage={page}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    pageSize={pageSize}
                    onPageChange={setPage}
                    onPageSizeChange={setPageSize}
                    pageSizeOptions={[8, 12, 16, 24]}
                />
            )}

            {/* Error display */}
            {error && (
                <GlassCard className="border-danger/30 bg-danger/5">
                    <p className="text-danger text-sm">{error.message}</p>
                </GlassCard>
            )}
        </div>
    );
}
