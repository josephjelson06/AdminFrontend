import { FileText, Calendar, IndianRupee, Download, Filter, CheckCircle, Clock, AlertCircle } from 'lucide-react';

// Mock invoice data
const MOCK_INVOICES = [
    {
        id: 'INV-2026-001',
        hotelName: 'Royal Orchid Bangalore',
        amount: 50000,
        status: 'paid',
        dueDate: '2026-01-15',
        paidDate: '2026-01-12',
    },
    {
        id: 'INV-2026-002',
        hotelName: 'Lemon Tree Premier',
        amount: 25000,
        status: 'overdue',
        dueDate: '2026-01-10',
        paidDate: null,
    },
    {
        id: 'INV-2026-003',
        hotelName: 'Ginger Hotel, Panjim',
        amount: 15000,
        status: 'pending',
        dueDate: '2026-01-25',
        paidDate: null,
    },
    {
        id: 'INV-2025-089',
        hotelName: 'Royal Orchid Bangalore',
        amount: 50000,
        status: 'paid',
        dueDate: '2025-12-15',
        paidDate: '2025-12-14',
    },
];

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
}

function StatusBadge({ status }: { status: string }) {
    const config: Record<string, { icon: typeof CheckCircle; style: string; label: string }> = {
        paid: { icon: CheckCircle, style: 'bg-emerald-100 text-emerald-700', label: 'Paid' },
        pending: { icon: Clock, style: 'bg-amber-100 text-amber-700', label: 'Pending' },
        overdue: { icon: AlertCircle, style: 'bg-rose-100 text-rose-700', label: 'Overdue' },
    };

    const { icon: Icon, style, label } = config[status] || config.pending;

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${style}`}>
            <Icon className="w-3 h-3" />
            {label}
        </span>
    );
}

export default function InvoicesPage() {
    const totalPaid = MOCK_INVOICES.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
    const totalPending = MOCK_INVOICES.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0);
    const totalOverdue = MOCK_INVOICES.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0);

    return (
        <div className="p-6">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900">Invoicing</h1>
                    <p className="text-sm text-slate-500">Invoice log and payment status</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-sm text-slate-600 rounded-md hover:bg-slate-50 transition-colors">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800 transition-colors">
                        <FileText className="w-4 h-4" />
                        New Invoice
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg border border-slate-200 p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Paid</p>
                    <p className="text-xl font-bold text-emerald-600 mt-1">{formatCurrency(totalPaid)}</p>
                </div>
                <div className="bg-white rounded-lg border border-slate-200 p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Pending</p>
                    <p className="text-xl font-bold text-amber-600 mt-1">{formatCurrency(totalPending)}</p>
                </div>
                <div className="bg-white rounded-lg border border-slate-200 p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Overdue</p>
                    <p className="text-xl font-bold text-rose-600 mt-1">{formatCurrency(totalOverdue)}</p>
                </div>
            </div>

            {/* Invoices Table */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                Invoice
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                Hotel
                            </th>
                            <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                Amount
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                Status
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                Due Date
                            </th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {MOCK_INVOICES.map((invoice) => (
                            <tr key={invoice.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3">
                                    <span className="text-sm font-mono font-medium text-slate-900">{invoice.id}</span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="text-sm text-slate-700">{invoice.hotelName}</span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <span className="text-sm font-semibold text-slate-900">{formatCurrency(invoice.amount)}</span>
                                </td>
                                <td className="px-4 py-3">
                                    <StatusBadge status={invoice.status} />
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                        {new Date(invoice.dueDate).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <button className="px-3 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded transition-colors">
                                        <Download className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
