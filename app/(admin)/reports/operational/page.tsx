'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    ChevronLeft,
    Search,
    Filter,
    FileSpreadsheet,
    FileText,
    Calendar,
    Cpu,
    Building2,
    MapPin,
    Play,
    TrendingUp,
    TrendingDown,
} from 'lucide-react';
import { useToast } from '@/components/shared/ui/Toast';
import { exportToCSV } from '@/lib/shared/export';

// Mock kiosk operational data
const MOCK_KIOSK_DATA = [
    { id: 'K-001', hotelId: 'h-001', hotelName: 'Royal Orchid Bangalore', state: 'Karnataka', checkins: 245, avgPerDay: 35, utilization: 82, status: 'active' },
    { id: 'K-002', hotelId: 'h-001', hotelName: 'Royal Orchid Bangalore', state: 'Karnataka', checkins: 198, avgPerDay: 28, utilization: 75, status: 'active' },
    { id: 'K-003', hotelId: 'h-002', hotelName: 'Lemon Tree Premier', state: 'Maharashtra', checkins: 156, avgPerDay: 22, utilization: 68, status: 'active' },
    { id: 'K-004', hotelId: 'h-003', hotelName: 'Ginger Hotel Panjim', state: 'Goa', checkins: 89, avgPerDay: 13, utilization: 45, status: 'maintenance' },
    { id: 'K-005', hotelId: 'h-005', hotelName: 'ITC Maratha', state: 'Maharashtra', checkins: 312, avgPerDay: 45, utilization: 92, status: 'active' },
    { id: 'K-006', hotelId: 'h-006', hotelName: 'Marriott Suites', state: 'Delhi NCR', checkins: 178, avgPerDay: 25, utilization: 71, status: 'active' },
    { id: 'K-007', hotelId: 'h-007', hotelName: 'The Leela Palace', state: 'Karnataka', checkins: 267, avgPerDay: 38, utilization: 85, status: 'active' },
    { id: 'K-008', hotelId: 'h-001', hotelName: 'Royal Orchid Bangalore', state: 'Karnataka', checkins: 145, avgPerDay: 21, utilization: 62, status: 'active' },
];

const STATES = [
    { id: 'all', name: 'All States' },
    { id: 'Karnataka', name: 'Karnataka' },
    { id: 'Maharashtra', name: 'Maharashtra' },
    { id: 'Goa', name: 'Goa' },
    { id: 'Delhi NCR', name: 'Delhi NCR' },
    { id: 'Tamil Nadu', name: 'Tamil Nadu' },
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

function UtilizationBar({ value }: { value: number }) {
    const getColor = (v: number) => {
        if (v >= 80) return 'bg-emerald-500';
        if (v >= 60) return 'bg-amber-500';
        return 'bg-rose-500';
    };

    return (
        <div className="flex items-center gap-2">
            <div className="w-20 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full ${getColor(value)}`}
                    style={{ width: `${value}%` }}
                />
            </div>
            <span className={`text-xs font-medium ${value >= 80 ? 'text-emerald-600 dark:text-emerald-400' :
                    value >= 60 ? 'text-amber-600 dark:text-amber-400' :
                        'text-rose-600 dark:text-rose-400'
                }`}>
                {value}%
            </span>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const isActive = status === 'active';
    return (
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${isActive
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
            }`}>
            {isActive ? 'Active' : 'Maintenance'}
        </span>
    );
}

export default function OperationalReportsPage() {
    const { addToast } = useToast();
    const [isGenerated, setIsGenerated] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [stateFilter, setStateFilter] = useState('all');
    const [hotelFilter, setHotelFilter] = useState('all');
    const [dateFrom, setDateFrom] = useState('2026-01-01');
    const [dateTo, setDateTo] = useState('2026-01-20');

    const filteredData = MOCK_KIOSK_DATA
        .filter(item => {
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return item.id.toLowerCase().includes(query) || item.hotelName.toLowerCase().includes(query);
            }
            return true;
        })
        .filter(item => stateFilter === 'all' || item.state === stateFilter)
        .filter(item => hotelFilter === 'all' || item.hotelId === hotelFilter);

    const totalCheckins = filteredData.reduce((sum, k) => sum + k.checkins, 0);
    const avgUtilization = Math.round(filteredData.reduce((sum, k) => sum + k.utilization, 0) / filteredData.length);

    const handleGenerateReport = () => {
        setIsGenerated(true);
        addToast('success', 'Report Generated', `Found ${filteredData.length} kiosks matching your criteria.`);
    };

    const handleExportCSV = () => {
        const exportData = filteredData.map(item => ({
            kiosk_id: item.id,
            hotel: item.hotelName,
            state: item.state,
            checkins: item.checkins,
            avg_per_day: item.avgPerDay,
            utilization: `${item.utilization}%`,
            status: item.status,
        }));

        exportToCSV(exportData, 'operational_report', [
            { key: 'kiosk_id', label: 'Kiosk ID' },
            { key: 'hotel', label: 'Hotel' },
            { key: 'state', label: 'State' },
            { key: 'checkins', label: 'Check-ins' },
            { key: 'avg_per_day', label: 'Avg/Day' },
            { key: 'utilization', label: 'Utilization' },
            { key: 'status', label: 'Status' },
        ]);

        addToast('success', 'Export Complete', 'Operational report downloaded as CSV.');
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
                    <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Operational Reports</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Kiosk usage and deployment data</p>
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

                    {/* State Filter */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">State</label>
                        <select
                            value={stateFilter}
                            onChange={(e) => setStateFilter(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md text-sm"
                        >
                            {STATES.map(state => (
                                <option key={state.id} value={state.id}>{state.name}</option>
                            ))}
                        </select>
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
                </div>

                <div className="flex items-center justify-end">
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
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Total Kiosks</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{filteredData.length}</p>
                        </div>
                        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Total Check-ins</p>
                            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{totalCheckins.toLocaleString()}</p>
                        </div>
                        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Avg Utilization</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{avgUtilization}%</p>
                        </div>
                        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Active Kiosks</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                                {filteredData.filter(k => k.status === 'active').length}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                        {/* Results Header */}
                        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="relative min-w-[200px]">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search kiosks..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md text-sm"
                                    />
                                </div>
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
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Kiosk ID</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Hotel</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">State</th>
                                        <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Check-ins</th>
                                        <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Avg/Day</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Utilization</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {filteredData.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <Cpu className="w-4 h-4 text-slate-400" />
                                                    <span className="text-sm font-mono text-slate-900 dark:text-white">{item.id}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="w-4 h-4 text-slate-400" />
                                                    <span className="text-sm text-slate-700 dark:text-slate-300">{item.hotelName}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                                    <span className="text-sm text-slate-600 dark:text-slate-400">{item.state}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                                    {item.checkins.toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <span className="text-sm text-slate-700 dark:text-slate-300">{item.avgPerDay}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <UtilizationBar value={item.utilization} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <StatusBadge status={item.status} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Showing {filteredData.length} kiosks
                            </p>
                        </div>
                    </div>
                </>
            )}

            {/* Empty State */}
            {!isGenerated && (
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-12 text-center">
                    <Cpu className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No Report Generated</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        Configure your filters above and click &quot;Generate Report&quot; to view kiosk data.
                    </p>
                </div>
            )}
        </div>
    );
}
