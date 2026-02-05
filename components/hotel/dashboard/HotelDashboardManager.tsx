'use client';

/**
 * HotelDashboardManager Component
 * 
 * Main hotel dashboard orchestrating all components.
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HotelLayout } from '@/components/hotel/layout/HotelLayout';
import { useAuth } from '@/lib/auth';
import { useHotelDashboard } from './useHotelDashboard';
import { DashboardHeader } from './DashboardHeader';
import { DashboardKPIs } from './DashboardKPIs';
import { ActivityFeed } from './ActivityFeed';
import { KioskHealthPanel } from './KioskHealthPanel';

export function HotelDashboardManager() {
    const router = useRouter();
    const { user } = useAuth();
    const {
        stats,
        sparklines,
        activity,
        activityFilter,
        setActivityFilter,
        kiosks,
        getKioskName,
        rebootKiosk,
        isLoading,
        lastUpdated,
        refresh,
    } = useHotelDashboard();

    // Redirect maintenance staff
    useEffect(() => {
        if (user?.role === 'maintenance_staff') {
            router.push('/hotel/incidents');
        }
    }, [user, router]);

    if (user?.role === 'maintenance_staff') {
        return (
            <HotelLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
                </div>
            </HotelLayout>
        );
    }

    if (isLoading) {
        return (
            <HotelLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
                </div>
            </HotelLayout>
        );
    }

    return (
        <HotelLayout>
            <div className="max-w-full mx-auto">
                {/* Header */}
                <DashboardHeader
                    userName={user?.name || 'User'}
                    lastUpdated={lastUpdated}
                    onRefresh={refresh}
                />

                {/* KPIs */}
                <DashboardKPIs stats={stats} sparklines={sparklines} />

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Activity Feed */}
                    <ActivityFeed
                        activity={activity}
                        filter={activityFilter}
                        onFilterChange={setActivityFilter}
                        getKioskName={getKioskName}
                    />

                    {/* Kiosk Health */}
                    <KioskHealthPanel
                        kiosks={kiosks}
                        onlineCount={stats.onlineKiosks}
                        onReboot={rebootKiosk}
                    />
                </div>
            </div>
        </HotelLayout>
    );
}
