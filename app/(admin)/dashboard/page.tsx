'use client';

/**
 * Dashboard Page
 * 
 * Admin dashboard with KPIs, charts, alerts, and quick access.
 * Uses components from admin/dashboard.
 */

import {
    DashboardHeader,
    DashboardKPIs,
    DashboardCharts,
    AlertsFeed,
    QuickAccessGrid,
    useDashboard,
} from '@/components/admin/dashboard';

export default function Dashboard() {
    const {
        metrics,
        alerts,
        checkinTrend,
        healthTrend,
        kioskStatusDistribution,
        isLoading,
    } = useDashboard();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-normal space-y-4">
            {/* Header */}
            <DashboardHeader alerts={alerts} />

            {/* KPI Cards */}
            <DashboardKPIs metrics={metrics} />

            {/* Charts Row */}
            <DashboardCharts
                checkinTrend={checkinTrend}
                healthTrend={healthTrend}
                kioskStatusDistribution={kioskStatusDistribution}
            />

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <AlertsFeed alerts={alerts} />
                <QuickAccessGrid />
            </div>
        </div>
    );
}
