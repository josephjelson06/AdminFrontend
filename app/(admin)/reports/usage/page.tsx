'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    ChevronLeft,
    Search,
    Filter,
    FileSpreadsheet,
    FileText,
    Download,
    Calendar,
    Building2,
    CheckCircle,
    XCircle,
    Clock,
    Play,
} from 'lucide-react';
import { useToast } from '@/components/shared/ui/Toast';
import { exportToCSV } from '@/lib/shared/export';

// Mock check-in consumption data
const MOCK_CONSUMPTION_DATA = [
    { id: 'CHK-2026-001', hotelId: 'h-001', hotelName: 'Royal Orchid Bangalore', guestName: 'Rahul Sharma', type: 'Check-in', date: '2026-01-20', status: 'completed', language: 'Hindi' },
    { id: 'CHK-2026-002', hotelId: 'h-002', hotelName: 'Lemon Tree Premier', guestName: 'Priya Patel', type: 'Check-in', date: '2026-01-20', status: 'completed', language: 'English' },
    { id: 'CHK-2026-003', hotelId: 'h-003', hotelName: 'Ginger Hotel Panjim', guestName: 'Amit Kumar', type: 'Check-out', date: '2026-01-20', status: 'completed', language: 'Hindi' },
    { id: 'CHK-2026-004', hotelId: 'h-001', hotelName: 'Royal Orchid Bangalore', guestName: 'Sarah Johnson', type: 'Check-in', date: '2026-01-19', status: 'failed', language: 'English' },
    { id: 'CHK-2026-005', hotelId: 'h-005', hotelName: 'ITC Maratha', guestName: 'Vikram Singh', type: 'Check-in', date: '2026-01-19', status: 'completed', language: 'Hindi' },
    { id: 'CHK-2026-006', hotelId: 'h-006', hotelName: 'Marriott Suites', guestName: 'Meera Reddy', type: 'Check-in', date: '2026-01-18', status: 'completed', language: 'Telugu' },
    { id: 'CHK-2026-007', hotelId: 'h-007', hotelName: 'The Leela Palace', guestName: 'Rajesh Nair', type: 'Check-out', date: '2026-01-18', status: 'pending', language: 'Tamil' },
    { id: 'CHK-2026-008', hotelId: 'h-001', hotelName: 'Royal Orchid Bangalore', guestName: 'Anita Das', type: 'Check-in', date: '2026-01-17', status: 'completed', language: 'Bengali' },
    { id: 'CHK-2026-009', hotelId: 'h-002', hotelName: 'Lemon Tree Premier', guestName: 'Karan Mehta', type: 'Check-in', date: '2026-01-17', status: 'completed', language: 'Hindi' },
    { id: 'CHK-2026-010', hotelId: 'h-003', hotelName: 'Ginger Hotel Panjim', guestName: 'Lisa Brown', type: 'Check-in', date: '2026-01-16', status: 'failed', language: 'English' },
];

const HOTELS = [
    { id: 'all', name: 'All Hotels' },
    { id: 'h-001', name: 'Royal Orchid Bangalore' },
    { id: 'h-002', name: 'Lemon Tree Premier' },
    { id: 'h-003', name: 'Ginger Hotel Panjim' },
    { id: 'h-005', name: 'ITC Maratha' },
    { id: 'h-006', name: 'Marriott Suites' },
    { id: 'h-007', name: 'The Leela Palace' },
];

