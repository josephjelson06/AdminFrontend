'use client';

/**
 * Invoice Modal Component
 * 
 * Displays invoice details with download option.
 */

import { X, Download, FileText } from 'lucide-react';
import type { Invoice } from '@/lib/hotel/hotel-data';
import { StatusBadge } from './StatusBadge';

interface InvoiceModalProps {
    invoice: Invoice | null;
    onClose: () => void;
    onDownload: () => void;
    planName?: string;
}

export function InvoiceModal({ invoice, onClose, onDownload, planName = 'standard' }: InvoiceModalProps) {
    if (!invoice) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />
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
                                {new Date(invoice.date).toLocaleDateString('en-IN', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                })}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-slate-500 dark:text-slate-400">Plan</span>
                            <span className="text-sm text-slate-900 dark:text-white capitalize">{planName}</span>
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
