'use client';

import { useState } from 'react';
import Link from 'next/link';
import { subMonths } from 'date-fns';
import {
    BarChart3,
    Globe,
    Languages,
    TrendingUp,
    Building2,
    MapPin,
    ArrowRight,
    FileText,
    Download,
    Share2
} from 'lucide-react';
import { IndiaHeatmap } from '@/components/shared/ui/IndiaHeatmap';
import { AreaChartComponent, BarChartComponent, DonutChartComponent, LineChartComponent } from '@/components/shared/ui/Charts';
import { DateRangeFilter, type DateRange } from '@/components/admin/reports/DateRangeFilter';
import { ReportsFilter } from '@/components/admin/reports/ReportsFilter';
import { exportToCSV } from '@/lib/export';
import { useToast } from '@/components/shared/ui/Toast';

// Mock analytics data
const MOCK_CHECKIN_DATA = [
    { name: 'Aug', checkins: 1240, aiSessions: 890 },
    { name: 'Sep', checkins: 1580, aiSessions: 1120 },
    { name: 'Oct', checkins: 1920, aiSessions: 1450 },
    { name: 'Nov', checkins: 2340, aiSessions: 1780 },
    { name: 'Dec', checkins: 2890, aiSessions: 2200 },
    { name: 'Jan', checkins: 3150, aiSessions: 2450 },
];

const MOCK_LANGUAGE_DATA = [
    { name: 'Hindi', value: 42 },
    { name: 'English', value: 28 },
    { name: 'Tamil', value: 12 },
    { name: 'Telugu', value: 8 },
    { name: 'Bengali', value: 6 },
    { name: 'Others', value: 4 },
];

const MOCK_TOP_HOTELS = [
    { name: 'Royal Orchid Bangalore', checkins: 1250, selfCheckInRate: 78 },
    { name: 'Lemon Tree Premier', checkins: 890, selfCheckInRate: 65 },
    { name: 'Ginger Hotel, Panjim', checkins: 520, selfCheckInRate: 82 },
    { name: 'Taj Palace Mumbai', checkins: 490, selfCheckInRate: 71 },
];

const MOCK_STATE_DATA = [
    { id: 'KA', name: 'Karnataka', kiosks: 12, checkins: 2450 },
    { id: 'MH', name: 'Maharashtra', kiosks: 8, checkins: 1890 },
    { id: 'GA', name: 'Goa', kiosks: 4, checkins: 780 },
    { id: 'TN', name: 'Tamil Nadu', kiosks: 6, checkins: 1120 },
    { id: 'DL', name: 'Delhi NCR', kiosks: 5, checkins: 950 },
    { id: 'RJ', name: 'Rajasthan', kiosks: 3, checkins: 620 },
    { id: 'GJ', name: 'Gujarat', kiosks: 2, checkins: 340 },
    { id: 'KL', name: 'Kerala', kiosks: 4, checkins: 890 },
    { id: 'AP', name: 'Andhra Pradesh', kiosks: 3, checkins: 560 },
    { id: 'TS', name: 'Telangana', kiosks: 2, checkins: 410 },
    { id: 'WB', name: 'West Bengal', kiosks: 1, checkins: 220 },
    { id: 'UP', name: 'Uttar Pradesh', kiosks: 2, checkins: 380 },
];

const DAILY_DATA = [
    { name: 'Mon', value: 145 },
    { name: 'Tue', value: 178 },
    { name: 'Wed', value: 156 },
    { name: 'Thu', value: 189 },
    { name: 'Fri', value: 234 },
    { name: 'Sat', value: 267 },
    { name: 'Sun', value: 198 },
];

