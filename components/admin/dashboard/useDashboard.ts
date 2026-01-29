'use client';

/**
 * useDashboard Hook
 * 
 * Manages dashboard data fetching.
 */

import { useState, useEffect, useCallback } from 'react';
import { dashboardService, type DashboardMetrics, type Alert, type ChartDataPoint } from '@/lib/services/dashboardService';

export interface UseDashboardReturn {
    // Data
    metrics: DashboardMetrics;
    alerts: Alert[];
    checkinTrend: ChartDataPoint[];
    healthTrend: ChartDataPoint[];
    kioskStatusDistribution: ChartDataPoint[];

    // State
    isLoading: boolean;
    error: Error | null;

    // Actions
    refresh: () => void;
}

const defaultMetrics: DashboardMetrics = {
    totalHotels: 0,
    activeHotels: 0,
    activeKiosks: 0,
    onlineKiosks: 0,
    offlineKiosks: 0,
    warningKiosks: 0,
    aiAdoptionRate: 0,
    todayCheckins: 0,
};

export function useDashboard(): UseDashboardReturn {
    const [metrics, setMetrics] = useState<DashboardMetrics>(defaultMetrics);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [checkinTrend, setCheckinTrend] = useState<ChartDataPoint[]>([]);
    const [healthTrend, setHealthTrend] = useState<ChartDataPoint[]>([]);
    const [kioskStatusDistribution, setKioskStatusDistribution] = useState<ChartDataPoint[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const [
                metricsData,
                alertsData,
                checkinData,
                healthData,
                kioskData,
            ] = await Promise.all([
                dashboardService.getMetrics(),
                dashboardService.getAlerts(),
                dashboardService.getCheckinTrend(),
                dashboardService.getHealthTrend(),
                dashboardService.getKioskStatusDistribution(),
            ]);

            setMetrics(metricsData);
            setAlerts(alertsData);
            setCheckinTrend(checkinData);
            setHealthTrend(healthData);
            setKioskStatusDistribution(kioskData);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch dashboard data'));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        metrics,
        alerts,
        checkinTrend,
        healthTrend,
        kioskStatusDistribution,
        isLoading,
        error,
        refresh: fetchData,
    };
}
