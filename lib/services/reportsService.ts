/**
 * Reports Service
 * 
 * Abstracts all reports/analytics data fetching.
 */

import type { ServiceResponse } from './hotelService';
import { api } from '@/lib/api';

// Check if mock mode is enabled
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';

// Simulate network delay for mock data
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

// Report query params interface
export interface ReportQueryParams {
    search?: string;
    status?: string;
    plan?: string;
    role?: string;
    action?: string;
    period?: string;
    dateFrom?: string;
    dateTo?: string;
    skip?: number;
    limit?: number;
}

// Report response types from API
export interface HotelReportItem {
    id: number;
    name: string;
    city?: string;
    state?: string;
    status: string;
    plan: string;
    kiosks: number;
    created_at?: string;
}

export interface InvoiceReportItem {
    id: number;
    invoice_number: string;
    hotel_name: string;
    amount: number;
    currency: string;
    status: string;
    due_date?: string;
    paid_date?: string;
}

export interface SubscriptionReportItem {
    hotel_id: number;
    hotel_name: string;
    plan: string;
    status: string;
    amount: number;
    currency: string;
    start_date?: string;
    renewal_date?: string;
}

export interface UserReportItem {
    id: number;
    name: string;
    email: string;
    role: string;
    hotel_name?: string;
    status: string;
    last_active?: string;
}

export interface AuditLogReportItem {
    id: number;
    timestamp: string;
    user_email?: string;
    action: string;
    resource: string;
    details?: string;
}

export interface RevenueReportItem {
    hotel_id: number;
    hotel_name: string;
    period: string;
    subscriptions: number;
    addons: number;
    total: number;
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

    // ============================================
    // Report Export Data Methods (API-backed)
    // ============================================

    /**
     * Get hotels report data for export
     */
    async getHotelsReport(params?: ReportQueryParams): Promise<{ data: HotelReportItem[]; total: number }> {
        if (USE_MOCK) {
            await delay(300);
            return {
                data: MOCK_TOP_HOTELS.map((h, i) => ({
                    id: i + 1,
                    name: h.name,
                    city: 'City',
                    state: 'State',
                    status: 'active',
                    plan: h.category.toLowerCase(),
                    kiosks: Math.floor(Math.random() * 10) + 1,
                })),
                total: MOCK_TOP_HOTELS.length,
            };
        }
        try {
            const response = await api.reports.hotels({
                search: params?.search,
                status: params?.status,
                plan: params?.plan,
                date_from: params?.dateFrom,
                date_to: params?.dateTo,
                skip: params?.skip,
                limit: params?.limit,
            });
            return response.data as { data: HotelReportItem[]; total: number };
        } catch (error) {
            console.error('Failed to fetch hotels report:', error);
            return { data: [], total: 0 };
        }
    },

    /**
     * Get invoices report data for export
     */
    async getInvoicesReport(params?: ReportQueryParams): Promise<{ data: InvoiceReportItem[]; total: number }> {
        if (USE_MOCK) {
            await delay(300);
            return {
                data: [
                    { id: 1, invoice_number: 'INV-2024-001', hotel_name: 'Grand Hyatt', amount: 25000, currency: 'INR', status: 'paid', due_date: '2024-02-15', paid_date: '2024-02-10' },
                    { id: 2, invoice_number: 'INV-2024-002', hotel_name: 'Taj Palace', amount: 50000, currency: 'INR', status: 'pending', due_date: '2024-03-20' },
                ],
                total: 2,
            };
        }
        try {
            const response = await api.reports.invoices({
                search: params?.search,
                status: params?.status,
                date_from: params?.dateFrom,
                date_to: params?.dateTo,
                skip: params?.skip,
                limit: params?.limit,
            });
            return response.data as { data: InvoiceReportItem[]; total: number };
        } catch (error) {
            console.error('Failed to fetch invoices report:', error);
            return { data: [], total: 0 };
        }
    },

