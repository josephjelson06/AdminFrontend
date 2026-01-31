'use client';

/**
 * InvoiceCard Component
 * 
 * Card-based display for individual invoice with status badge and actions.
 */

import { FileText, Calendar, MoreVertical, Download, CheckCircle, Bell } from 'lucide-react';
import { GlassCard } from '@/components/shared/ui/GlassCard';
import { InvoiceStatusBadge } from './InvoiceStatusBadge';
import { Dropdown, DropdownItem } from '@/components/shared/ui/Dropdown';
import type { Invoice } from '@/types/finance';

interface InvoiceCardProps {
    invoice: Invoice;
    onClick?: (invoice: Invoice) => void;
    onMarkAsPaid?: (invoice: Invoice) => void;
    onSendReminder?: (invoice: Invoice) => void;
    onDownloadPdf?: (invoice: Invoice) => void;
}

// Get gradient based on status
function getStatusGradient(status: Invoice['status']) {
    switch (status) {
        case 'paid':
            return 'from-emerald-500 to-teal-500';
        case 'pending':
            return 'from-amber-500 to-orange-500';
        case 'overdue':
            return 'from-red-500 to-rose-500';
        case 'cancelled':
            return 'from-slate-500 to-gray-500';
        default:
            return 'from-indigo-500 to-purple-600';
    }
}

export function InvoiceCard({
    invoice,
    onClick,
    onMarkAsPaid,
    onSendReminder,
    onDownloadPdf,
}: InvoiceCardProps) {
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <GlassCard
            className="group relative overflow-hidden h-full flex flex-col cursor-pointer"
            hover
            padding="none"
            onClick={() => onClick?.(invoice)}
        >
            {/* Status Badge - Top Left */}
            <div className="absolute top-4 left-4 z-10">
                <InvoiceStatusBadge status={invoice.status} />
            </div>

            {/* Actions Menu - Top Right */}
            <div className="absolute top-4 right-4 z-10" onClick={(e) => e.stopPropagation()}>
                <Dropdown
                    trigger={
                        <button className="p-2 rounded-lg surface-glass-soft hover:surface-glass-strong transition-all">
                            <MoreVertical className="w-4 h-4 text-muted" />
                        </button>
                    }
                    align="right"
                >
                    {invoice.status !== 'paid' && onMarkAsPaid && (
                        <DropdownItem onClick={() => onMarkAsPaid(invoice)}>
                            <CheckCircle className="w-4 h-4 text-success" />
                            Mark as Paid
                        </DropdownItem>
                    )}
                    {invoice.status !== 'paid' && onSendReminder && (
                        <DropdownItem onClick={() => onSendReminder(invoice)}>
                            <Bell className="w-4 h-4 text-warning" />
                            Send Reminder
                        </DropdownItem>
                    )}
                    {onDownloadPdf && (
                        <DropdownItem onClick={() => onDownloadPdf(invoice)}>
                            <Download className="w-4 h-4" />
                            Download PDF
                        </DropdownItem>
                    )}
                </Dropdown>
            </div>

            {/* Card Header with Icon */}
            <div className="p-6 pt-14 flex flex-col items-center text-center flex-1">
                {/* Icon */}
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${getStatusGradient(invoice.status)} shadow-lg mb-4`}>
                    <FileText className="w-7 h-7 text-white" />
                </div>

                {/* Invoice Number */}
                <h3 className="text-base font-semibold text-info hover:underline">
                    {invoice.invoiceNumber}
                </h3>

                {/* Hotel Name */}
                <p className="text-sm text-muted mt-1">
                    {invoice.hotelName}
                </p>

                {/* Amount */}
                <div className="mt-4">
                    <p className="text-xs text-muted uppercase tracking-wide">Total Amount</p>
                    <p className="text-xl font-bold text-success mt-1">
                        {formatCurrency(invoice.totalAmount)}
                    </p>
                </div>
            </div>

            {/* Due Date Footer */}
            <div className="px-6 pb-5 flex items-center justify-center gap-2 text-muted">
                <Calendar className="w-4 h-4" />
                <span className="text-xs">Due: {formatDate(invoice.dueDate)}</span>
            </div>

            {/* Bottom Border Accent */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${getStatusGradient(invoice.status)} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
        </GlassCard>
    );
}
