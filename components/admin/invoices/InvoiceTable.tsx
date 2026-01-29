'use client';

/**
 * InvoiceTable Component
 * 
 * Table display for invoices with actions.
 */

import { Calendar, MoreVertical, FileText, Download, Send, Check } from 'lucide-react';
import { Card } from '@/components/shared/ui/Card';
import { Dropdown, DropdownItem } from '@/components/shared/ui/Dropdown';
import { InvoiceStatusBadge } from './InvoiceStatusBadge';
import type { Invoice } from '@/types/finance';

interface InvoiceTableProps {
    invoices: Invoice[];
    isLoading: boolean;
    onRowClick: (invoice: Invoice) => void;
    onMarkAsPaid: (invoice: Invoice) => void;
    onSendReminder: (invoice: Invoice) => void;
    onDownloadPdf: (invoice: Invoice) => void;
}

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

export function InvoiceTable({
    invoices,
    isLoading,
    onRowClick,
    onMarkAsPaid,
    onSendReminder,
    onDownloadPdf,
}: InvoiceTableProps) {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="table-glass">
                <thead>
                    <tr className="surface-glass-soft border-b border-glass">
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Invoice</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Hotel</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Amount</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Status</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Due Date</th>
                        <th className="text-center px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-glass">
                    {invoices.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted">
                                No invoices found matching your filters.
                            </td>
                        </tr>
                    ) : (
                        invoices.map((invoice) => (
                            <tr
                                key={invoice.id}
                                className="glass-hover cursor-pointer transition-all duration-fast"
                                onClick={() => onRowClick(invoice)}
                            >
                                <td className="px-4 py-3">
                                    <span className="text-sm font-mono font-medium text-primary">{invoice.invoiceNumber}</span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="text-sm text-secondary-text">{invoice.hotelName}</span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <span className="text-sm font-semibold text-primary">{formatCurrency(invoice.totalAmount)}</span>
                                </td>
                                <td className="px-4 py-3">
                                    <InvoiceStatusBadge status={invoice.status} />
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1.5 text-sm text-secondary-text">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {formatDate(invoice.dueDate)}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex items-center justify-center gap-1">
                                        {(invoice.status === 'pending' || invoice.status === 'overdue') && (
                                            <button
                                                onClick={() => onMarkAsPaid(invoice)}
                                                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-success bg-success/10 border border-success/20 rounded-lg hover:bg-success/20 transition-all duration-fast"
                                            >
                                                <Check className="w-3 h-3" />
                                                Mark Paid
                                            </button>
                                        )}
                                        <Dropdown
                                            trigger={
                                                <button className="p-1.5 glass-hover rounded-lg transition-all duration-fast">
                                                    <MoreVertical className="w-4 h-4 text-muted" />
                                                </button>
                                            }
                                            align="right"
                                        >
                                            <DropdownItem onClick={() => onRowClick(invoice)}>
                                                <FileText className="w-4 h-4 mr-2" />
                                                View Details
                                            </DropdownItem>
                                            <DropdownItem onClick={() => onDownloadPdf(invoice)}>
                                                <Download className="w-4 h-4 mr-2" />
                                                Download PDF
                                            </DropdownItem>
                                            {invoice.status !== 'paid' && (
                                                <DropdownItem onClick={() => onSendReminder(invoice)}>
                                                    <Send className="w-4 h-4 mr-2" />
                                                    Send Reminder
                                                </DropdownItem>
                                            )}
                                        </Dropdown>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