function StatusBadge({ status }: { status: string }) {
    const config: Record<string, { icon: typeof CheckCircle; style: string; label: string }> = {
        completed: { icon: CheckCircle, style: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', label: 'Completed' },
        pending: { icon: Clock, style: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', label: 'Pending' },
        failed: { icon: XCircle, style: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400', label: 'Failed' },
    };
    const { icon: Icon, style, label } = config[status] || config.pending;
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${style}`}>
            <Icon className="w-3 h-3" />
            {label}
        </span>
    );
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

export default function UsageReportsPage() {
    const { addToast } = useToast();
    const [isGenerated, setIsGenerated] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [hotelFilter, setHotelFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
    const [typeFilter, setTypeFilter] = useState<'all' | 'Check-in' | 'Check-out'>('all');
    const [dateFrom, setDateFrom] = useState('2026-01-16');
    const [dateTo, setDateTo] = useState('2026-01-20');

    const filteredData = MOCK_CONSUMPTION_DATA
        .filter(item => {
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return item.guestName.toLowerCase().includes(query) || item.id.toLowerCase().includes(query);
            }
            return true;
        })
        .filter(item => hotelFilter === 'all' || item.hotelId === hotelFilter)
        .filter(item => statusFilter === 'all' || item.status === statusFilter)
        .filter(item => typeFilter === 'all' || item.type === typeFilter);

    const handleGenerateReport = () => {
        setIsGenerated(true);
        addToast('success', 'Report Generated', `Found ${filteredData.length} records matching your criteria.`);
    };

    const handleExportCSV = () => {
        const exportData = filteredData.map(item => ({
            session_id: item.id,
            hotel: item.hotelName,
            guest: item.guestName,
            type: item.type,
            date: item.date,
            status: item.status,
            language: item.language,
        }));

        exportToCSV(exportData, 'usage_report', [
            { key: 'session_id', label: 'Session ID' },
            { key: 'hotel', label: 'Hotel' },
            { key: 'guest', label: 'Guest Name' },
            { key: 'type', label: 'Type' },
            { key: 'date', label: 'Date' },
            { key: 'status', label: 'Status' },
            { key: 'language', label: 'Language' },
        ]);

        addToast('success', 'Export Complete', 'Usage report downloaded as CSV.');
    };

    const handleExportPDF = () => {
        addToast('info', 'Export Started', 'PDF generation in progress...');
    };

    return (
        <div className="p-6">
            {/* Page Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link
                    href="/reports"
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 text-slate-500" />
                </Link>
                <div>
                    <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Usage Reports</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Check-in and session consumption data</p>
                </div>
            </div>

            {/* Filters Card */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Report Filters</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    {/* Date Range */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">From Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">To Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md text-sm"
                            />
                        </div>
                    </div>

                    {/* Hotel Filter */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Hotel</label>
                        <select
                            value={hotelFilter}
                            onChange={(e) => setHotelFilter(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md text-sm"
                        >
                            {HOTELS.map(hotel => (
                                <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Status</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md text-sm"
                        >
                            <option value="all">All Status</option>
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
                        className="px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md text-sm"
                    >
                        <option value="all">All Types</option>
                        <option value="Check-in">Check-in</option>
                        <option value="Check-out">Check-out</option>
                    </select>

                    <button
                        onClick={handleGenerateReport}
                        className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 transition-colors"
                    >
                        <Play className="w-4 h-4" />
                        Generate Report
                    </button>
                </div>
            </div>

            {/* Results Section */}
            {isGenerated && (
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                    {/* Results Header */}
                    <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="relative min-w-[200px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search results..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md text-sm"
                                />
                            </div>
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                {filteredData.length} records
                            </span>
                        </div>

                        {/* Export Buttons */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleExportPDF}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                            >
                                <FileText className="w-4 h-4" />
                                Export PDF
                            </button>
                            <button
                                onClick={handleExportCSV}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                            >
                                <FileSpreadsheet className="w-4 h-4" />
                                Export Excel
                            </button>
                        </div>
                    </div>

                    {/* Results Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">#</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Session ID</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Hotel</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Guest</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Type</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Date</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Language</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                                            No records found matching your criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredData.map((item, idx) => (
                                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                            <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">{idx + 1}</td>
                                            <td className="px-4 py-3 text-sm font-mono text-slate-900 dark:text-white">{item.id}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="w-4 h-4 text-slate-400" />
                                                    <span className="text-sm text-slate-700 dark:text-slate-300">{item.hotelName}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">{item.guestName}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${item.type === 'Check-in'
                                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                        : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                                    }`}>
                                                    {item.type}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{formatDate(item.date)}</td>
                                            <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{item.language}</td>
                                            <td className="px-4 py-3">
                                                <StatusBadge status={item.status} />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Showing {filteredData.length} of {MOCK_CONSUMPTION_DATA.length} records
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                            Report generated at {new Date().toLocaleTimeString()}
                        </p>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!isGenerated && (
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-12 text-center">
                    <FileSpreadsheet className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No Report Generated</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        Configure your filters above and click &quot;Generate Report&quot; to view data.
                    </p>
                </div>
            )}
        </div>
    );
}
