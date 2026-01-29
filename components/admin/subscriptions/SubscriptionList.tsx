'use client';

/**
 * SubscriptionList Component
 * 
 * Main component for managing subscriptions.
 */

import { useState, useRef, useEffect } from 'react';
import { Search, Download, ChevronDown, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { Card } from '@/components/shared/ui/Card';
import { useSubscriptions, TabType } from './useSubscriptions';
import { SubscriptionMetricsCards } from './SubscriptionMetricsCards';
import { SubscriptionTable } from './SubscriptionTable';
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
    const startItem = subscriptions.length > 0 ? (page - 1) * pageSize + 1 : 0;
    const endItem = Math.min(page * pageSize, totalItems);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-primary">Subscription Management</h1>
                    <p className="text-sm text-muted">Track entitlements and subscription status</p>
                </div>
                <div className="flex items-center gap-3">
                    <ExportDropdown />
                </div>
            </div>

            {/* Metrics Cards */}
            <SubscriptionMetricsCards metrics={metrics} />

            {/* Table Card */}
            <Card padding="none">
                {/* Tabs */}
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
                            value={filters.search}
                            onChange={(e) => setFilter('search', e.target.value)}
                            className="input-glass pl-10"
                        />
                    </div>
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

                {/* Table */}
                <SubscriptionTable subscriptions={subscriptions} isLoading={isLoading} />

                {/* Pagination */}
                <div className="px-4 py-3 border-t border-glass flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted">Rows per page:</span>
                        <select
                            value={pageSize}
                            onChange={(e) => setPageSize(Number(e.target.value))}
                            className="input-glass py-1"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted">
                            {totalItems > 0 ? `${startItem}–${endItem} of ${totalItems}` : '0 items'}
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                                className="p-1.5 rounded-md glass-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4 text-muted" />
                            </button>
                            <span className="px-2 text-sm text-secondary-text">
                                {page} / {totalPages || 1}
                            </span>
                            <button
                                onClick={() => setPage(page + 1)}
                                disabled={page === totalPages || totalPages === 0}
                                className="p-1.5 rounded-md glass-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-4 h-4 text-muted" />
                            </button>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Error display */}
            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                    {error.message}
                </div>
            )}
        </div>
    );
}
