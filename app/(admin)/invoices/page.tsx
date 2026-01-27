'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
    FileText,
    Calendar,
    IndianRupee,
    Download,
    CheckCircle,
    Clock,
    AlertCircle,
    Search,
    Plus,
    ChevronRight,
    ChevronLeft,
    ChevronDown,
    X,
    Building2,
    CreditCard,
    MoreVertical,
    Send,
    Check,
} from 'lucide-react';
import { MOCK_INVOICES } from '@/lib/admin/finance-data';
import type { Invoice } from '@/types/finance';
import { Dropdown, DropdownItem } from '@/components/shared/ui/Dropdown';
import { useToast } from '@/components/shared/ui/Toast';

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

function StatusBadge({ status }: { status: Invoice['status'] }) {
    const config: Record<Invoice['status'], { icon: typeof CheckCircle; style: string; label: string }> = {
        paid: { icon: CheckCircle, style: 'badge-success', label: 'Paid' },
        pending: { icon: Clock, style: 'badge-warning', label: 'Pending' },
        overdue: { icon: AlertCircle, style: 'badge-danger', label: 'Overdue' },
        cancelled: { icon: X, style: 'badge-default', label: 'Cancelled' },
    };

    const { icon: Icon, style, label } = config[status];

    return (
        <span className={`inline-flex items-center gap-1 ${style}`}>
            <Icon className="w-3 h-3" />
            {label}
        </span>
    );
}

