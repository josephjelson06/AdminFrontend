'use client';

/**
 * InvoiceList Component
 * 
 * Main component for managing invoices with card-based layout.
 */

import { Search, Plus, Download } from 'lucide-react';
import { GlassCard } from '@/components/shared/ui/GlassCard';
import { PaginationBar } from '@/components/shared/ui/Pagination';
import { useInvoices } from './useInvoices';
import { useInvoiceActions } from './useInvoiceActions';
import { InvoiceSummaryCards } from './InvoiceSummaryCards';
import { InvoiceCard } from './InvoiceCard';
import { InvoiceDetailSlideOver } from './InvoiceDetailSlideOver';
import { NewInvoiceModal } from './NewInvoiceModal';
import { Skeleton } from '@/components/shared/ui/Skeleton';

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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-primary">Invoices</h1>
                    <p className="text-sm text-muted">{summary.totalCount} invoices</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => actions.exportData('pdf')}
                        className="btn-secondary"
                    >
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                    <button
                        onClick={actions.openNewModal}
                        className="btn-primary"
                    >
                        <Plus className="w-4 h-4" />
                        Create Invoice
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <InvoiceSummaryCards summary={summary} />

            {/* Filters */}
            <GlassCard padding="sm">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search invoices..."
                            value={filters.search}
                            onChange={(e) => setFilter('search', e.target.value)}
                            className="input-glass w-full pl-11"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted">Status:</span>
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

            {/* Invoice Cards Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton key={i} className="h-64 rounded-2xl" />
                    ))}
                </div>
            ) : invoices.length === 0 ? (
                <GlassCard className="text-center py-16">
                    <div className="space-y-3">
                        <p className="text-muted">No invoices found</p>
                        <button onClick={actions.openNewModal} className="btn-primary">
                            <Plus className="w-4 h-4" />
                            Create First Invoice
                        </button>
                    </div>
                </GlassCard>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {invoices.map((invoice) => (
                        <InvoiceCard
                            key={invoice.id}
                            invoice={invoice}
                            onClick={actions.openDetailSlideOver}
                            onMarkAsPaid={actions.markAsPaid}
                            onSendReminder={actions.sendReminder}
                            onDownloadPdf={actions.downloadPdf}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {invoices.length > 0 && (
                <PaginationBar
                    currentPage={page}
                    totalPages={totalPages}
                    totalItems={summary.totalCount}
                    pageSize={pageSize}
                    onPageChange={setPage}
                    onPageSizeChange={setPageSize}
                    pageSizeOptions={[8, 12, 16, 24]}
                />
            )}

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
                <GlassCard className="border-danger/30 bg-danger/5">
                    <p className="text-danger text-sm">{error.message}</p>
                </GlassCard>
            )}
        </div>
    );
}
