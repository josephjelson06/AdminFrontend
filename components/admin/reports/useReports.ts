'use client';

/**
 * useReports Hook
 * 
 * Manages reports data fetching.
 */

import { useState, useEffect, useCallback } from 'react';
import {
    reportsService,
    type ReportsMetrics,
    type CheckinDataPoint,
    type LanguageDataPoint,
    type TopHotel,
    type StateData,
    type DailyDataPoint,
} from '@/lib/services/reportsService';

export interface UseReportsReturn {
    metrics: ReportsMetrics;
    checkinTrend: CheckinDataPoint[];
    languageData: LanguageDataPoint[];
    topHotels: TopHotel[];
    stateData: StateData[];
    dailyPattern: DailyDataPoint[];
    isLoading: boolean;
    error: Error | null;
    exportCSV: () => Promise<void>;
}

const defaultMetrics: ReportsMetrics = {
    totalCheckins: 0,
    deployedKiosks: 0,
    statesCount: 0,
    avgSelfCheckInRate: 0,
    nonEnglishUsage: 0,
};

export function useReports(): UseReportsReturn {
    const [metrics, setMetrics] = useState<ReportsMetrics>(defaultMetrics);
    const [checkinTrend, setCheckinTrend] = useState<CheckinDataPoint[]>([]);
    const [languageData, setLanguageData] = useState<LanguageDataPoint[]>([]);
    const [topHotels, setTopHotels] = useState<TopHotel[]>([]);
    const [stateData, setStateData] = useState<StateData[]>([]);
    const [dailyPattern, setDailyPattern] = useState<DailyDataPoint[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            setError(null);
            try {
                const [
                    metricsData,
                    checkinData,
                    langData,
                    hotelsData,
                    statesData,
                    dailyData,
                ] = await Promise.all([
                    reportsService.getMetrics(),
                    reportsService.getCheckinTrend(),
                    reportsService.getLanguageDistribution(),
                    reportsService.getTopHotels(),
                    reportsService.getStateData(),
                    reportsService.getDailyPattern(),
                ]);
                setMetrics(metricsData);
                setCheckinTrend(checkinData);
                setLanguageData(langData);
                setTopHotels(hotelsData);
                setStateData(statesData);
                setDailyPattern(dailyData);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to load reports'));
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    const exportCSV = useCallback(async () => {
        const result = await reportsService.exportStateDataCSV();
        if (result.success && result.data) {
            const url = URL.createObjectURL(result.data);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'state_performance_report.csv';
            a.click();
            URL.revokeObjectURL(url);
        }
    }, []);

    return {
        metrics,
        checkinTrend,
        languageData,
        topHotels,
        stateData,
        dailyPattern,
        isLoading,
        error,
        exportCSV,
    };
}
