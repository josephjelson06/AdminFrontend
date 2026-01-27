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
        <div className="p-4 sm:p-6 animate-in fade-in duration-normal">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm mb-4">
                <Link href="/reports" className="text-muted hover:text-secondary-text">
                    Reports
                </Link>
                <ChevronRight className="w-4 h-4 text-muted" />
                <span className="font-medium text-primary">Geographic Insights</span>
            </div>

            <h1 className="text-xl font-semibold text-primary mb-6">Geographic & Demographic Insights</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="surface-glass-strong rounded-lg border border-glass p-4">
                    <p className="text-xs font-medium text-muted uppercase tracking-wide">States Covered</p>
                    <p className="text-2xl font-bold text-primary mt-1">{MOCK_STATE_DATA.length}</p>
                </div>
                <div className="surface-glass-strong rounded-lg border border-glass p-4">
                    <p className="text-xs font-medium text-muted uppercase tracking-wide">Total Kiosks</p>
                    <p className="text-2xl font-bold text-success mt-1">{totalKiosks}</p>
                </div>
                <div className="surface-glass-strong rounded-lg border border-glass p-4">
                    <p className="text-xs font-medium text-muted uppercase tracking-wide">Total Check-ins</p>
                    <p className="text-2xl font-bold text-primary mt-1">{totalCheckins.toLocaleString()}</p>
                </div>
                <div className="surface-glass-strong rounded-lg border border-glass p-4">
                    <p className="text-xs font-medium text-muted uppercase tracking-wide">Non-English Usage</p>
                    <p className="text-2xl font-bold text-info mt-1">72%</p>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* India Heatmap */}
                <div className="surface-glass-strong rounded-lg border border-glass p-4">
                    <h3 className="text-sm font-semibold text-primary flex items-center gap-2 mb-4">
                        <MapPin className="w-4 h-4 text-muted" />
                        Regional Coverage
                    </h3>
                    <IndiaHeatmap data={MOCK_STATE_DATA} />
                    <div className="flex justify-center gap-4 mt-4">
                        <span className="flex items-center gap-1.5 text-xs text-muted">
                            <span className="w-3 h-3 rounded bg-success" /> High density
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-muted">
                            <span className="w-3 h-3 rounded bg-success/60" /> Medium
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-muted">
                            <span className="w-3 h-3 rounded bg-success/30" /> Low
                        </span>
                    </div>
                </div>

                {/* Language Distribution */}
                <div className="surface-glass-strong rounded-lg border border-glass p-4">
                    <h3 className="text-sm font-semibold text-primary flex items-center gap-2 mb-4">
                        <Languages className="w-4 h-4 text-muted" />
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
                                <span className="text-xs text-secondary-text">{lang.name}</span>
                                <span className="text-xs font-medium text-primary ml-auto">{lang.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* State Performance Table */}
            <div className="surface-glass-strong rounded-lg border border-glass">
                <div className="px-4 py-3 border-b border-glass">
                    <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
                        <Globe className="w-4 h-4 text-muted" />
                        State-wise Performance
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="table-glass">
                        <thead>
                            <tr className="surface-glass-soft border-b border-glass">
                                <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase">State</th>
                                <th className="text-right px-4 py-3 text-xs font-semibold text-muted uppercase">Kiosks</th>
                                <th className="text-right px-4 py-3 text-xs font-semibold text-muted uppercase">Check-ins</th>
                                <th className="text-right px-4 py-3 text-xs font-semibold text-muted uppercase">Avg/Kiosk</th>
                                <th className="text-right px-4 py-3 text-xs font-semibold text-muted uppercase">Growth</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-glass">
                            {MOCK_STATE_DATA.map((state) => (
                                <tr key={state.id} className="glass-hover">
                                    <td className="px-4 py-3 text-sm font-medium text-primary">{state.name}</td>
                                    <td className="px-4 py-3 text-right text-sm text-secondary-text">{state.kiosks}</td>
                                    <td className="px-4 py-3 text-right text-sm font-medium text-success">{state.checkins.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-right text-sm text-muted">{Math.round(state.checkins / state.kiosks)}</td>
                                    <td className="px-4 py-3 text-right">
                                        <span className="inline-flex items-center gap-1 text-sm text-success">
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
