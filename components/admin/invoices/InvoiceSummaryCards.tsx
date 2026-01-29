'use client';

/**
 * InvoiceSummaryCards Component
 * 
 * KPI summary cards for invoices.
 */

import { CheckCircle, Clock, AlertCircle, Calendar } from 'lucide-react';
import { Card } from '@/components/shared/ui/Card';
import type { InvoiceSummary } from '@/lib/services/invoiceService';

interface InvoiceSummaryCardsProps {
    summary: InvoiceSummary;
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
}

export function InvoiceSummaryCards({ summary }: InvoiceSummaryCardsProps) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-muted uppercase tracking-wide">Paid</p>
                        <p className="text-xl font-bold text-success mt-1">{formatCurrency(summary.totalPaid)}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-success/10">
                        <CheckCircle className="w-5 h-5 text-success" />
                    </div>
                </div>
                <p className="text-xs text-muted mt-2">{summary.paidCount} invoices</p>
            </Card>

            <Card>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-muted uppercase tracking-wide">Pending</p>
                        <p className="text-xl font-bold text-warning mt-1">{formatCurrency(summary.totalPending)}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-warning/10">
                        <Clock className="w-5 h-5 text-warning" />
                    </div>
                </div>
                <p className="text-xs text-muted mt-2">{summary.pendingCount} invoices</p>
            </Card>

            <Card>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-muted uppercase tracking-wide">Overdue</p>
                        <p className="text-xl font-bold text-danger mt-1">{formatCurrency(summary.totalOverdue)}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-danger/10">
                        <AlertCircle className="w-5 h-5 text-danger" />
                    </div>
                </div>
                <p className="text-xs text-muted mt-2">{summary.overdueCount} invoices</p>
            </Card>

            <Card>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-muted uppercase tracking-wide">This Month</p>
                        <p className="text-xl font-bold text-primary mt-1">{formatCurrency(summary.thisMonthBilling)}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-info/10">
                        <Calendar className="w-5 h-5 text-info" />
                    </div>
                </div>
                <p className="text-xs text-muted mt-2">{summary.totalCount} total invoices</p>
            </Card>
        </div>
    );
}
