'use client';

/**
 * ReportsOverview Component
 * 
 * Main reports dashboard component.
 */

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
    Share2,
} from 'lucide-react';
import { IndiaHeatmap } from '@/components/shared/ui/IndiaHeatmap';
import { AreaChartComponent, BarChartComponent, DonutChartComponent, LineChartComponent } from '@/components/shared/ui/Charts';
import { ReportsFilter } from './ReportsFilter';
import { ReportsKPIs } from './ReportsKPIs';
import { useReports } from './useReports';
import { useToast } from '@/components/shared/ui/Toast';
import type { DateRange } from './DateRangeFilter';

export function ReportsOverview() {
    const { addToast } = useToast();
    const {
        metrics,
        checkinTrend,
        languageData,
        topHotels,
        stateData,
        dailyPattern,
        isLoading,
        exportCSV,
    } = useReports();

    const [dateRange, setDateRange] = useState<DateRange>({
        from: subMonths(new Date(), 6),
        to: new Date(),
    });

    const handleExport = async () => {
        try {
            await exportCSV();
            addToast('success', 'Report Downloaded', 'The state performance report has been generated.');
        } catch {
            addToast('error', 'Export Failed', 'Could not generate the CSV file.');
        }
    };

    if (isLoading) {
        return (
            <div className="p-4 sm:p-6 flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 space-y-6 animate-in fade-in duration-normal">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-primary">Analytics Overview</h1>
                    <p className="text-sm text-muted">Business intelligence and usage insights</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <ReportsFilter date={dateRange} onDateChange={setDateRange} />
                    <div className="h-8 w-px bg-glass hidden sm:block" />
                    <button onClick={handleExport} className="btn-secondary">
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Export CSV</span>
                    </button>
                    <Link href="/reports/usage" className="btn-primary">
                        <FileText className="w-4 h-4" />
                        Detailed Reports
                    </Link>
                </div>
            </div>

            {/* KPIs */}
            <ReportsKPIs metrics={metrics} />

            {/* Main Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Check-ins Trend */}
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
                        data={checkinTrend as unknown as Array<{ name: string;[key: string]: string | number | undefined }>}
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
                        data={dailyPattern as unknown as Array<{ name: string;[key: string]: string | number | undefined }>}
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
                    <DonutChartComponent data={languageData} height={200} />
                    <div className="grid grid-cols-3 gap-2 mt-6">
                        {languageData.slice(0, 6).map((lang, idx) => (
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
                    <IndiaHeatmap data={stateData} />
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
                            data={topHotels.map(h => ({ name: h.name.split(' ')[0], value: h.checkins }))}
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
                            {stateData.slice(0, 6).map((region) => (
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
