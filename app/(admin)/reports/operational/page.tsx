'use client';

import { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { useToast } from '@/components/shared/ui/Toast';
import { exportToCSV } from '@/lib/shared/export';
import {
    reportsService,
    type OperationalKioskMetrics
} from '@/lib/services/reportsService';

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
    const [isLoading, setIsLoading] = useState(false);

    // Filters State
    const [searchQuery, setSearchQuery] = useState('');
    const [stateFilter, setStateFilter] = useState('all');
    const [hotelFilter, setHotelFilter] = useState('all');
    const [dateFrom, setDateFrom] = useState('2026-01-01');
    const [dateTo, setDateTo] = useState('2026-01-20');

    // Data State
    const [reportData, setReportData] = useState<OperationalKioskMetrics[]>([]);
    const [availableFilters, setAvailableFilters] = useState<{
        states: { id: string; name: string }[];
        hotels: { id: string; name: string }[];
    }>({ states: [], hotels: [] });

    // Load available filters on mount
    useEffect(() => {
        const loadFilters = async () => {
            try {
                const filters = await reportsService.getOperationalFilters();
                setAvailableFilters(filters);
            } catch (err) {
                console.error('Failed to load filters', err);
            }
        };
        loadFilters();
    }, []);

    // Filter displayed data locally for search (post-fetch filtering for responsiveness)
    const filteredData = reportData.filter(item => {
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return item.id.toLowerCase().includes(query) ||
                item.hotelName.toLowerCase().includes(query);
        }
        return true;
    });

    const totalCheckins = filteredData.reduce((sum, k) => sum + k.checkins, 0);
    const avgUtilization = filteredData.length > 0
        ? Math.round(filteredData.reduce((sum, k) => sum + k.utilization, 0) / filteredData.length)
        : 0;

    const handleGenerateReport = async () => {
        setIsLoading(true);
        setIsGenerated(false);
        try {
            const data = await reportsService.getOperationalReport({
                state: stateFilter,
                hotelId: hotelFilter,
                dateFrom,
                dateTo
            });
            setReportData(data);
            setIsGenerated(true);
            addToast('success', 'Report Generated', `Found ${data.length} kiosks matching your criteria.`);
        } catch (err) {
            addToast('error', 'Error', 'Failed to generate report');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
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
        <div className="p-4 sm:p-6 animate-in fade-in duration-normal">
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
                                className="input-glass pl-10 w-full"
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
                                className="input-glass pl-10 w-full"
                            />
                        </div>
                    </div>

                    {/* State Filter */}
                    <div>
                        <label className="block text-xs font-medium text-muted mb-1">State</label>
                        <select
                            value={stateFilter}
                            onChange={(e) => setStateFilter(e.target.value)}
                            className="input-glass w-full"
                        >
                            {availableFilters.states.map(state => (
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
                            className="input-glass w-full"
                        >
                            {availableFilters.hotels.map(hotel => (
                                <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex items-center justify-end">
                    <button
                        onClick={handleGenerateReport}
                        className="btn-primary"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        ) : (
                            <Play className="w-4 h-4 mr-2" />
                        )}
                        {isLoading ? 'Generating...' : 'Generate Report'}
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
                                    <FileText className="w-4 h-4 mr-2" />
                                    Export PDF
                                </button>
                                <button
                                    onClick={handleExportCSV}
                                    className="btn-secondary"
                                >
                                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                                    Export Excel
                                </button>
                            </div>
                        </div>

                        {/* Results Table */}
                        <div className="overflow-x-auto">
                            <table className="table-glass w-full">
                                <thead>
                                    <tr className="surface-glass-soft border-b border-glass">
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase whitespace-nowrap">Kiosk ID</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase whitespace-nowrap">Hotel</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase whitespace-nowrap">State</th>
                                        <th className="text-right px-4 py-3 text-xs font-semibold text-muted uppercase whitespace-nowrap">Check-ins</th>
                                        <th className="text-right px-4 py-3 text-xs font-semibold text-muted uppercase whitespace-nowrap">Avg/Day</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase whitespace-nowrap">Utilization</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase whitespace-nowrap">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-glass">
                                    {filteredData.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-4 py-8 text-center text-muted">
                                                No kiosks found matching your search.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredData.map((item) => (
                                            <tr key={item.id} className="glass-hover transition-colors">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <Cpu className="w-4 h-4 text-muted" />
                                                        <span className="text-sm font-mono text-primary whitespace-nowrap">{item.id}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <Building2 className="w-4 h-4 text-muted" />
                                                        <span className="text-sm text-secondary-text truncate max-w-[150px]">{item.hotelName}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1.5">
                                                        <MapPin className="w-3.5 h-3.5 text-muted" />
                                                        <span className="text-sm text-secondary-text whitespace-nowrap">{item.state}</span>
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
                                                <td className="px-4 py-3 min-w-[120px]">
                                                    <UtilizationBar value={item.utilization} />
                                                </td>
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
                        <div className="px-4 py-3 border-t border-glass">
                            <p className="text-sm text-muted">
                                Showing {filteredData.length} kiosks
                            </p>
                        </div>
                    </div>
                </>
            )}

            {/* Empty State */}
            {!isGenerated && !isLoading && (
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
