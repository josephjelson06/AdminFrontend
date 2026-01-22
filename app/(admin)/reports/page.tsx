'use client';

import Link from 'next/link';
import { BarChart3, Globe, Languages, TrendingUp, Calendar, Building2, MapPin, ArrowRight, FileText } from 'lucide-react';
import { IndiaHeatmap } from '@/components/shared/ui/IndiaHeatmap';
import { AreaChartComponent, BarChartComponent, DonutChartComponent, LineChartComponent } from '@/components/shared/ui/Charts';

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
    const totalCheckins = MOCK_CHECKIN_DATA.reduce((sum, d) => sum + d.checkins, 0);
    const totalKiosks = MOCK_STATE_DATA.reduce((sum, d) => sum + d.kiosks, 0);

    return (
        <div className="p-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Analytics Overview</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Business intelligence and usage insights</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600 dark:text-slate-300">Last 6 months</span>
                    </div>
                    <Link
                        href="/reports/usage"
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-slate-800 dark:hover:bg-emerald-700 transition-colors"
                    >
                        <FileText className="w-4 h-4" />
                        View Reports
                    </Link>
                </div>
            </div>

            {/* KPI Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Total Check-ins</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{totalCheckins.toLocaleString()}</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> +23% vs prev period
                    </p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Deployed Kiosks</p>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{totalKiosks}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Across {MOCK_STATE_DATA.length} states</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Avg Self Check-in Rate</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">74%</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Guests using kiosk vs front desk</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Non-English Usage</p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">72%</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Regional language interactions</p>
                </div>
            </div>

            {/* Main Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Check-ins & AI Sessions Trend */}
                <Link href="/reports/usage" className="block bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-slate-400" />
                            Check-ins & AI Sessions
                        </h3>
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            View Report <ArrowRight className="w-3 h-3" />
                        </span>
                    </div>
                    <LineChartComponent
                        data={MOCK_CHECKIN_DATA}
                        lines={[
                            { dataKey: 'checkins', color: '#10b981', name: 'Check-ins' },
                            { dataKey: 'aiSessions', color: '#6366f1', name: 'AI Sessions' },
                        ]}
                        height={220}
                    />
                </Link>

                {/* Weekly Pattern */}
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                        <TrendingUp className="w-4 h-4 text-slate-400" />
                        Weekly Check-in Pattern
                    </h3>
                    <AreaChartComponent
                        data={DAILY_DATA}
                        dataKey="value"
                        color="#f59e0b"
                        height={220}
                        gradientId="weeklyGradient"
                    />
                </div>
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Language Distribution */}
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                        <Languages className="w-4 h-4 text-slate-400" />
                        Language Distribution
                    </h3>
                    <DonutChartComponent data={MOCK_LANGUAGE_DATA} height={200} />
                    <div className="grid grid-cols-3 gap-2 mt-2">
                        {MOCK_LANGUAGE_DATA.slice(0, 6).map((lang, idx) => (
                            <div key={lang.name} className="flex items-center gap-1">
                                <span
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: ['#10b981', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'][idx] }}
                                />
                                <span className="text-[10px] text-slate-600 dark:text-slate-400 truncate">{lang.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* India Heatmap - Links to Operational */}
                <Link href="/reports/operational" className="block bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            Geographic Coverage
                        </h3>
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            View Report <ArrowRight className="w-3 h-3" />
                        </span>
                    </div>
                    <IndiaHeatmap data={MOCK_STATE_DATA} />
                </Link>

                {/* Top Hotels */}
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-slate-400" />
                            Top Performing Hotels
                        </h3>
                    </div>
                    <div className="p-4">
                        <BarChartComponent
                            data={MOCK_TOP_HOTELS.map(h => ({ name: h.name.split(' ')[0], value: h.checkins }))}
                            dataKey="value"
                            color="#6366f1"
                            height={180}
                        />
                    </div>
                </div>
            </div>

            {/* Reports Quick Access */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Link
                    href="/reports/usage"
                    className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
                >
                    <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Usage Reports</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Check-in consumption and session logs</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400" />
                </Link>
                <Link
                    href="/reports/operational"
                    className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
                >
                    <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                        <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Operational Reports</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Kiosk usage and deployment data</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400" />
                </Link>
            </div>

            {/* State-wise Table */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Globe className="w-4 h-4 text-slate-400" />
                        State-wise Performance
                    </h3>
                </div>
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                            <th className="text-left px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">State</th>
                            <th className="text-right px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Kiosks</th>
                            <th className="text-right px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Check-ins</th>
                            <th className="text-right px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Avg/Kiosk</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {MOCK_STATE_DATA.slice(0, 6).map((region) => (
                            <tr key={region.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                <td className="px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white">{region.name}</td>
                                <td className="px-4 py-2.5 text-right text-sm text-slate-700 dark:text-slate-300">{region.kiosks}</td>
                                <td className="px-4 py-2.5 text-right text-sm font-medium text-emerald-600 dark:text-emerald-400">{region.checkins.toLocaleString()}</td>
                                <td className="px-4 py-2.5 text-right text-sm text-slate-500 dark:text-slate-400">{Math.round(region.checkins / region.kiosks)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
