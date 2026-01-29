'use client';

import Link from 'next/link';
import { X, Building2, Download, CreditCard } from 'lucide-react';
import { InvoiceStatusBadge } from './InvoiceStatusBadge';
import type { Invoice } from '@/types/finance';

interface InvoiceDetailSlideOverProps {
    isOpen: boolean;
    onClose: () => void;
    invoice: Invoice | null;
    onMarkAsPaid: (invoice: Invoice) => void;
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

export function InvoiceDetailSlideOver({
    isOpen,
    onClose,
    invoice,
    onMarkAsPaid,
    onDownloadPdf,
}: InvoiceDetailSlideOverProps) {
    if (!isOpen || !invoice) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="absolute inset-y-0 right-0 w-full sm:max-w-md surface-glass-strong shadow-elevated">
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-glass flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-primary">
                            {invoice.invoiceNumber}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg glass-hover transition-all duration-fast"
                        >
                            <X className="w-5 h-5 text-muted" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {/* Hotel Info */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg surface-glass-soft">
                                <Building2 className="w-5 h-5 text-secondary-text" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-primary">{invoice.hotelName}</p>
                                <Link
                                    href={`/subscriptions/${invoice.hotelId}`}
                                    className="text-xs text-info hover:underline"
                                >
                                    View subscription →
                                </Link>
                            </div>
                        </div>

                        {/* Invoice Meta */}
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between">
                                <span className="text-sm text-muted">Issue Date</span>
                                <span className="text-sm font-medium text-primary">{formatDate(invoice.issueDate)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-muted">Due Date</span>
                                <span className="text-sm font-medium text-primary">{formatDate(invoice.dueDate)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-muted">Status</span>
                                <InvoiceStatusBadge status={invoice.status} />
                            </div>
                        </div>

                        {/* Line Items */}
                        <div className="border-t border-glass pt-4 mb-4">
                            <h3 className="text-sm font-semibold text-primary mb-3">Line Items</h3>
                            <div className="space-y-2">
                                {invoice.lineItems.map((item, idx) => (
                                    <div key={idx} className="flex justify-between py-2">
                                        <div>
                                            <p className="text-sm text-primary">{item.description}</p>
                                            {item.quantity > 1 && (
                                                <p className="text-xs text-muted">
                                                    {item.quantity} x {formatCurrency(item.unitPrice)}
                                                </p>
                                            )}
                                        </div>
                                        <span className="text-sm font-medium text-primary">{formatCurrency(item.amount)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Totals */}
                        <div className="border-t border-glass pt-4 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-muted">Subtotal</span>
                                <span className="text-sm text-primary">{formatCurrency(invoice.amount)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-muted">GST (18%)</span>
                                <span className="text-sm text-primary">{formatCurrency(invoice.taxAmount)}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-glass">
                                <span className="text-sm font-semibold text-primary">Total</span>
                                <span className="text-lg font-bold text-primary">{formatCurrency(invoice.totalAmount)}</span>
                            </div>
                        </div>

                        {/* Payment Timeline */}
                        <div className="mt-6 pt-4 border-t border-glass">
                            <h3 className="text-sm font-semibold text-primary mb-3">Payment Timeline</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-muted" />
                                    <span className="text-xs text-muted">{formatDate(invoice.issueDate)} - Invoice generated</span>
                                </div>
                                {invoice.paidDate ? (
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-success" />
                                        <span className="text-xs text-success">{formatDate(invoice.paidDate)} - Payment received</span>
                                    </div>
                                ) : invoice.status === 'overdue' ? (
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-danger" />
                                        <span className="text-xs text-danger">{formatDate(invoice.dueDate)} - Due date passed</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-warning" />
                                        <span className="text-xs text-warning">Due on {formatDate(invoice.dueDate)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="px-6 py-4 border-t border-glass flex gap-3">
                        <button
                            onClick={() => onDownloadPdf(invoice)}
                            className="btn-secondary flex-1"
                        >
                            <Download className="w-4 h-4" />
                            Download PDF
                        </button>
                        {invoice.status !== 'paid' && (
                            <button
                                onClick={() => onMarkAsPaid(invoice)}
                                className="btn-primary flex-1"
                            >
                                <CreditCard className="w-4 h-4" />
                                Record Payment
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
