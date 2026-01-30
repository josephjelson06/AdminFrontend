'use client';

/**
 * InvoiceCard Component
 * 
 * Card-based display for individual invoice using BaseCard system.
 */

import { FileText, Calendar, MoreVertical, Download, CheckCircle, Bell } from 'lucide-react';
import {
    BaseCard,
    CardStat,
} from '@/components/shared/ui/BaseCard';
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

    const statusGradient = getStatusGradient(invoice.status);

    return (
        <BaseCard
            variant="financial"
            onClick={() => onClick?.(invoice)}
            header={{
                icon: <FileText className="w-7 h-7 text-white" />,
                iconGradient: statusGradient,
                title: invoice.invoiceNumber,
                subtitle: invoice.hotelName,
                badge: <InvoiceStatusBadge status={invoice.status} />,
                actionsMenu: (
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
                ),
            }}
            body={
                <div className="flex flex-col items-center text-center">
                    {/* Title is clickable */}
                    <h3 className="text-base font-semibold text-info hover:underline">
                        {invoice.invoiceNumber}
                    </h3>

                    {/* Amount */}
                    <CardStat
                        label="Total Amount"
                        value={formatCurrency(invoice.totalAmount)}
                    />
                </div>
            }
            footer={
                <div className="px-6 pb-5 flex items-center justify-center gap-2 text-muted">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs">Due: {formatDate(invoice.dueDate)}</span>
                </div>
            }
            accentGradient={statusGradient}
        />
    );
}
