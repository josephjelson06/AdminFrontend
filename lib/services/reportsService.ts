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
    id: string;
    name: string;
    checkins: number;
    selfCheckInRate: number;
    trend: number;
    category: 'Luxury' | 'Business' | 'Budget';
}

export interface UnderperformingHotel {
    id: string;
    name: string;
    checkins: number;
    selfCheckInRate: number;
    issue: string;
    severity: 'critical' | 'warning' | 'info';
}

export interface CategoryPerformance {
    name: string;
    value: number;
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

export interface OperationalKioskMetrics {
    id: string;
    hotelId: string;
    hotelName: string;
    state: string;
    checkins: number;
    avgPerDay: number;
    utilization: number;
    status: 'active' | 'maintenance';
}

export interface OperationalFilters {
    search?: string;
    state?: string;
    hotelId?: string;
    dateFrom?: string;
    dateTo?: string;
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
    { id: 'h-001', name: 'Royal Orchid Bangalore', checkins: 1250, selfCheckInRate: 78, trend: 12.5, category: 'Luxury' },
    { id: 'h-010', name: 'The Leela Palace', checkins: 1180, selfCheckInRate: 85, trend: 15.2, category: 'Luxury' },
    { id: 'h-005', name: 'Taj Palace', checkins: 980, selfCheckInRate: 82, trend: 8.3, category: 'Luxury' },
    { id: 'h-003', name: 'Ginger Hotel, Panjim', checkins: 520, selfCheckInRate: 72, trend: 5.1, category: 'Budget' },
    { id: 'h-008', name: 'Marriott Suites', checkins: 890, selfCheckInRate: 76, trend: 10.8, category: 'Business' },
];

const MOCK_UNDERPERFORMING: UnderperformingHotel[] = [
    { id: 'h-009', name: 'Holiday Inn', checkins: 180, selfCheckInRate: 42, issue: 'Low adoption rate', severity: 'warning' },
    { id: 'h-007', name: 'Radisson Blu', checkins: 220, selfCheckInRate: 38, issue: 'Declining usage -15%', severity: 'critical' },
    { id: 'h-012', name: 'Trident Nariman', checkins: 290, selfCheckInRate: 55, issue: 'Below average', severity: 'info' },
];

const CATEGORY_PERFORMANCE: CategoryPerformance[] = [
    { name: 'Luxury', value: 85 },
    { name: 'Business', value: 70 },
    { name: 'Budget', value: 62 },
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

const MOCK_OPERATIONAL_DATA: OperationalKioskMetrics[] = [
    { id: 'K-001', hotelId: 'h-001', hotelName: 'Royal Orchid Bangalore', state: 'Karnataka', checkins: 245, avgPerDay: 35, utilization: 82, status: 'active' },
    { id: 'K-002', hotelId: 'h-001', hotelName: 'Royal Orchid Bangalore', state: 'Karnataka', checkins: 198, avgPerDay: 28, utilization: 75, status: 'active' },
    { id: 'K-003', hotelId: 'h-002', hotelName: 'Lemon Tree Premier', state: 'Maharashtra', checkins: 156, avgPerDay: 22, utilization: 68, status: 'active' },
    { id: 'K-004', hotelId: 'h-003', hotelName: 'Ginger Hotel Panjim', state: 'Goa', checkins: 89, avgPerDay: 13, utilization: 45, status: 'maintenance' },
    { id: 'K-005', hotelId: 'h-005', hotelName: 'ITC Maratha', state: 'Maharashtra', checkins: 312, avgPerDay: 45, utilization: 92, status: 'active' },
    { id: 'K-006', hotelId: 'h-006', hotelName: 'Marriott Suites', state: 'Delhi NCR', checkins: 178, avgPerDay: 25, utilization: 71, status: 'active' },
    { id: 'K-007', hotelId: 'h-007', hotelName: 'The Leela Palace', state: 'Karnataka', checkins: 267, avgPerDay: 38, utilization: 85, status: 'active' },
    { id: 'K-008', hotelId: 'h-001', hotelName: 'Royal Orchid Bangalore', state: 'Karnataka', checkins: 145, avgPerDay: 21, utilization: 62, status: 'active' },
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
        await delay(300);
        return [...MOCK_TOP_HOTELS];
    },

    /**
     * Get underperforming hotels
     */
    async getUnderperformingHotels(): Promise<UnderperformingHotel[]> {
        await delay(400);
        return [...MOCK_UNDERPERFORMING];
    },

    /**
     * Get category performance
     */
    async getCategoryPerformance(): Promise<CategoryPerformance[]> {
        await delay(200);
        return [...CATEGORY_PERFORMANCE];
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
     * Get operational metrics report
     */
    async getOperationalReport(filters?: OperationalFilters): Promise<OperationalKioskMetrics[]> {
        await delay(500); // Simulate processing time

        let data = [...MOCK_OPERATIONAL_DATA];

        if (filters?.search) {
            const query = filters.search.toLowerCase();
            data = data.filter(item =>
                item.id.toLowerCase().includes(query) ||
                item.hotelName.toLowerCase().includes(query)
            );
        }

        if (filters?.state && filters.state !== 'all') {
            data = data.filter(item => item.state === filters.state);
        }

        if (filters?.hotelId && filters.hotelId !== 'all') {
            data = data.filter(item => item.hotelId === filters.hotelId);
        }

        return data;
    },

    /**
     * Get available filters for operational report
     */
    async getOperationalFilters() {
        await delay(100);

        // Extract unique states
        const states = Array.from(new Set(MOCK_OPERATIONAL_DATA.map(d => d.state)))
            .map(state => ({ id: state, name: state }));

        // Extract unique hotels
        const hotels = Array.from(new Set(MOCK_OPERATIONAL_DATA.map(d => JSON.stringify({ id: d.hotelId, name: d.hotelName }))))
            .map(str => JSON.parse(str));

        return {
            states: [{ id: 'all', name: 'All States' }, ...states],
            hotels: [{ id: 'all', name: 'All Hotels' }, ...hotels],
        };
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
