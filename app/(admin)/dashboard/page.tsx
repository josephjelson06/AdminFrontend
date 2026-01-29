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
            <div className="p-4 sm:p-6 flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 animate-in fade-in duration-normal">
            {/* Header */}
            <div className="mb-6">
                <DashboardHeader alerts={alerts} />
            </div>

            {/* KPI Cards */}
            <div className="mb-6">
                <DashboardKPIs metrics={metrics} />
            </div>

            {/* Charts Row */}
            <div className="mb-6">
                <DashboardCharts
                    checkinTrend={checkinTrend}
                    healthTrend={healthTrend}
                    kioskStatusDistribution={kioskStatusDistribution}
                />
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <AlertsFeed alerts={alerts} />
                <QuickAccessGrid />
            </div>
        </div>
    );
}
