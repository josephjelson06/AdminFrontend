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
        <div className="p-4 sm:p-6 space-y-6">
            {/* Page Header with Filters */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Analytics Overview</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Business intelligence and usage insights</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Date Range Picker */}
                    <DateRangeFilter date={dateRange} onDateChange={setDateRange} />

                    <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Export CSV</span>
                    </button>

                    <Link
                        href="/reports/usage"
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-slate-800 dark:hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20"
                    >
                        <FileText className="w-4 h-4" />
                        Detailed Reports
                    </Link>
                </div>
            </div>

            {/* KPI Summary - Dynamic (Mocked logic would go here based on dates) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Total Check-ins</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{totalCheckins.toLocaleString()}</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1.5 flex items-center gap-1 font-medium">
                        <TrendingUp className="w-3 h-3" /> +23% vs prev period
                    </p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Deployed Kiosks</p>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">{totalKiosks}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">Across {MOCK_STATE_DATA.length} states</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Avg Self Check-in Rate</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">74%</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">Guests using kiosk vs front desk</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Non-English Usage</p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-2">72%</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">Regional language interactions</p>
                </div>
            </div>

            {/* Main Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Check-ins & AI Sessions Trend */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-slate-400" />
                            Check-ins & AI Sessions
                        </h3>
                        <Link href="/reports/usage" className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline">
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
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
                        <TrendingUp className="w-4 h-4 text-slate-400" />
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
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                        <Languages className="w-4 h-4 text-slate-400" />
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
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-400 truncate">{lang.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* India Heatmap */}
                <Link href="/reports/operational" className="block bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors cursor-pointer group">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            Geographic Coverage
                        </h3>
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                            Expand <ArrowRight className="w-3 h-3" />
                        </span>
                    </div>
                    <IndiaHeatmap data={MOCK_STATE_DATA} />
                </Link>

                {/* Top Hotels */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-slate-400" />
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
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/20">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Globe className="w-4 h-4 text-slate-400" />
                        State-wise Performance
                    </h3>
                    <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors text-slate-400 hover:text-slate-600">
                        <Share2 className="w-4 h-4" />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">State</th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Kiosks</th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Check-ins</th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Avg/Kiosk</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {MOCK_STATE_DATA.slice(0, 6).map((region) => (
                                <tr key={region.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <td className="px-6 py-3.5 text-sm font-medium text-slate-900 dark:text-white">{region.name}</td>
                                    <td className="px-6 py-3.5 text-right text-sm text-slate-700 dark:text-slate-300">{region.kiosks}</td>
                                    <td className="px-6 py-3.5 text-right text-sm font-medium text-emerald-600 dark:text-emerald-400">{region.checkins.toLocaleString()}</td>
                                    <td className="px-6 py-3.5 text-right text-sm text-slate-500 dark:text-slate-400">{Math.round(region.checkins / region.kiosks)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
