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
        completed: { icon: CheckCircle, style: 'badge-success', label: 'Completed' },
        pending: { icon: Clock, style: 'badge-warning', label: 'Pending' },
        failed: { icon: XCircle, style: 'badge-danger', label: 'Failed' },
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
        <div className="p-6 animate-in fade-in duration-normal">
            {/* Page Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link
                    href="/reports"
                    className="p-2 glass-hover rounded-md transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 text-muted" />
                </Link>
                <div>
                    <h1 className="text-xl font-semibold text-primary">Usage Reports</h1>
                    <p className="text-sm text-muted">Check-in and session consumption data</p>
                </div>
            </div>

            {/* Filters Card */}
            <div className="surface-glass-strong rounded-lg border border-glass p-4 mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-4 h-4 text-muted" />
                    <h2 className="text-sm font-semibold text-primary">Report Filters</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    {/* Date Range */}
                    <div>
                        <label className="block text-xs font-medium text-muted mb-1">From Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="input-glass pl-10"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-muted mb-1">To Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="input-glass pl-10"
                            />
                        </div>
                    </div>

                    {/* Hotel Filter */}
                    <div>
                        <label className="block text-xs font-medium text-muted mb-1">Hotel</label>
                        <select
                            value={hotelFilter}
                            onChange={(e) => setHotelFilter(e.target.value)}
                            className="input-glass"
                        >
                            {HOTELS.map(hotel => (
                                <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <label className="block text-xs font-medium text-muted mb-1">Status</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                            className="input-glass"
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
                        className="input-glass"
                    >
                        <option value="all">All Types</option>
                        <option value="Check-in">Check-in</option>
                        <option value="Check-out">Check-out</option>
                    </select>

                    <button
                        onClick={handleGenerateReport}
                        className="btn-primary"
                    >
                        <Play className="w-4 h-4" />
                        Generate Report
                    </button>
                </div>
            </div>

            {/* Results Section */}
            {isGenerated && (
                <div className="surface-glass-strong rounded-lg border border-glass">
                    {/* Results Header */}
                    <div className="px-4 py-3 border-b border-glass flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="relative min-w-[200px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                <input
                                    type="text"
                                    placeholder="Search results..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="input-glass pl-10"
                                />
                            </div>
                            <span className="text-sm text-muted">
                                {filteredData.length} records
                            </span>
                        </div>

                        {/* Export Buttons */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleExportPDF}
                                className="btn-secondary"
                            >
                                <FileText className="w-4 h-4" />
                                Export PDF
                            </button>
                            <button
                                onClick={handleExportCSV}
                                className="btn-secondary"
                            >
                                <FileSpreadsheet className="w-4 h-4" />
                                Export Excel
                            </button>
                        </div>
                    </div>

                    {/* Results Table */}
                    <div className="overflow-x-auto">
                        <table className="table-glass">
                            <thead>
                                <tr className="surface-glass-soft border-b border-glass">
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">#</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Session ID</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Hotel</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Guest</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Type</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Date</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Language</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-glass">
                                {filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-8 text-center text-sm text-muted">
                                            No records found matching your criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredData.map((item, idx) => (
                                        <tr key={item.id} className="glass-hover transition-colors">
                                            <td className="px-4 py-3 text-sm text-muted">{idx + 1}</td>
                                            <td className="px-4 py-3 text-sm font-mono text-primary">{item.id}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="w-4 h-4 text-muted" />
                                                    <span className="text-sm text-secondary-text">{item.hotelName}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-primary">{item.guestName}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${item.type === 'Check-in'
                                                        ? 'badge-default'
                                                        : 'badge-default'
                                                    }`}>
                                                    {item.type}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-secondary-text">{formatDate(item.date)}</td>
                                            <td className="px-4 py-3 text-sm text-secondary-text">{item.language}</td>
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
                    <div className="px-4 py-3 border-t border-glass flex items-center justify-between">
                        <p className="text-sm text-muted">
                            Showing {filteredData.length} of {MOCK_CONSUMPTION_DATA.length} records
                        </p>
                        <p className="text-xs text-muted">
                            Report generated at {new Date().toLocaleTimeString()}
                        </p>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!isGenerated && (
                <div className="surface-glass-strong rounded-lg border border-glass p-12 text-center">
                    <FileSpreadsheet className="w-12 h-12 mx-auto text-muted mb-4" />
                    <h3 className="text-lg font-medium text-primary mb-2">No Report Generated</h3>
                    <p className="text-sm text-muted mb-4">
                        Configure your filters above and click &quot;Generate Report&quot; to view data.
                    </p>
                </div>
            )}
        </div>
    );
}
