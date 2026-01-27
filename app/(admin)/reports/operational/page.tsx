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
        if (v >= 80) return 'bg-success';
        if (v >= 60) return 'bg-warning';
        return 'bg-danger';
    };

    return (
        <div className="flex items-center gap-2">
            <div className="w-20 h-2 surface-glass-soft rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full ${getColor(value)}`}
                    style={{ width: `${value}%` }}
                />
            </div>
            <span className={`text-xs font-medium ${value >= 80 ? 'text-success' :
                    value >= 60 ? 'text-warning' :
                        'text-danger'
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
                ? 'badge-success'
                : 'badge-warning'
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
                    <h1 className="text-xl font-semibold text-primary">Operational Reports</h1>
                    <p className="text-sm text-muted">Kiosk usage and deployment data</p>
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

                    {/* State Filter */}
                    <div>
                        <label className="block text-xs font-medium text-muted mb-1">State</label>
                        <select
                            value={stateFilter}
                            onChange={(e) => setStateFilter(e.target.value)}
                            className="input-glass"
                        >
                            {STATES.map(state => (
                                <option key={state.id} value={state.id}>{state.name}</option>
                            ))}
                        </select>
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
                </div>

                <div className="flex items-center justify-end">
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
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="surface-glass-strong rounded-lg border border-glass p-4">
                            <p className="text-xs font-medium text-muted uppercase">Total Kiosks</p>
                            <p className="text-2xl font-bold text-primary mt-1">{filteredData.length}</p>
                        </div>
                        <div className="surface-glass-strong rounded-lg border border-glass p-4">
                            <p className="text-xs font-medium text-muted uppercase">Total Check-ins</p>
                            <p className="text-2xl font-bold text-success mt-1">{totalCheckins.toLocaleString()}</p>
                        </div>
                        <div className="surface-glass-strong rounded-lg border border-glass p-4">
                            <p className="text-xs font-medium text-muted uppercase">Avg Utilization</p>
                            <p className="text-2xl font-bold text-primary mt-1">{avgUtilization}%</p>
                        </div>
                        <div className="surface-glass-strong rounded-lg border border-glass p-4">
                            <p className="text-xs font-medium text-muted uppercase">Active Kiosks</p>
                            <p className="text-2xl font-bold text-primary mt-1">
                                {filteredData.filter(k => k.status === 'active').length}
                            </p>
                        </div>
                    </div>

                    <div className="surface-glass-strong rounded-lg border border-glass">
                        {/* Results Header */}
                        <div className="px-4 py-3 border-b border-glass flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="relative min-w-[200px]">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                    <input
                                        type="text"
                                        placeholder="Search kiosks..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="input-glass pl-10"
                                    />
                                </div>
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
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Kiosk ID</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Hotel</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">State</th>
                                        <th className="text-right px-4 py-3 text-xs font-semibold text-muted uppercase">Check-ins</th>
                                        <th className="text-right px-4 py-3 text-xs font-semibold text-muted uppercase">Avg/Day</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Utilization</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-glass">
                                    {filteredData.map((item) => (
                                        <tr key={item.id} className="glass-hover transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <Cpu className="w-4 h-4 text-muted" />
                                                    <span className="text-sm font-mono text-primary">{item.id}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="w-4 h-4 text-muted" />
                                                    <span className="text-sm text-secondary-text">{item.hotelName}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin className="w-3.5 h-3.5 text-muted" />
                                                    <span className="text-sm text-secondary-text">{item.state}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <span className="text-sm font-semibold text-success">
                                                    {item.checkins.toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <span className="text-sm text-secondary-text">{item.avgPerDay}</span>
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
                        <div className="px-4 py-3 border-t border-glass">
                            <p className="text-sm text-muted">
                                Showing {filteredData.length} kiosks
                            </p>
                        </div>
                    </div>
                </>
            )}

            {/* Empty State */}
            {!isGenerated && (
                <div className="surface-glass-strong rounded-lg border border-glass p-12 text-center">
                    <Cpu className="w-12 h-12 mx-auto text-muted mb-4" />
                    <h3 className="text-lg font-medium text-primary mb-2">No Report Generated</h3>
                    <p className="text-sm text-muted mb-4">
                        Configure your filters above and click &quot;Generate Report&quot; to view kiosk data.
                    </p>
                </div>
            )}
        </div>
    );
}