// Export Dropdown Component
function ExportDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { addToast } = useToast();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleExport = (format: 'pdf' | 'excel') => {
        addToast('info', 'Exporting...', `Generating ${format.toUpperCase()} export...`);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 surface-glass-soft border border-glass text-sm text-secondary-text rounded-xl glass-hover transition-all duration-fast"
            >
                <Download className="w-4 h-4" />
                Export
                <ChevronDown className={`w-4 h-4 transition-transform duration-fast ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-1 w-40 surface-glass-strong border border-glass rounded-xl shadow-elevated z-50">
                    <button
                        onClick={() => handleExport('pdf')}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-secondary-text glass-hover rounded-t-xl transition-all duration-fast"
                    >
                        <FileText className="w-4 h-4" />
                        Export as PDF
                    </button>
                    <button
                        onClick={() => handleExport('excel')}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-secondary-text glass-hover rounded-b-xl transition-all duration-fast"
                    >
                        <FileText className="w-4 h-4" />
                        Export as Excel
                    </button>
                </div>
            )}
        </div>
    );
}

// New Invoice Modal Component
function NewInvoiceModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: any) => void }) {
    const [hotelName, setHotelName] = useState('');
    const [amount, setAmount] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ hotelName, amount: parseFloat(amount), dueDate, description });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="relative w-full max-w-md surface-glass-strong rounded-2xl shadow-elevated">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-glass flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-primary">Create New Invoice</h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg glass-hover transition-all duration-fast"
                        >
                            <X className="w-5 h-5 text-muted" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-secondary-text mb-1">
                                Hotel
                            </label>
                            <select
                                value={hotelName}
                                onChange={(e) => setHotelName(e.target.value)}
                                required
                                className="input-glass"
                            >
                                <option value="">Select a hotel...</option>
                                <option value="Royal Orchid Bangalore">Royal Orchid Bangalore</option>
                                <option value="Lemon Tree Premier">Lemon Tree Premier</option>
                                <option value="Ginger Hotel, Panjim">Ginger Hotel, Panjim</option>
                                <option value="Taj Palace">Taj Palace</option>
                                <option value="ITC Maratha">ITC Maratha</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary-text mb-1">
                                Amount (₹)
                            </label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                                min="1"
                                placeholder="Enter amount"
                                className="input-glass"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary-text mb-1">
                                Due Date
                            </label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                required
                                className="input-glass"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary-text mb-1">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                placeholder="Invoice description or notes..."
                                className="input-glass resize-none"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn-secondary flex-1"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn-primary flex-1"
                            >
                                Create Invoice
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

// Pagination Footer Component
function PaginationFooter({
    currentPage,
    totalPages,
    rowsPerPage,
    totalItems,
    onPageChange,
    onRowsPerPageChange,
}: {
    currentPage: number;
    totalPages: number;
    rowsPerPage: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onRowsPerPageChange: (rows: number) => void;
}) {
    const startItem = (currentPage - 1) * rowsPerPage + 1;
    const endItem = Math.min(currentPage * rowsPerPage, totalItems);

    return (
        <div className="px-4 py-3 border-t border-glass flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
                <span className="text-sm text-muted">Rows per page:</span>
                <select
                    value={rowsPerPage}
                    onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
                    className="input-glass !w-auto !py-1"
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                </select>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-sm text-muted">
                    {totalItems > 0 ? `${startItem}–${endItem} of ${totalItems}` : '0 items'}
                </span>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-1.5 rounded-lg glass-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-fast"
                    >
                        <ChevronLeft className="w-4 h-4 text-muted" />
                    </button>
                    <span className="px-2 text-sm text-secondary-text">
                        {currentPage} / {totalPages || 1}
                    </span>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="p-1.5 rounded-lg glass-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-fast"
                    >
                        <ChevronRight className="w-4 h-4 text-muted" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function InvoicesPage() {
    const { addToast } = useToast();
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | Invoice['status']>('all');
    const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
    const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Action handlers
    const handleMarkAsPaid = (invoice: Invoice) => {
        setInvoices(prev => prev.map(inv =>
            inv.id === invoice.id
                ? { ...inv, status: 'paid', paidDate: new Date().toISOString() }
                : inv
        ));
        addToast('success', 'Payment Recorded', `Invoice ${invoice.invoiceNumber} marked as paid.`);
    };

    const handleSendReminder = (invoice: Invoice) => {
        addToast('info', 'Reminder Sent', `Payment reminder sent for ${invoice.invoiceNumber}.`);
    };

    const handleCreateInvoice = (data: any) => {
        addToast('success', 'Invoice Created', `New invoice created for ${data.hotelName}.`);
    };

    // Summary calculations
    const totalPaid = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.totalAmount, 0);
    const totalPending = invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.totalAmount, 0);
    const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.totalAmount, 0);
    const thisMonthBilling = invoices.reduce((sum, i) => sum + i.totalAmount, 0);

    // Filter invoices
    const filteredInvoices = invoices
        .filter(inv => {
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return inv.hotelName.toLowerCase().includes(query) || inv.invoiceNumber.toLowerCase().includes(query);
            }
            return true;
        })
        .filter(inv => statusFilter === 'all' || inv.status === statusFilter);

    // Pagination
    const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / rowsPerPage));
    const paginatedInvoices = filteredInvoices.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter, rowsPerPage]);

    return (
        <div className="p-4 sm:p-6 animate-in fade-in duration-normal">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl font-semibold text-primary">Invoice Management</h1>
                    <p className="text-sm text-muted">Manage billing and payment records</p>
                </div>
                <div className="flex items-center gap-3">
                    <ExportDropdown />
                    <button
                        onClick={() => setShowNewInvoiceModal(true)}
                        className="btn-primary"
                    >
                        <Plus className="w-4 h-4" />
                        New Invoice
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <div className="surface-glass-strong rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-muted uppercase tracking-wide">Paid</p>
                            <p className="text-xl font-bold text-success mt-1">{formatCurrency(totalPaid)}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-success/10">
                            <CheckCircle className="w-5 h-5 text-success" />
                        </div>
                    </div>
                    <p className="text-xs text-muted mt-2">
                        {invoices.filter(i => i.status === 'paid').length} invoices
                    </p>
                </div>

                <div className="surface-glass-strong rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-muted uppercase tracking-wide">Pending</p>
                            <p className="text-xl font-bold text-warning mt-1">{formatCurrency(totalPending)}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-warning/10">
                            <Clock className="w-5 h-5 text-warning" />
                        </div>
                    </div>
                    <p className="text-xs text-muted mt-2">
                        {invoices.filter(i => i.status === 'pending').length} invoices
                    </p>
                </div>

                <div className="surface-glass-strong rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-muted uppercase tracking-wide">Overdue</p>
                            <p className="text-xl font-bold text-danger mt-1">{formatCurrency(totalOverdue)}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-danger/10">
                            <AlertCircle className="w-5 h-5 text-danger" />
                        </div>
                    </div>
                    <p className="text-xs text-muted mt-2">
                        {invoices.filter(i => i.status === 'overdue').length} invoices
                    </p>
                </div>

                <div className="surface-glass-strong rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-muted uppercase tracking-wide">This Month</p>
                            <p className="text-xl font-bold text-primary mt-1">{formatCurrency(thisMonthBilling)}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-info/10">
                            <Calendar className="w-5 h-5 text-info" />
                        </div>
                    </div>
                    <p className="text-xs text-muted mt-2">
                        {invoices.length} total invoices
                    </p>
                </div>
            </div>

            {/* Invoices Table */}
            <div className="surface-glass-strong rounded-2xl shadow-glass">
                {/* Filters */}
                <div className="px-4 py-3 border-b border-glass flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                        <input
                            type="text"
                            placeholder="Search invoices..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-glass pl-10"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                        className="input-glass !w-auto"
                    >
                        <option value="all">All Status</option>
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                        <option value="overdue">Overdue</option>
                    </select>
                </div>

                {/* Table */}
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
                            {paginatedInvoices.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted">
                                        No invoices found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                paginatedInvoices.map((invoice) => (
                                    <tr
                                        key={invoice.id}
                                        className="glass-hover cursor-pointer transition-all duration-fast"
                                        onClick={() => setSelectedInvoice(invoice)}
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
                                            <StatusBadge status={invoice.status} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1.5 text-sm text-secondary-text">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {formatDate(invoice.dueDate)}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-center gap-1">
                                                {/* Mark as Paid - primary action for pending/overdue */}
                                                {(invoice.status === 'pending' || invoice.status === 'overdue') && (
                                                    <button
                                                        onClick={() => handleMarkAsPaid(invoice)}
                                                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-success bg-success/10 border border-success/20 rounded-lg hover:bg-success/20 transition-all duration-fast"
                                                    >
                                                        <Check className="w-3 h-3" />
                                                        Mark Paid
                                                    </button>
                                                )}
                                                {/* Overflow menu */}
                                                <Dropdown
                                                    trigger={
                                                        <button className="p-1.5 glass-hover rounded-lg transition-all duration-fast">
                                                            <MoreVertical className="w-4 h-4 text-muted" />
                                                        </button>
                                                    }
                                                    align="right"
                                                >
                                                    <DropdownItem onClick={() => setSelectedInvoice(invoice)}>
                                                        <FileText className="w-4 h-4 mr-2" />
                                                        View Details
                                                    </DropdownItem>
                                                    <DropdownItem onClick={() => addToast('info', 'Downloading...', `Downloading ${invoice.invoiceNumber}.pdf`)}>
                                                        <Download className="w-4 h-4 mr-2" />
                                                        Download PDF
                                                    </DropdownItem>
                                                    {invoice.status !== 'paid' && (
                                                        <DropdownItem onClick={() => handleSendReminder(invoice)}>
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

                {/* Pagination Footer */}
                <PaginationFooter
                    currentPage={currentPage}
                    totalPages={totalPages}
                    rowsPerPage={rowsPerPage}
                    totalItems={filteredInvoices.length}
                    onPageChange={setCurrentPage}
                    onRowsPerPageChange={setRowsPerPage}
                />
            </div>

            {/* New Invoice Modal */}
            {showNewInvoiceModal && (
                <NewInvoiceModal
                    onClose={() => setShowNewInvoiceModal(false)}
                    onSubmit={handleCreateInvoice}
                />
            )}

            {/* Invoice Detail Slide-over */}
            {selectedInvoice && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedInvoice(null)} />
                    <div className="absolute inset-y-0 right-0 w-full max-w-md surface-glass-strong shadow-elevated">
                        <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className="px-6 py-4 border-b border-glass flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-primary">
                                    {selectedInvoice.invoiceNumber}
                                </h2>
                                <button
                                    onClick={() => setSelectedInvoice(null)}
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
                                        <p className="text-sm font-medium text-primary">{selectedInvoice.hotelName}</p>
                                        <Link
                                            href={`/subscriptions/${selectedInvoice.hotelId}`}
                                            className="text-xs text-info hover:underline"
                                        >
                                            View subscription →
                                        </Link>
                                    </div>
                                </div>

                                {/* Invoice Meta */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-500 dark:text-slate-400">Issue Date</span>
                                        <span className="text-sm font-medium text-slate-900 dark:text-white">{formatDate(selectedInvoice.issueDate)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-500 dark:text-slate-400">Due Date</span>
                                        <span className="text-sm font-medium text-slate-900 dark:text-white">{formatDate(selectedInvoice.dueDate)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-500 dark:text-slate-400">Status</span>
                                        <StatusBadge status={selectedInvoice.status} />
                                    </div>
                                </div>

                                {/* Line Items */}
                                <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mb-4">
                                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Line Items</h3>
                                    <div className="space-y-2">
                                        {selectedInvoice.lineItems.map((item, idx) => (
                                            <div key={idx} className="flex justify-between py-2">
                                                <div>
                                                    <p className="text-sm text-slate-900 dark:text-white">{item.description}</p>
                                                    {item.quantity > 1 && (
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                            {item.quantity} x {formatCurrency(item.unitPrice)}
                                                        </p>
                                                    )}
                                                </div>
                                                <span className="text-sm font-medium text-slate-900 dark:text-white">{formatCurrency(item.amount)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Totals */}
                                <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-500 dark:text-slate-400">Subtotal</span>
                                        <span className="text-sm text-slate-900 dark:text-white">{formatCurrency(selectedInvoice.amount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-500 dark:text-slate-400">GST (18%)</span>
                                        <span className="text-sm text-slate-900 dark:text-white">{formatCurrency(selectedInvoice.taxAmount)}</span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">Total</span>
                                        <span className="text-lg font-bold text-slate-900 dark:text-white">{formatCurrency(selectedInvoice.totalAmount)}</span>
                                    </div>
                                </div>

                                {/* Payment Timeline */}
                                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Payment Timeline</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-slate-400" />
                                            <span className="text-xs text-slate-500 dark:text-slate-400">{formatDate(selectedInvoice.issueDate)} - Invoice generated</span>
                                        </div>
                                        {selectedInvoice.paidDate ? (
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                <span className="text-xs text-emerald-600 dark:text-emerald-400">{formatDate(selectedInvoice.paidDate)} - Payment received</span>
                                            </div>
                                        ) : selectedInvoice.status === 'overdue' ? (
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-rose-500" />
                                                <span className="text-xs text-rose-600 dark:text-rose-400">{formatDate(selectedInvoice.dueDate)} - Due date passed</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-amber-500" />
                                                <span className="text-xs text-amber-600 dark:text-amber-400">Due on {formatDate(selectedInvoice.dueDate)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Record Payment Section */}
                                {selectedInvoice.status !== 'paid' && (
                                    <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Record Payment</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Amount</label>
                                                <input
                                                    type="text"
                                                    defaultValue={formatCurrency(selectedInvoice.totalAmount)}
                                                    className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Payment Method</label>
                                                <select className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md text-sm">
                                                    <option>Bank Transfer</option>
                                                    <option>Card Payment</option>
                                                    <option>UPI</option>
                                                    <option>Cheque</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Reference Number</label>
                                                <input
                                                    type="text"
                                                    placeholder="UTR / Transaction ID"
                                                    className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer Actions */}
                            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex gap-3">
                                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                                    <Download className="w-4 h-4" />
                                    Download PDF
                                </button>
                                {selectedInvoice.status !== 'paid' && (
                                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 transition-colors">
                                        <CreditCard className="w-4 h-4" />
                                        Record Payment
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
