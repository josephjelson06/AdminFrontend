'use client';

/**
 * InvoiceList Component
 * 
 * Main component for managing invoices.
 */

import { useState } from 'react';
import { Search, Plus, Download, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/components/shared/ui/Card';
import { useInvoices } from './useInvoices';
import { useInvoiceActions } from './useInvoiceActions';
import { InvoiceSummaryCards } from './InvoiceSummaryCards';
import { InvoiceTable } from './InvoiceTable';
import { InvoiceDetailSlideOver } from './InvoiceDetailSlideOver';
import { NewInvoiceModal } from './NewInvoiceModal';

const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'paid', label: 'Paid' },
    { value: 'pending', label: 'Pending' },
    { value: 'overdue', label: 'Overdue' },
];

export function InvoiceList() {
    const {
        invoices,
        isLoading,
        error,
        summary,
        page,
        pageSize,
        totalPages,
        setPage,
        setPageSize,
        filters,
        setFilter,
        refresh,
    } = useInvoices();

    const actions = useInvoiceActions(refresh);

    const startItem = invoices.length > 0 ? (page - 1) * pageSize + 1 : 0;
    const endItem = Math.min(page * pageSize, summary.totalCount);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-primary">Invoice Management</h1>
                    <p className="text-sm text-muted">Manage billing and payment records</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Export Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => actions.exportData('pdf')}
                            className="flex items-center gap-2 px-3 py-2 surface-glass-soft border border-glass text-sm text-secondary-text rounded-xl glass-hover transition-all duration-fast"
                        >
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                    <button
                        onClick={actions.openNewModal}
                        className="btn-primary"
                    >
                        <Plus className="w-4 h-4" />
                        New Invoice
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <InvoiceSummaryCards summary={summary} />

            {/* Table Card */}
            <Card padding="none">
                {/* Filters */}
                <div className="px-4 py-3 border-b border-glass flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                        <input
                            type="text"
                            placeholder="Search invoices..."
                            value={filters.search}
                            onChange={(e) => setFilter('search', e.target.value)}
                            className="input-glass pl-10"
                        />
                    </div>
                    <select
                        value={filters.status}
                        onChange={(e) => setFilter('status', e.target.value as typeof filters.status)}
                        className="input-glass !w-auto"
                    >
                        {statusOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Table */}
                <InvoiceTable
                    invoices={invoices}
                    isLoading={isLoading}
                    onRowClick={actions.openDetailSlideOver}
                    onMarkAsPaid={actions.markAsPaid}
                    onSendReminder={actions.sendReminder}
                    onDownloadPdf={actions.downloadPdf}
                />

                {/* Pagination */}
                <div className="px-4 py-3 border-t border-glass flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted">Rows per page:</span>
                        <select
                            value={pageSize}
                            onChange={(e) => setPageSize(Number(e.target.value))}
                            className="input-glass !w-auto !py-1"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted">
                            {summary.totalCount > 0 ? `${startItem}–${endItem} of ${summary.totalCount}` : '0 items'}
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                                className="p-1.5 rounded-lg glass-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-fast"
                            >
                                <ChevronLeft className="w-4 h-4 text-muted" />
                            </button>
                            <span className="px-2 text-sm text-secondary-text">
                                {page} / {totalPages || 1}
                            </span>
                            <button
                                onClick={() => setPage(page + 1)}
                                disabled={page === totalPages || totalPages === 0}
                                className="p-1.5 rounded-lg glass-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-fast"
                            >
                                <ChevronRight className="w-4 h-4 text-muted" />
                            </button>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Modals */}
            <NewInvoiceModal
                isOpen={actions.showNewModal}
                onClose={actions.closeAllModals}
                onSubmit={actions.createInvoice}
            />

            <InvoiceDetailSlideOver
                isOpen={actions.showDetailSlideOver}
                onClose={actions.closeAllModals}
                invoice={actions.selectedInvoice}
                onMarkAsPaid={actions.markAsPaid}
                onDownloadPdf={actions.downloadPdf}
            />

            {/* Error display */}
            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                    {error.message}
                </div>
            )}
        </div>
    );
}