    /**
     * Get subscriptions report data for export
     */
    async getSubscriptionsReport(params?: ReportQueryParams): Promise<{ data: SubscriptionReportItem[]; total: number }> {
        if (USE_MOCK) {
            await delay(300);
            return {
                data: MOCK_TOP_HOTELS.map((h, i) => ({
                    hotel_id: i + 1,
                    hotel_name: h.name,
                    plan: h.category.toLowerCase(),
                    status: 'active',
                    amount: h.category === 'Luxury' ? 50000 : h.category === 'Business' ? 25000 : 15000,
                    currency: 'INR',
                    start_date: '2024-01-01',
                    renewal_date: '2025-01-01',
                })),
                total: MOCK_TOP_HOTELS.length,
            };
        }
        try {
            const response = await api.reports.subscriptions({
                search: params?.search,
                plan: params?.plan,
                status: params?.status,
                skip: params?.skip,
                limit: params?.limit,
            });
            return response.data as { data: SubscriptionReportItem[]; total: number };
        } catch (error) {
            console.error('Failed to fetch subscriptions report:', error);
            return { data: [], total: 0 };
        }
    },

    /**
     * Get users report data for export
     */
    async getUsersReport(params?: ReportQueryParams): Promise<{ data: UserReportItem[]; total: number }> {
        if (USE_MOCK) {
            await delay(300);
            return {
                data: [
                    { id: 1, name: 'Raj Sharma', email: 'raj@hyatt.com', role: 'Admin', hotel_name: 'Grand Hyatt', status: 'Active', last_active: '2024-03-15' },
                    { id: 2, name: 'Priya Patel', email: 'priya@taj.com', role: 'Manager', hotel_name: 'Taj Palace', status: 'Active', last_active: '2024-03-14' },
                ],
                total: 2,
            };
        }
        try {
            const response = await api.reports.users({
                search: params?.search,
                role: params?.role,
                status: params?.status,
                skip: params?.skip,
                limit: params?.limit,
            });
            return response.data as { data: UserReportItem[]; total: number };
        } catch (error) {
            console.error('Failed to fetch users report:', error);
            return { data: [], total: 0 };
        }
    },

    /**
     * Get audit logs report data for export
     */
    async getAuditReport(params?: ReportQueryParams): Promise<{ data: AuditLogReportItem[]; total: number }> {
        if (USE_MOCK) {
            await delay(300);
            return {
                data: [
                    { id: 1, timestamp: '2024-03-15T10:30:45Z', user_email: 'raj@hyatt.com', action: 'update', resource: 'Hotel Settings', details: 'Updated contact email' },
                    { id: 2, timestamp: '2024-03-15T09:15:22Z', user_email: 'admin@hms.com', action: 'create', resource: 'User', details: 'Created new manager account' },
                ],
                total: 2,
            };
        }
        try {
            const response = await api.reports.audit({
                search: params?.search,
                action: params?.action,
                date_from: params?.dateFrom,
                date_to: params?.dateTo,
                skip: params?.skip,
                limit: params?.limit,
            });
            return response.data as { data: AuditLogReportItem[]; total: number };
        } catch (error) {
            console.error('Failed to fetch audit report:', error);
            return { data: [], total: 0 };
        }
    },

    /**
     * Get revenue report data for export
     */
    async getRevenueReport(params?: ReportQueryParams): Promise<{ data: RevenueReportItem[]; total: number; grand_total: number }> {
        if (USE_MOCK) {
            await delay(300);
            const data = MOCK_TOP_HOTELS.map((h, i) => ({
                hotel_id: i + 1,
                hotel_name: h.name,
                period: 'Mar 2024',
                subscriptions: h.category === 'Luxury' ? 50000 : h.category === 'Business' ? 25000 : 15000,
                addons: Math.floor(Math.random() * 10000),
                total: h.category === 'Luxury' ? 55000 : h.category === 'Business' ? 28000 : 17000,
            }));
            return {
                data,
                total: data.length,
                grand_total: data.reduce((sum, r) => sum + r.total, 0),
            };
        }
        try {
            const response = await api.reports.revenue({
                search: params?.search,
                period: params?.period,
                date_from: params?.dateFrom,
                date_to: params?.dateTo,
                skip: params?.skip,
                limit: params?.limit,
            });
            return response.data as { data: RevenueReportItem[]; total: number; grand_total: number };
        } catch (error) {
            console.error('Failed to fetch revenue report:', error);
            return { data: [], total: 0, grand_total: 0 };
        }
    },
};

