'use client';

import Link from 'next/link';
import {
    ChevronRight,
    Globe,
    Building2,
    Languages,
    Bot,
    TrendingUp,
    MapPin,
    Award,
    AlertTriangle,
} from 'lucide-react';
import { IndiaHeatmap } from '@/components/shared/ui/IndiaHeatmap';
import { DonutChartComponent, BarChartComponent } from '@/components/shared/ui/Charts';

// Mock data for geographic breakdown
const MOCK_STATE_DATA = [
    { id: 'KA', name: 'Karnataka', kiosks: 12, checkins: 2450, growth: 15.2 },
    { id: 'MH', name: 'Maharashtra', kiosks: 8, checkins: 1890, growth: 12.1 },
    { id: 'GA', name: 'Goa', kiosks: 4, checkins: 780, growth: 8.5 },
    { id: 'TN', name: 'Tamil Nadu', kiosks: 6, checkins: 1120, growth: 10.3 },
    { id: 'DL', name: 'Delhi NCR', kiosks: 5, checkins: 950, growth: 18.7 },
    { id: 'RJ', name: 'Rajasthan', kiosks: 3, checkins: 620, growth: 22.1 },
    { id: 'GJ', name: 'Gujarat', kiosks: 2, checkins: 340, growth: 5.2 },
    { id: 'KL', name: 'Kerala', kiosks: 4, checkins: 890, growth: 14.8 },
];

const MOCK_LANGUAGE_DATA = [
    { name: 'Hindi', value: 42 },
    { name: 'English', value: 28 },
    { name: 'Tamil', value: 12 },
    { name: 'Telugu', value: 8 },
    { name: 'Bengali', value: 6 },
    { name: 'Others', value: 4 },
];

const PIE_COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

export default function GeographicReportsPage() {
    const totalKiosks = MOCK_STATE_DATA.reduce((sum, s) => sum + s.kiosks, 0);
    const totalCheckins = MOCK_STATE_DATA.reduce((sum, s) => sum + s.checkins, 0);

    return (
        <div className="p-4 sm:p-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm mb-4">
                <Link href="/reports" className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300">
                    Reports
                </Link>
                <ChevronRight className="w-4 h-4 text-slate-400" />
                <span className="font-medium text-slate-900 dark:text-white">Geographic Insights</span>
            </div>

            <h1 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Geographic & Demographic Insights</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">States Covered</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{MOCK_STATE_DATA.length}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Total Kiosks</p>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{totalKiosks}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Total Check-ins</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{totalCheckins.toLocaleString()}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Non-English Usage</p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">72%</p>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* India Heatmap */}
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        Regional Coverage
                    </h3>
                    <IndiaHeatmap data={MOCK_STATE_DATA} />
                    <div className="flex justify-center gap-4 mt-4">
                        <span className="flex items-center gap-1.5 text-xs text-slate-500">
                            <span className="w-3 h-3 rounded bg-emerald-600" /> High density
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-slate-500">
                            <span className="w-3 h-3 rounded bg-emerald-400" /> Medium
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-slate-500">
                            <span className="w-3 h-3 rounded bg-emerald-200" /> Low
                        </span>
                    </div>
                </div>

                {/* Language Distribution */}
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                        <Languages className="w-4 h-4 text-slate-400" />
                        Language Distribution
                    </h3>
                    <DonutChartComponent data={MOCK_LANGUAGE_DATA} height={200} />
                    <div className="grid grid-cols-3 gap-2 mt-4">
                        {MOCK_LANGUAGE_DATA.map((lang, idx) => (
                            <div key={lang.name} className="flex items-center gap-2">
                                <span
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                                />
                                <span className="text-xs text-slate-600 dark:text-slate-400">{lang.name}</span>
                                <span className="text-xs font-medium text-slate-900 dark:text-white ml-auto">{lang.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* State Performance Table */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Globe className="w-4 h-4 text-slate-400" />
                        State-wise Performance
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">State</th>
                                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Kiosks</th>
                                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Check-ins</th>
                                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Avg/Kiosk</th>
                                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Growth</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {MOCK_STATE_DATA.map((state) => (
                                <tr key={state.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                    <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">{state.name}</td>
                                    <td className="px-4 py-3 text-right text-sm text-slate-700 dark:text-slate-300">{state.kiosks}</td>
                                    <td className="px-4 py-3 text-right text-sm font-medium text-emerald-600 dark:text-emerald-400">{state.checkins.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-right text-sm text-slate-500 dark:text-slate-400">{Math.round(state.checkins / state.kiosks)}</td>
                                    <td className="px-4 py-3 text-right">
                                        <span className="inline-flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400">
                                            <TrendingUp className="w-3 h-3" />
                                            +{state.growth}%
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
