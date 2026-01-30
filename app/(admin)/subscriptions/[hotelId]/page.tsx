'use client';

import { use, useState, useEffect } from 'react';
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
    Wallet,
    Loader2,
} from 'lucide-react';
import { hotelService } from '@/lib/services/hotelService';
import { subscriptionService } from '@/lib/services/subscriptionService';
import { invoiceService } from '@/lib/services/invoiceService';
import { useToast } from '@/components/shared/ui/Toast';
import type { Hotel } from '@/types/schema';
import type { HotelSubscription, Invoice } from '@/types/finance';

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
    const { addToast } = useToast();

    const [isLoading, setIsLoading] = useState(true);
    const [hotel, setHotel] = useState<Hotel | null>(null);
    const [subscription, setSubscription] = useState<HotelSubscription | null>(null);
    const [invoices, setInvoices] = useState<Invoice[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [hotelRes, subRes, invoicesRes] = await Promise.all([
                    hotelService.get(hotelId),
                    subscriptionService.get(hotelId),
                    invoiceService.list({ hotelId }),
                ]);

                if (hotelRes.success && hotelRes.data) {
                    setHotel(hotelRes.data);
                }
                if (subRes.success && subRes.data) {
                    setSubscription(subRes.data);
                }
                if (invoicesRes.data) {
                    setInvoices(invoicesRes.data);
                }
            } catch (error) {
                console.error('Failed to fetch finance details:', error);
                addToast('error', 'Error', 'Failed to load subscription details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [hotelId, addToast]);

    if (isLoading) {
        return (
            <div className="h-96 flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                <p className="text-muted">Loading subscription details...</p>
            </div>
        );
    }

    if (!subscription || !hotel) {
        return (
            <div className="p-6">
                <div className="text-center py-12 surface-glass-strong rounded-lg border border-glass">
                    <Building2 className="w-12 h-12 text-muted mx-auto mb-4" />
                    <h2 className="text-lg font-semibold text-primary">Hotel not found</h2>
                    <p className="text-sm text-muted mt-1">The requested hotel subscription could not be found.</p>
                    <Link href="/subscriptions" className="inline-flex items-center gap-2 mt-4 text-sm text-secondary-text hover:text-primary">
                        <ChevronLeft className="w-4 h-4" /> Back to Subscriptions
                    </Link>
                </div>
            </div>
        );
    }

    const tenure = getMonthsCustomer(subscription.startDate);
    const daysToRenewal = getDaysFromNow(subscription.contractEndDate);
    const outstandingBalance = invoices
        .filter(inv => inv.status === 'pending' || inv.status === 'overdue')
        .reduce((sum, inv) => sum + inv.totalAmount, 0);

    const statusConfig = {
        active: { label: 'Active', style: 'badge-success' },
        suspended: { label: 'Suspended', style: 'badge-danger' },
        grace_period: { label: 'Grace Period', style: 'badge-warning' },
        cancelled: { label: 'Cancelled', style: 'badge-default' },
    };

    const invoiceStatusConfig = {
        paid: { icon: CheckCircle, style: 'badge-success' },
        pending: { icon: Clock, style: 'badge-warning' },
        overdue: { icon: AlertTriangle, style: 'badge-danger' },
        cancelled: { icon: Clock, style: 'badge-default' },
    };

    // Mock payment history (keep internal until API endpoint exists)
    const paymentHistory = [
        { date: '2026-01-12', amount: 59000, status: 'success', method: 'Card •••• 4242' },
        { date: '2025-12-10', amount: 59000, status: 'success', method: 'Card •••• 4242' },
        { date: '2025-11-08', amount: 59000, status: 'success', method: 'Card •••• 4242' },
    ];

    return (
        <div className="p-4 sm:p-6 animate-in fade-in duration-normal">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm mb-4">
                <Link href="/subscriptions" className="text-muted hover:text-secondary-text">
                    Subscriptions
                </Link>
                <ChevronRight className="w-4 h-4 text-muted" />
                <span className="font-medium text-primary">{hotel.name}</span>
            </div>

            {/* Header */}
            <div className="flex flex-col lg:flex-row gap-6 mb-6">
                {/* Hotel Profile */}
                <div className="flex-1 surface-glass-strong rounded-lg border border-glass p-6">
                    <div className="flex items-start gap-4">
                        <div className="p-4 rounded-xl surface-glass-soft">
                            <Building2 className="w-8 h-8 text-muted" />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-xl font-semibold text-primary">{hotel.name}</h1>
                            <p className="text-sm text-muted flex items-center gap-1 mt-1">
                                <MapPin className="w-4 h-4" /> {hotel.location}
                            </p>
                            <p className="text-sm text-muted flex items-center gap-1 mt-1">
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
                            ? 'bg-gradient-to-r from-warning to-warning/80 text-inverse'
                            : 'surface-glass-soft text-secondary-text'
                            }`}>
                            {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)} Plan
                        </span>
                        {subscription.paymentMethod === 'auto' && subscription.cardLast4 && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium badge-success">
                                <CreditCard className="w-4 h-4" /> Auto-pay Enabled
                            </span>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="lg:w-48 flex flex-row lg:flex-col gap-2">
                    <button className="flex-1 lg:flex-none btn-primary justify-center">
                        <FileText className="w-4 h-4" />
                        Generate Invoice
                    </button>
                    <button className="flex-1 lg:flex-none btn-secondary justify-center">
                        <Send className="w-4 h-4" />
                        Send Reminder
                    </button>
                    <button className="flex-1 lg:flex-none btn-secondary justify-center">
                        <Pause className="w-4 h-4" />
                        Pause
                    </button>
                    <button className="flex-1 lg:flex-none btn-secondary justify-center">
                        <ArrowUpRight className="w-4 h-4" />
                        Upgrade
                    </button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Subscription Details */}
                <div className="surface-glass-strong rounded-lg border border-glass p-6">
                    <h2 className="text-sm font-semibold text-primary mb-4">Subscription Details</h2>
                    <dl className="space-y-3">
                        <div className="flex justify-between">
                            <dt className="text-sm text-muted">Plan</dt>
                            <dd className="text-sm font-medium text-primary capitalize">{subscription.plan}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-sm text-muted">MRR</dt>
                            <dd className="text-sm font-semibold text-success">{formatCurrency(subscription.mrr)}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-sm text-muted">Billing Cycle</dt>
                            <dd className="text-sm font-medium text-primary">Monthly</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-sm text-muted">Next Billing</dt>
                            <dd className="text-sm font-medium text-primary">{formatDate(subscription.nextBillingDate)}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-sm text-muted">Contract Renewal</dt>
                            <dd className="text-sm font-medium text-primary">
                                {formatDate(subscription.contractEndDate)}
                                {daysToRenewal <= 30 && (
                                    <span className="ml-2 text-xs text-warning">({daysToRenewal} days)</span>
                                )}
                            </dd>
                        </div>
                    </dl>

                    <div className="mt-4 pt-4 border-t border-glass">
                        <p className="text-xs font-medium text-muted uppercase tracking-wide mb-2">Usage vs Limits</p>
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-secondary-text">Kiosks</span>
                            <span className="text-sm font-medium text-primary">{hotel.kioskCount} / 5</span>
                        </div>
                        <div className="w-full surface-glass-soft rounded-full h-2">
                            <div
                                className="bg-success h-2 rounded-full"
                                style={{ width: `${(hotel.kioskCount / 5) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Payment Information */}
                <div className="surface-glass-strong rounded-lg border border-glass p-6">
                    <h2 className="text-sm font-semibold text-primary mb-4">Payment Information</h2>

                    {subscription.paymentMethod === 'auto' && subscription.cardLast4 ? (
                        <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg mb-4">
                            <div className="p-2 rounded-lg bg-success/20">
                                <CreditCard className="w-5 h-5 text-success" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-success">Auto-pay Enabled</p>
                                <p className="text-xs text-success/80">
                                    {subscription.cardBrand} •••• {subscription.cardLast4}
                                </p>
                            </div>
                            <span className="ml-auto text-xs text-success">
                                Next: {formatDate(subscription.nextBillingDate)}
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 p-3 surface-glass-soft rounded-lg mb-4">
                            <div className="p-2 rounded-lg surface-glass-soft">
                                <Wallet className="w-5 h-5 text-muted" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-primary">Manual Payment</p>
                                <p className="text-xs text-muted capitalize">{subscription.paymentMethod.replace('_', ' ')}</p>
                            </div>
                        </div>
                    )}

                    <p className="text-xs font-medium text-muted uppercase tracking-wide mb-2">Recent Payments</p>
                    <div className="space-y-2">
                        {paymentHistory.map((payment, idx) => (
                            <div key={idx} className="flex items-center gap-3 py-2">
                                <CheckCircle className="w-4 h-4 text-success" />
                                <div className="flex-1">
                                    <p className="text-sm text-primary">{formatDate(payment.date)}</p>
                                    <p className="text-xs text-muted">{payment.method}</p>
                                </div>
                                <span className="text-sm font-medium text-success">
                                    {formatCurrency(payment.amount)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Invoice Ledger */}
            <div className="surface-glass-strong rounded-lg border border-glass">
                <div className="px-6 py-4 border-b border-glass flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-primary">Invoice Ledger</h2>
                    <button className="btn-primary text-xs py-1.5 px-3">
                        <FileText className="w-3.5 h-3.5" />
                        Generate Invoice
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="table-glass">
                        <thead>
                            <tr className="surface-glass-soft border-b border-glass">
                                <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Invoice</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Date</th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Amount</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Status</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Due Date</th>
                                <th className="text-center px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-glass">
                            {invoices.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-muted">
                                        No invoices found for this hotel.
                                    </td>
                                </tr>
                            ) : (
                                invoices.map((invoice) => {
                                    const StatusIcon = invoiceStatusConfig[invoice.status].icon;
                                    return (
                                        <tr key={invoice.id} className="glass-hover">
                                            <td className="px-6 py-3">
                                                <span className="text-sm font-mono font-medium text-primary">
                                                    {invoice.invoiceNumber}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3">
                                                <span className="text-sm text-secondary-text">
                                                    {formatDate(invoice.issueDate)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-right">
                                                <span className="text-sm font-semibold text-primary">
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
                                                <span className="text-sm text-secondary-text">
                                                    {formatDate(invoice.dueDate)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-center">
                                                <button className="p-2 rounded-md glass-hover transition-colors">
                                                    <Download className="w-4 h-4 text-muted" />
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
                    <div className="px-6 py-4 border-t border-glass bg-danger/10">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-danger">Outstanding Balance</span>
                            <span className="text-lg font-bold text-danger">{formatCurrency(outstandingBalance)}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Contract Documents */}
            <div className="mt-6 surface-glass-strong rounded-lg border border-glass p-6">
                <h2 className="text-sm font-semibold text-primary mb-4">Contract Documents</h2>
                <div className="space-y-2">
                    {[
                        { name: 'Service Agreement (Signed)', date: subscription.startDate },
                        { name: 'Hardware Lease Agreement', date: subscription.startDate },
                        { name: 'AMC Terms', date: subscription.startDate },
                    ].map((doc, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 surface-glass-soft rounded-lg">
                            <FileText className="w-5 h-5 text-muted" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-primary">{doc.name}</p>
                                <p className="text-xs text-muted">Signed on {formatDate(doc.date)}</p>
                            </div>
                            <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-secondary-text glass-hover rounded-md transition-colors">
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
