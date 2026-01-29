'use client';

/**
 * HotelBillingManager Component
 * 
 * Main billing management component.
 */

import { useState } from 'react';
import { CreditCard, Download, ExternalLink } from 'lucide-react';
import { HotelLayout } from '@/components/hotel/layout/HotelLayout';
import { useHotelBilling } from './useHotelBilling';
import { CurrentPlanCard } from './CurrentPlanCard';
import { InvoiceModal } from './InvoiceModal';
import { StatusBadge } from './StatusBadge';
import { useToast } from '@/components/shared/ui/Toast';
import type { Invoice } from '@/lib/hotel/hotel-data';

export function HotelBillingManager() {
    const { addToast } = useToast();
    const {
        profile,
        invoices,
        daysUntilExpiry,
        planFeatures,
        downloadInvoice,
        contactSales,
        isLoading,
        downloadingId,
    } = useHotelBilling();

    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

    const handleDownloadInvoice = async (invoice: Invoice) => {
        const success = await downloadInvoice(invoice.id);
        if (success) {
            addToast('success', 'Downloaded', `Invoice ${invoice.id} downloaded`);
            if (selectedInvoice) {
                setSelectedInvoice(null);
            }
        }
    };

    const handleContactSales = async () => {
        await contactSales();
        addToast('info', 'Contact Sales', 'Opening support portal...');
    };

    if (isLoading || !profile) {
        return (
            <HotelLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
                </div>
            </HotelLayout>
        );
    }

    return (
        <HotelLayout>
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Subscription & Billing</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    View your plan details and invoice history
                </p>
            </div>

            <div className="space-y-6">
                {/* Current Plan Card */}
                <CurrentPlanCard
                    profile={profile}
                    daysUntilExpiry={daysUntilExpiry}
                    planFeatures={planFeatures}
                />

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={handleContactSales}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:shadow-lg"
                    >
                        <ExternalLink className="w-4 h-4" />
                        Contact Sales to Upgrade
                    </button>
                </div>

                {/* Invoice History */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="p-5 border-b border-slate-200 dark:border-slate-700">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-slate-400" />
                            Invoice History
                        </h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Invoice
                                    </th>
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:table-cell">
                                        Period
                                    </th>
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {invoices.map((invoice, index) => (
                                    <tr
                                        key={invoice.id}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors animate-in fade-in"
                                        style={{ animationDelay: `${index * 30}ms` }}
                                        onClick={() => setSelectedInvoice(invoice)}
                                    >
                                        <td className="px-5 py-4">
                                            <span className="text-sm font-medium text-slate-900 dark:text-white font-mono">
                                                {invoice.id}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 hidden sm:table-cell">
                                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                                {invoice.period}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                                ₹{invoice.amount.toLocaleString('en-IN')}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <StatusBadge status={invoice.status} />
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDownloadInvoice(invoice);
                                                }}
                                                disabled={downloadingId === invoice.id}
                                                className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                {downloadingId === invoice.id ? (
                                                    <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                                                ) : (
                                                    <Download className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Payment Info */}
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        <span className="font-semibold">💡 Payment Method:</span> Your invoices are generated monthly and sent to{' '}
                        <span className="font-medium text-slate-900 dark:text-white">{profile.email}</span>.
                        Contact ATC support if you need to update billing preferences.
                    </p>
                </div>
            </div>

            {/* Invoice Detail Modal */}
            <InvoiceModal
                invoice={selectedInvoice}
                onClose={() => setSelectedInvoice(null)}
                onDownload={() => selectedInvoice && handleDownloadInvoice(selectedInvoice)}
                planName={profile.plan}
            />
        </HotelLayout>
    );
}
