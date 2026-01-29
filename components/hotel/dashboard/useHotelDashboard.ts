'use client';

/**
 * useHotelDashboard Hook
 * 
 * Manages hotel dashboard state and data fetching.
 */

import { useState, useEffect, useCallback } from 'react';
import {
    hotelDashboardService,
    type DashboardStats,
    type SparklineData,
    type ActivityFilter,
} from '@/lib/services/hotelDashboardService';
import type { GuestCheckIn, HotelKiosk } from '@/lib/hotel/hotel-data';

export interface UseHotelDashboardReturn {
    // Stats
    stats: DashboardStats;
    sparklines: SparklineData;

    // Activity
    activity: GuestCheckIn[];
    activityFilter: ActivityFilter;
    setActivityFilter: (filter: ActivityFilter) => void;

    // Kiosks
    kiosks: HotelKiosk[];
    getKioskName: (kioskId: string) => string;
    rebootKiosk: (kioskId: string) => Promise<boolean>;

    // State
    isLoading: boolean;
    lastUpdated: Date;
    refresh: () => void;
}

const defaultStats: DashboardStats = {
    todayCheckIns: 0,
    failedVerifications: 0,
    onlineKiosks: 0,
    totalKiosks: 0,
    readyRooms: 0,
    totalRooms: 0,
    occupiedRooms: 0,
};

const defaultSparklines: SparklineData = {
    checkIns: [],
    failed: [],
    kiosks: [],
    rooms: [],
};

export function useHotelDashboard(): UseHotelDashboardReturn {
    const [stats, setStats] = useState<DashboardStats>(defaultStats);
    const [sparklines, setSparklines] = useState<SparklineData>(defaultSparklines);
    const [activity, setActivity] = useState<GuestCheckIn[]>([]);
    const [activityFilter, setActivityFilter] = useState<ActivityFilter>('All');
    const [kiosks, setKiosks] = useState<HotelKiosk[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [statsData, sparklinesData, activityData, kiosksData] = await Promise.all([
                hotelDashboardService.getStats(),
                hotelDashboardService.getSparklineData(),
                hotelDashboardService.getRecentActivity(activityFilter),
                hotelDashboardService.getKiosks(),
            ]);
            setStats(statsData);
            setSparklines(sparklinesData);
            setActivity(activityData);
            setKiosks(kiosksData);
            setLastUpdated(new Date());
        } finally {
            setIsLoading(false);
        }
    }, [activityFilter]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const rebootKiosk = useCallback(async (kioskId: string): Promise<boolean> => {
        const result = await hotelDashboardService.rebootKiosk(kioskId);
        return result.success;
    }, []);

    return {
        stats,
        sparklines,
        activity,
        activityFilter,
        setActivityFilter,
        kiosks,
        getKioskName: hotelDashboardService.getKioskName,
        rebootKiosk,
        isLoading,
        lastUpdated,
        refresh: fetchData,
    };
}
