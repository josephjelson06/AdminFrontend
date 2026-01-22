'use client';

import { useState } from 'react';
import { HotelLayout } from '@/components/hotel/layout/HotelLayout';
import {
    CreditCard,
    Download,
    Calendar,
    Check,
    Clock,
    AlertCircle,
    ExternalLink,
    X,
    FileText,
    Sparkles,
    Zap,
    Crown,
} from 'lucide-react';
import { MOCK_HOTEL_PROFILE, MOCK_INVOICES, Invoice } from '@/lib/hotel/hotel-data';
import { useToast } from '@/components/shared/ui/Toast';

function StatusBadge({ status }: { status: string }) {
    const config = {
        paid: { icon: Check, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
        pending: { icon: Clock, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
        overdue: { icon: AlertCircle, color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' },
    };

    const { icon: Icon, color } = config[status as keyof typeof config] || config.pending;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${color}`}>
            <Icon className="w-3.5 h-3.5" />
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}

// Plan Features
const PLAN_FEATURES: Record<string, { icon: React.ElementType; features: string[] }> = {
    standard: {
        icon: Zap,
        features: ['Up to 50 rooms', '1 Kiosk', '2 Languages', 'Email support']
    },
    advanced: {
        icon: Sparkles,
        features: ['Up to 200 rooms', '3 Kiosks', '4 Languages', 'Priority support']
    },
    enterprise: {
        icon: Crown,
        features: ['Unlimited rooms', 'Unlimited Kiosks', 'All languages', '24/7 support']
    },
};

// Invoice Detail Modal
function InvoiceModal({
    invoice,
    onClose,
    onDownload,
}: {
    invoice: Invoice | null;
    onClose: () => void;
    onDownload: () => void;
}) {
    if (!invoice) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
                            <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{invoice.id}</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{invoice.period}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                    {/* Amount */}
                    <div className="text-center py-4">
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Invoice Amount</p>
                        <p className="text-4xl font-bold text-slate-900 dark:text-white">
                            ₹{invoice.amount.toLocaleString('en-IN')}
                        </p>
                        <div className="mt-2">
                            <StatusBadge status={invoice.status} />
                        </div>
                    </div>

                    {/* Details */}
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 space-y-3">
                        <div className="flex justify-between">
                            <span className="text-sm text-slate-500 dark:text-slate-400">Invoice Number</span>
                            <span className="text-sm font-mono text-slate-900 dark:text-white">{invoice.id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-slate-500 dark:text-slate-400">Billing Period</span>
                            <span className="text-sm text-slate-900 dark:text-white">{invoice.period}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-slate-500 dark:text-slate-400">Issue Date</span>
                            <span className="text-sm text-slate-900 dark:text-white">
                                {new Date(invoice.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-slate-500 dark:text-slate-400">Plan</span>
                            <span className="text-sm text-slate-900 dark:text-white capitalize">{MOCK_HOTEL_PROFILE.plan}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-slate-200 dark:border-slate-700 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                        Close
                    </button>
                    <button
                        onClick={onDownload}
                        className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Download PDF
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function BillingPage() {
    const { addToast } = useToast();
    const profile = MOCK_HOTEL_PROFILE;
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [isDownloading, setIsDownloading] = useState<string | null>(null);

    // Calculate days until expiry
    const expiryDate = new Date(profile.planExpiry);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    const handleDownloadInvoice = async (invoice: Invoice) => {
        setIsDownloading(invoice.id);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsDownloading(null);
        addToast('success', 'Downloaded', `Invoice ${invoice.id} downloaded`);
        if (selectedInvoice) {
            setSelectedInvoice(null);
        }
    };

    const planInfo = PLAN_FEATURES[profile.plan] || PLAN_FEATURES.standard;
    const PlanIcon = planInfo.icon;

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
                <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                    <PlanIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-indigo-200 text-sm">Current Plan</p>
                                    <h2 className="text-2xl font-bold capitalize">{profile.plan} Plan</h2>
                                </div>
                            </div>
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-sm ${daysUntilExpiry > 30 ? 'bg-white/20' : 'bg-amber-500/30'
                                }`}>
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                    {daysUntilExpiry > 0 ? `Renews in ${daysUntilExpiry} days` : 'Expired'}
                                </span>
                            </div>
                        </div>

                        {/* Plan Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                                <p className="text-indigo-200 text-xs mb-1">Rooms Included</p>
                                <p className="text-xl font-bold">{profile.totalRooms}</p>
                            </div>
                            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                                <p className="text-indigo-200 text-xs mb-1">Kiosks Allocated</p>
                                <p className="text-xl font-bold">{profile.kiosksAllocated}</p>
                            </div>
                            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                                <p className="text-indigo-200 text-xs mb-1">Monthly Fee</p>
                                <p className="text-xl font-bold">₹25,000</p>
                            </div>
                            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                                <p className="text-indigo-200 text-xs mb-1">Valid Until</p>
                                <p className="text-xl font-bold">{new Date(profile.planExpiry).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</p>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="flex flex-wrap gap-2">
                            {planInfo.features.map((feature, i) => (
                                <span key={i} className="px-3 py-1.5 bg-white/10 rounded-full text-xs font-medium backdrop-blur-sm flex items-center gap-1.5">
                                    <Check className="w-3.5 h-3.5" />
                                    {feature}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => addToast('info', 'Contact Sales', 'Opening support portal...')}
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
                                {MOCK_INVOICES.map((invoice, index) => (
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
                                                disabled={isDownloading === invoice.id}
                                                className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                {isDownloading === invoice.id ? (
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
                        <span className="font-semibold">💡 Payment Method:</span> Your invoices are generated monthly and sent to <span className="font-medium text-slate-900 dark:text-white">{profile.email}</span>.
                        Contact ATC support if you need to update billing preferences.
                    </p>
                </div>
            </div>


            {/* Invoice Detail Modal */}
            <InvoiceModal
                invoice={selectedInvoice}
                onClose={() => setSelectedInvoice(null)}
                onDownload={() => selectedInvoice && handleDownloadInvoice(selectedInvoice)}
            />
        </HotelLayout >
    );
}


