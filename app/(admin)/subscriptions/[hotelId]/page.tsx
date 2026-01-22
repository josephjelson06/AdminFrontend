'use client';

import { use } from 'react';
import Link from 'next/link';
import {
    Building2,
    MapPin,
    Calendar,
    CreditCard,
    FileText,
    Download,
    ChevronRight,
    ChevronLeft,
    CheckCircle,
    Clock,
    AlertTriangle,
    Send,
    Pause,
    ArrowUpRight,
    Shield,
    Wallet,
} from 'lucide-react';
import { MOCK_SUBSCRIPTIONS, MOCK_INVOICES } from '@/lib/admin/finance-data';
import { MOCK_HOTELS } from '@/lib/admin/mock-data';

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

function formatLongDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

function getDaysFromNow(dateStr: string): number {
    const target = new Date(dateStr).getTime();
    const now = Date.now();
    return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

function getMonthsCustomer(startDate: string): number {
    const start = new Date(startDate);
    const now = new Date();
    return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30));
}

interface PageProps {
    params: Promise<{ hotelId: string }>;
}

export default function HotelFinanceDetailPage({ params }: PageProps) {
    const { hotelId } = use(params);

    const subscription = MOCK_SUBSCRIPTIONS.find(s => s.hotelId === hotelId);
    const hotel = MOCK_HOTELS.find(h => h.id === hotelId);
    const hotelInvoices = MOCK_INVOICES.filter(inv => inv.hotelId === hotelId);

    if (!subscription || !hotel) {
        return (
            <div className="p-6">
                <div className="text-center py-12">
                    <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Hotel not found</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The requested hotel subscription could not be found.</p>
                    <Link href="/subscriptions" className="inline-flex items-center gap-2 mt-4 text-sm text-slate-600 hover:text-slate-900">
                        <ChevronLeft className="w-4 h-4" /> Back to Subscriptions
                    </Link>
                </div>
            </div>
        );
    }

    const tenure = getMonthsCustomer(subscription.startDate);
    const daysToRenewal = getDaysFromNow(subscription.contractEndDate);
    const outstandingBalance = hotelInvoices
        .filter(inv => inv.status === 'pending' || inv.status === 'overdue')
        .reduce((sum, inv) => sum + inv.totalAmount, 0);

    const statusConfig = {
        active: { label: 'Active', style: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
        suspended: { label: 'Suspended', style: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' },
        grace_period: { label: 'Grace Period', style: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
        cancelled: { label: 'Cancelled', style: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400' },
    };

    const invoiceStatusConfig = {
        paid: { icon: CheckCircle, style: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
        pending: { icon: Clock, style: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
        overdue: { icon: AlertTriangle, style: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' },
        cancelled: { icon: Clock, style: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400' },
    };

    // Mock payment history
    const paymentHistory = [
        { date: '2026-01-12', amount: 59000, status: 'success', method: 'Card •••• 4242' },
        { date: '2025-12-10', amount: 59000, status: 'success', method: 'Card •••• 4242' },
        { date: '2025-11-08', amount: 59000, status: 'success', method: 'Card •••• 4242' },
    ];

    return (
        <div className="p-4 sm:p-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm mb-4">
                <Link href="/subscriptions" className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300">
                    Subscriptions
                </Link>
                <ChevronRight className="w-4 h-4 text-slate-400" />
                <span className="font-medium text-slate-900 dark:text-white">{hotel.name}</span>
            </div>

            {/* Header */}
            <div className="flex flex-col lg:flex-row gap-6 mb-6">
                {/* Hotel Profile */}
                <div className="flex-1 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                    <div className="flex items-start gap-4">
                        <div className="p-4 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600">
                            <Building2 className="w-8 h-8 text-slate-600 dark:text-slate-300" />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-xl font-semibold text-slate-900 dark:text-white">{hotel.name}</h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                                <MapPin className="w-4 h-4" /> {hotel.location}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                                <Calendar className="w-4 h-4" /> Customer since {formatLongDate(subscription.startDate)} ({tenure} months)
                            </p>
                        </div>
                    </div>

                    {/* Status Tags */}
                    <div className="flex flex-wrap items-center gap-2 mt-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig[subscription.status].style}`}>
                            {statusConfig[subscription.status].label}
                        </span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${subscription.plan === 'advanced'
                            ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
                            : 'bg-slate-700 text-white dark:bg-slate-600'
                            }`}>
                            {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)} Plan
                        </span>
                        {subscription.paymentMethod === 'auto' && subscription.cardLast4 && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                <CreditCard className="w-4 h-4" /> Auto-pay Enabled
                            </span>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="lg:w-48 flex flex-row lg:flex-col gap-2">
                    <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium rounded-md hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors">
                        <FileText className="w-4 h-4" />
                        Generate Invoice
                    </button>
                    <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        <Send className="w-4 h-4" />
                        Send Reminder
                    </button>
                    <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        <Pause className="w-4 h-4" />
                        Pause
                    </button>
                    <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        <ArrowUpRight className="w-4 h-4" />
                        Upgrade
                    </button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Subscription Details */}
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                    <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Subscription Details</h2>
                    <dl className="space-y-3">
                        <div className="flex justify-between">
                            <dt className="text-sm text-slate-500 dark:text-slate-400">Plan</dt>
                            <dd className="text-sm font-medium text-slate-900 dark:text-white capitalize">{subscription.plan}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-sm text-slate-500 dark:text-slate-400">MRR</dt>
                            <dd className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(subscription.mrr)}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-sm text-slate-500 dark:text-slate-400">Billing Cycle</dt>
                            <dd className="text-sm font-medium text-slate-900 dark:text-white">Monthly</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-sm text-slate-500 dark:text-slate-400">Next Billing</dt>
                            <dd className="text-sm font-medium text-slate-900 dark:text-white">{formatDate(subscription.nextBillingDate)}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-sm text-slate-500 dark:text-slate-400">Contract Renewal</dt>
                            <dd className="text-sm font-medium text-slate-900 dark:text-white">
                                {formatDate(subscription.contractEndDate)}
                                {daysToRenewal <= 30 && (
                                    <span className="ml-2 text-xs text-amber-600">({daysToRenewal} days)</span>
                                )}
                            </dd>
                        </div>
                    </dl>

                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Usage vs Limits</p>
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-slate-600 dark:text-slate-300">Kiosks</span>
                            <span className="text-sm font-medium text-slate-900 dark:text-white">{hotel.kioskCount} / 5</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                            <div
                                className="bg-emerald-500 h-2 rounded-full"
                                style={{ width: `${(hotel.kioskCount / 5) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Payment Information */}
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                    <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Payment Information</h2>

                    {subscription.paymentMethod === 'auto' && subscription.cardLast4 ? (
                        <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg mb-4">
                            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
                                <CreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Auto-pay Enabled</p>
                                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                                    {subscription.cardBrand} •••• {subscription.cardLast4}
                                </p>
                            </div>
                            <span className="ml-auto text-xs text-emerald-600 dark:text-emerald-400">
                                Next: {formatDate(subscription.nextBillingDate)}
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg mb-4">
                            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-600">
                                <Wallet className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">Manual Payment</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{subscription.paymentMethod.replace('_', ' ')}</p>
                            </div>
                        </div>
                    )}

                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Recent Payments</p>
                    <div className="space-y-2">
                        {paymentHistory.map((payment, idx) => (
                            <div key={idx} className="flex items-center gap-3 py-2">
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                <div className="flex-1">
                                    <p className="text-sm text-slate-900 dark:text-white">{formatDate(payment.date)}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{payment.method}</p>
                                </div>
                                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                    {formatCurrency(payment.amount)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Invoice Ledger */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Invoice Ledger</h2>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-medium rounded-md hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors">
                        <FileText className="w-3.5 h-3.5" />
                        Generate Invoice
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Invoice</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Date</th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Amount</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Status</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Due Date</th>
                                <th className="text-center px-6 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {hotelInvoices.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                                        No invoices found for this hotel.
                                    </td>
                                </tr>
                            ) : (
                                hotelInvoices.map((invoice) => {
                                    const StatusIcon = invoiceStatusConfig[invoice.status].icon;
                                    return (
                                        <tr key={invoice.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                            <td className="px-6 py-3">
                                                <span className="text-sm font-mono font-medium text-slate-900 dark:text-white">
                                                    {invoice.invoiceNumber}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3">
                                                <span className="text-sm text-slate-700 dark:text-slate-300">
                                                    {formatDate(invoice.issueDate)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-right">
                                                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                                    {formatCurrency(invoice.totalAmount)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium capitalize ${invoiceStatusConfig[invoice.status].style}`}>
                                                    <StatusIcon className="w-3 h-3" />
                                                    {invoice.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3">
                                                <span className="text-sm text-slate-700 dark:text-slate-300">
                                                    {formatDate(invoice.dueDate)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-center">
                                                <button className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                                    <Download className="w-4 h-4 text-slate-500" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {outstandingBalance > 0 && (
                    <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-rose-50 dark:bg-rose-900/20">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-rose-900 dark:text-rose-100">Outstanding Balance</span>
                            <span className="text-lg font-bold text-rose-600 dark:text-rose-400">{formatCurrency(outstandingBalance)}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Contract Documents */}
            <div className="mt-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Contract Documents</h2>
                <div className="space-y-2">
                    {[
                        { name: 'Service Agreement (Signed)', date: subscription.startDate },
                        { name: 'Hardware Lease Agreement', date: subscription.startDate },
                        { name: 'AMC Terms', date: subscription.startDate },
                    ].map((doc, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                            <FileText className="w-5 h-5 text-slate-500" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-slate-900 dark:text-white">{doc.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Signed on {formatDate(doc.date)}</p>
                            </div>
                            <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md transition-colors">
                                <Download className="w-3.5 h-3.5" />
                                Download
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
