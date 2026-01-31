'use client';

/**
 * DashboardKPIs Component
 * 
 * KPI stats grid for hotel dashboard.
 */

import { useRouter } from 'next/navigation';
import { Users, AlertCircle, Monitor, BedDouble } from 'lucide-react';
import { StatCard } from './StatCard';
import type { DashboardStats, SparklineData } from '@/lib/services/hotelDashboardService';

interface DashboardKPIsProps {
    stats: DashboardStats;
    sparklines: SparklineData;
}

export function DashboardKPIs({ stats, sparklines }: DashboardKPIsProps) {
    const router = useRouter();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
                title="Today's Check-ins"
                value={stats.todayCheckIns}
                icon={Users}
                trend="+12%"
                iconBg="bg-indigo-500/10"
                iconColor="text-indigo-500"
                sparklineData={sparklines.checkIns}
            />
            <StatCard
                title="Failed Verifications"
                value={stats.failedVerifications}
                icon={AlertCircle}
                iconBg="bg-rose-500/10"
                iconColor="text-rose-500"
                isAlert={stats.failedVerifications > 0}
                sparklineData={sparklines.failed}
                onClick={() => router.push('/hotel/guests?status=failed')}
            />
            <StatCard
                title="Kiosks Online"
                value={`${stats.onlineKiosks}/${stats.totalKiosks}`}
                icon={Monitor}
                iconBg="bg-emerald-500/10"
                iconColor="text-emerald-500"
                sparklineData={sparklines.kiosks}
            />
            <StatCard
                title="Rooms Ready"
                value={`${stats.readyRooms}/${stats.totalRooms}`}
                icon={BedDouble}
                iconBg="bg-blue-500/10"
                iconColor="text-blue-500"
                sparklineData={sparklines.rooms}
            />
        </div>
    );
}
