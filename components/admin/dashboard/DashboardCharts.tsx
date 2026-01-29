'use client';

/**
 * DashboardCharts Component
 * 
 * Chart widgets for dashboard.
 */

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { GlassCard } from '@/components/shared/ui/GlassCard';
import { BarChartComponent, DonutChartComponent, AreaChartComponent } from '@/components/shared/ui/Charts';
import type { ChartDataPoint } from '@/lib/services/dashboardService';

interface DashboardChartsProps {
    checkinTrend: ChartDataPoint[];
    healthTrend: ChartDataPoint[];
    kioskStatusDistribution: ChartDataPoint[];
}

export function DashboardCharts({
    checkinTrend,
    healthTrend,
    kioskStatusDistribution,
}: DashboardChartsProps) {
    // Transform for chart compatibility
    const barData = checkinTrend as Array<{ name: string;[key: string]: string | number | undefined }>;
    const areaData = healthTrend as Array<{ name: string;[key: string]: string | number | undefined }>;
    const donutData = kioskStatusDistribution.map(d => ({
        name: d.name,
        value: d.value ?? 0,
    }));

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Check-in Trend */}
            <Link href="/reports/usage" className="block group">
                <GlassCard className="p-4 hover:border-primary/50 transition-all duration-normal" auroraGlow>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-primary">Check-in Trend</h3>
                        <span className="text-xs text-primary flex items-center gap-1">
                            View Details <ChevronRight className="w-3 h-3" />
                        </span>
                    </div>
                    <BarChartComponent
                        data={barData}
                        dataKey="checkins"
                        color="#10b981"
                        height={160}
                    />
                </GlassCard>
            </Link>

            {/* System Health Trend */}
            <Link href="/fleet" className="block group">
                <GlassCard className="p-4 hover:border-primary/50 transition-all duration-normal" auroraGlow>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-primary">System Health</h3>
                        <span className="text-xs text-primary flex items-center gap-1">
                            View Fleet <ChevronRight className="w-3 h-3" />
                        </span>
                    </div>
                    <AreaChartComponent
                        data={areaData}
                        dataKey="value"
                        color="#6366f1"
                        height={160}
                        gradientId="healthGradient"
                    />
                </GlassCard>
            </Link>

            {/* Kiosk Status */}
            <Link href="/fleet" className="block group">
                <GlassCard className="p-4 hover:border-primary/50 transition-all duration-normal">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-primary">Kiosk Status</h3>
                        <span className="text-xs text-primary flex items-center gap-1">
                            Manage <ChevronRight className="w-3 h-3" />
                        </span>
                    </div>
                    <DonutChartComponent data={donutData} height={160} />
                    <div className="flex justify-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-success" />
                            <span className="text-xs text-muted">Online</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-secondary" />
                            <span className="text-xs text-muted">Offline</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-warning" />
                            <span className="text-xs text-muted">Warning</span>
                        </div>
                    </div>
                </GlassCard>
            </Link>
        </div>
    );
}