export default function ReportsPage() {
    const { addToast } = useToast();

    // State for filtering
    const [dateRange, setDateRange] = useState<DateRange>({
        from: subMonths(new Date(), 6),
        to: new Date()
    });

    const totalCheckins = MOCK_CHECKIN_DATA.reduce((sum, d) => sum + d.checkins, 0);
    const totalKiosks = MOCK_STATE_DATA.reduce((sum, d) => sum + d.kiosks, 0);

    // Export Handler
    const handleExport = () => {
        try {
            // Export State Performance Data
            exportToCSV(MOCK_STATE_DATA, 'state_performance_report', [
                { key: 'name', label: 'State' },
                { key: 'kiosks', label: 'Active Kiosks' },
                { key: 'checkins', label: 'Total Check-ins' }
            ]);
            addToast('success', 'Report Downloaded', 'The state performance report has been generated.');
        } catch (error) {
            addToast('error', 'Export Failed', 'Could not generate the CSV file.');
        }
    };

    return (
        <div className="p-4 sm:p-6 space-y-6 animate-in fade-in duration-normal">
            {/* Page Header with Filters */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-primary">Analytics Overview</h1>
                    <p className="text-sm text-muted">Business intelligence and usage insights</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Date Range Picker */}
                    <ReportsFilter date={dateRange} onDateChange={setDateRange} />

                    <div className="h-8 w-px bg-glass hidden sm:block" />

                    <button
                        onClick={handleExport}
                        className="btn-secondary"
                    >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Export CSV</span>
                    </button>

                    <Link
                        href="/reports/usage"
                        className="btn-primary"
                    >
                        <FileText className="w-4 h-4" />
                        Detailed Reports
                    </Link>
                </div>
            </div>

            {/* KPI Summary - Dynamic (Mocked logic would go here based on dates) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="surface-glass-strong rounded-2xl border border-glass p-5">
                    <p className="text-xs font-medium text-muted uppercase tracking-wide">Total Check-ins</p>
                    <p className="text-2xl font-bold text-primary mt-2">{totalCheckins.toLocaleString()}</p>
                    <p className="text-xs text-success mt-1.5 flex items-center gap-1 font-medium">
                        <TrendingUp className="w-3 h-3" /> +23% vs prev period
                    </p>
                </div>
                <div className="surface-glass-strong rounded-2xl border border-glass p-5">
                    <p className="text-xs font-medium text-muted uppercase tracking-wide">Deployed Kiosks</p>
                    <p className="text-2xl font-bold text-success mt-2">{totalKiosks}</p>
                    <p className="text-xs text-muted mt-1.5">Across {MOCK_STATE_DATA.length} states</p>
                </div>
                <div className="surface-glass-strong rounded-2xl border border-glass p-5">
                    <p className="text-xs font-medium text-muted uppercase tracking-wide">Avg Self Check-in Rate</p>
                    <p className="text-2xl font-bold text-primary mt-2">74%</p>
                    <p className="text-xs text-muted mt-1.5">Guests using kiosk vs front desk</p>
                </div>
                <div className="surface-glass-strong rounded-2xl border border-glass p-5">
                    <p className="text-xs font-medium text-muted uppercase tracking-wide">Non-English Usage</p>
                    <p className="text-2xl font-bold text-info mt-2">72%</p>
                    <p className="text-xs text-muted mt-1.5">Regional language interactions</p>
                </div>
            </div>

            {/* Main Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Check-ins & AI Sessions Trend */}
                <div className="surface-glass-strong rounded-2xl border border-glass p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-base font-bold text-primary flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-muted" />
                            Check-ins & AI Sessions
                        </h3>
                        <Link href="/reports/usage" className="text-xs font-medium text-success flex items-center gap-1 hover:underline">
                            View Details <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <LineChartComponent
                        data={MOCK_CHECKIN_DATA}
                        lines={[
                            { dataKey: 'checkins', color: '#10b981', name: 'Check-ins' },
                            { dataKey: 'aiSessions', color: '#6366f1', name: 'AI Sessions' },
                        ]}
                        height={240}
                    />
                </div>

                {/* Weekly Pattern */}
                <div className="surface-glass-strong rounded-2xl border border-glass p-6">
                    <h3 className="text-base font-bold text-primary flex items-center gap-2 mb-6">
                        <TrendingUp className="w-4 h-4 text-muted" />
                        Weekly Check-in Pattern
                    </h3>
                    <AreaChartComponent
                        data={DAILY_DATA}
                        dataKey="value"
                        color="#f59e0b"
                        height={240}
                        gradientId="weeklyGradient"
                    />
                </div>
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Language Distribution */}
                <div className="surface-glass-strong rounded-2xl border border-glass p-6">
                    <h3 className="text-base font-bold text-primary flex items-center gap-2 mb-4">
                        <Languages className="w-4 h-4 text-muted" />
                        Language Distribution
                    </h3>
                    <DonutChartComponent data={MOCK_LANGUAGE_DATA} height={200} />
                    <div className="grid grid-cols-3 gap-2 mt-6">
                        {MOCK_LANGUAGE_DATA.slice(0, 6).map((lang, idx) => (
                            <div key={lang.name} className="flex items-center gap-1.5">
                                <span
                                    className="w-2 h-2 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: ['#10b981', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'][idx] }}
                                />
                                <span className="text-xs font-medium text-secondary-text truncate">{lang.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* India Heatmap */}
                <Link href="/reports/operational" className="block surface-glass-strong rounded-2xl border border-glass p-6 glass-hover cursor-pointer group">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-primary flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted" />
                            Geographic Coverage
                        </h3>
                        <span className="text-xs text-success opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                            Expand <ArrowRight className="w-3 h-3" />
                        </span>
                    </div>
                    <IndiaHeatmap data={MOCK_STATE_DATA} />
                </Link>

                {/* Top Hotels */}
                <div className="surface-glass-strong rounded-2xl border border-glass overflow-hidden">
                    <div className="px-6 py-4 border-b border-glass surface-glass-soft">
                        <h3 className="text-base font-bold text-primary flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-muted" />
                            Top Performing Hotels
                        </h3>
                    </div>
                    <div className="p-6">
                        <BarChartComponent
                            data={MOCK_TOP_HOTELS.map(h => ({ name: h.name.split(' ')[0], value: h.checkins }))}
                            dataKey="value"
                            color="#6366f1"
                            height={200}
                        />
                    </div>
                </div>
            </div>

            {/* State-wise Table */}
            <div className="surface-glass-strong rounded-2xl border border-glass overflow-hidden">
                <div className="px-6 py-4 border-b border-glass flex justify-between items-center surface-glass-soft">
                    <h3 className="text-base font-bold text-primary flex items-center gap-2">
                        <Globe className="w-4 h-4 text-muted" />
                        State-wise Performance
                    </h3>
                    <button className="p-1 glass-hover rounded transition-colors text-muted hover:text-secondary-text">
                        <Share2 className="w-4 h-4" />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="table-glass">
                        <thead>
                            <tr className="surface-glass-soft border-b border-glass">
                                <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">State</th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Kiosks</th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Check-ins</th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Avg/Kiosk</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-glass">
                            {MOCK_STATE_DATA.slice(0, 6).map((region) => (
                                <tr key={region.id} className="glass-hover transition-colors group">
                                    <td className="px-6 py-3.5 text-sm font-medium text-primary">{region.name}</td>
                                    <td className="px-6 py-3.5 text-right text-sm text-secondary-text">{region.kiosks}</td>
                                    <td className="px-6 py-3.5 text-right text-sm font-medium text-success">{region.checkins.toLocaleString()}</td>
                                    <td className="px-6 py-3.5 text-right text-sm text-muted">{Math.round(region.checkins / region.kiosks)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
