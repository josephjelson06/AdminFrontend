/**
 * Reports Service
 * 
 * Abstracts all reports/analytics data fetching.
 */

import type { ServiceResponse } from './hotelService';

// Simulate network delay
const delay = (ms: number = 200) => new Promise(resolve => setTimeout(resolve, ms));

// Types
export interface CheckinDataPoint {
    name: string;
    checkins: number;
    aiSessions: number;
}

export interface LanguageDataPoint {
    name: string;
    value: number;
}

export interface TopHotel {
    name: string;
    checkins: number;
    selfCheckInRate: number;
}

export interface StateData {
    id: string;
    name: string;
    kiosks: number;
    checkins: number;
}

export interface DailyDataPoint {
    name: string;
    value: number;
}

export interface ReportsMetrics {
    totalCheckins: number;
    deployedKiosks: number;
    statesCount: number;
    avgSelfCheckInRate: number;
    nonEnglishUsage: number;
}

// Mock data
const MOCK_CHECKIN_DATA: CheckinDataPoint[] = [
    { name: 'Aug', checkins: 1240, aiSessions: 890 },
    { name: 'Sep', checkins: 1580, aiSessions: 1120 },
    { name: 'Oct', checkins: 1920, aiSessions: 1450 },
    { name: 'Nov', checkins: 2340, aiSessions: 1780 },
    { name: 'Dec', checkins: 2890, aiSessions: 2200 },
    { name: 'Jan', checkins: 3150, aiSessions: 2450 },
];

const MOCK_LANGUAGE_DATA: LanguageDataPoint[] = [
    { name: 'Hindi', value: 42 },
    { name: 'English', value: 28 },
    { name: 'Tamil', value: 12 },
    { name: 'Telugu', value: 8 },
    { name: 'Bengali', value: 6 },
    { name: 'Others', value: 4 },
];

const MOCK_TOP_HOTELS: TopHotel[] = [
    { name: 'Royal Orchid Bangalore', checkins: 1250, selfCheckInRate: 78 },
    { name: 'Lemon Tree Premier', checkins: 890, selfCheckInRate: 65 },
    { name: 'Ginger Hotel, Panjim', checkins: 520, selfCheckInRate: 82 },
    { name: 'Taj Palace Mumbai', checkins: 490, selfCheckInRate: 71 },
];

const MOCK_STATE_DATA: StateData[] = [
    { id: 'KA', name: 'Karnataka', kiosks: 12, checkins: 2450 },
    { id: 'MH', name: 'Maharashtra', kiosks: 8, checkins: 1890 },
    { id: 'GA', name: 'Goa', kiosks: 4, checkins: 780 },
    { id: 'TN', name: 'Tamil Nadu', kiosks: 6, checkins: 1120 },
    { id: 'DL', name: 'Delhi NCR', kiosks: 5, checkins: 950 },
    { id: 'RJ', name: 'Rajasthan', kiosks: 3, checkins: 620 },
    { id: 'GJ', name: 'Gujarat', kiosks: 2, checkins: 340 },
    { id: 'KL', name: 'Kerala', kiosks: 4, checkins: 890 },
    { id: 'AP', name: 'Andhra Pradesh', kiosks: 3, checkins: 560 },
    { id: 'TS', name: 'Telangana', kiosks: 2, checkins: 410 },
    { id: 'WB', name: 'West Bengal', kiosks: 1, checkins: 220 },
    { id: 'UP', name: 'Uttar Pradesh', kiosks: 2, checkins: 380 },
];

const DAILY_DATA: DailyDataPoint[] = [
    { name: 'Mon', value: 145 },
    { name: 'Tue', value: 178 },
    { name: 'Wed', value: 156 },
    { name: 'Thu', value: 189 },
    { name: 'Fri', value: 234 },
    { name: 'Sat', value: 267 },
    { name: 'Sun', value: 198 },
];

export const reportsService = {
    /**
     * Get reports metrics
     */
    async getMetrics(): Promise<ReportsMetrics> {
        await delay();
        const totalCheckins = MOCK_CHECKIN_DATA.reduce((sum, d) => sum + d.checkins, 0);
        const deployedKiosks = MOCK_STATE_DATA.reduce((sum, d) => sum + d.kiosks, 0);
        return {
            totalCheckins,
            deployedKiosks,
            statesCount: MOCK_STATE_DATA.length,
            avgSelfCheckInRate: 74,
            nonEnglishUsage: 72,
        };
    },

    /**
     * Get checkin trend data
     */
    async getCheckinTrend(): Promise<CheckinDataPoint[]> {
        await delay(100);
        return [...MOCK_CHECKIN_DATA];
    },

    /**
     * Get language distribution
     */
    async getLanguageDistribution(): Promise<LanguageDataPoint[]> {
        await delay(100);
        return [...MOCK_LANGUAGE_DATA];
    },

    /**
     * Get top performing hotels
     */
    async getTopHotels(): Promise<TopHotel[]> {
        await delay(100);
        return [...MOCK_TOP_HOTELS];
    },

    /**
     * Get state-wise data
     */
    async getStateData(): Promise<StateData[]> {
        await delay(100);
        return [...MOCK_STATE_DATA];
    },

    /**
     * Get daily pattern data
     */
    async getDailyPattern(): Promise<DailyDataPoint[]> {
        await delay(100);
        return [...DAILY_DATA];
    },

    /**
     * Export state data as CSV
     */
    async exportStateDataCSV(): Promise<ServiceResponse<Blob>> {
        await delay(300);
        const headers = 'State,Active Kiosks,Total Check-ins\n';
        const rows = MOCK_STATE_DATA.map(s => `${s.name},${s.kiosks},${s.checkins}`).join('\n');
        const blob = new Blob([headers + rows], { type: 'text/csv' });
        return { success: true, data: blob, error: undefined };
    },
};
