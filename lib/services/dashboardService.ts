/**
 * Dashboard Service
 * 
 * Abstracts all dashboard-related data fetching.
 */

import { MOCK_HOTELS, MOCK_METRICS, MOCK_KIOSKS } from '@/lib/admin/mock-data';

// Simulate network delay
const delay = (ms: number = 200) => new Promise(resolve => setTimeout(resolve, ms));

// Types
export interface DashboardMetrics {
    totalHotels: number;
    activeHotels: number;
    activeKiosks: number;
    onlineKiosks: number;
    offlineKiosks: number;
    warningKiosks: number;
    aiAdoptionRate: number;
    todayCheckins: number;
}

export interface Alert {
    id: string;
    type: 'offline' | 'payment' | 'contract' | 'other';
    title: string;
    message: string;
    severity: 'critical' | 'warning' | 'info';
    time: string;
    href: string;
}

export interface ChartDataPoint {
    name: string;
    value?: number;
    checkins?: number;
}

export interface QuickAccessItem {
    name: string;
    description: string;
    href: string;
    icon: string;
    color: string;
}

// Mock data
const MOCK_ALERTS: Alert[] = [
    {
        id: 'a-001',
        type: 'offline',
        title: 'Kiosk Offline > 24hrs',
        message: 'ATC-SN-7766 at Lemon Tree Premier',
        severity: 'critical',
        time: '2 hours ago',
        href: '/fleet',
    },
    {
        id: 'a-002',
        type: 'payment',
        title: 'Payment Overdue',
        message: 'Lemon Tree Premier - ₹25,000',
        severity: 'warning',
        time: '9 days overdue',
        href: '/invoices',
    },
    {
        id: 'a-003',
        type: 'contract',
        title: 'Contract Expiring',
        message: 'Ginger Hotel - expires in 15 days',
        severity: 'info',
        time: 'Action needed',
        href: '/hotels',
    },
];

const CHECKIN_TREND: ChartDataPoint[] = [
    { name: 'Mon', checkins: 145 },
    { name: 'Tue', checkins: 178 },
    { name: 'Wed', checkins: 156 },
    { name: 'Thu', checkins: 189 },
    { name: 'Fri', checkins: 234 },
    { name: 'Sat', checkins: 267 },
    { name: 'Sun', checkins: 198 },
];

const HEALTH_TREND: ChartDataPoint[] = [
    { name: 'Mon', value: 92 },
    { name: 'Tue', value: 95 },
    { name: 'Wed', value: 88 },
    { name: 'Thu', value: 94 },
    { name: 'Fri', value: 96 },
    { name: 'Sat', value: 98 },
    { name: 'Sun', value: 95 },
];

export const dashboardService = {
    /**
     * Get dashboard metrics
     */
    async getMetrics(): Promise<DashboardMetrics> {
        await delay();

        const onlineKiosks = MOCK_KIOSKS.filter(k => k.status === 'online').length;
        const offlineKiosks = MOCK_KIOSKS.filter(k => k.status === 'offline').length;
        const warningKiosks = MOCK_KIOSKS.filter(k => k.status === 'warning').length;
        const todayCheckins = CHECKIN_TREND[CHECKIN_TREND.length - 1].checkins || 0;

        return {
            totalHotels: MOCK_METRICS.totalHotels,
            activeHotels: MOCK_HOTELS.filter(h => h.status === 'active').length,
            activeKiosks: MOCK_METRICS.activeKiosks,
            onlineKiosks,
            offlineKiosks,
            warningKiosks,
            aiAdoptionRate: 74,
            todayCheckins,
        };
    },

    /**
     * Get alerts requiring attention
     */
    async getAlerts(): Promise<Alert[]> {
        await delay(100);
        return [...MOCK_ALERTS];
    },

    /**
     * Get check-in trend data
     */
    async getCheckinTrend(): Promise<ChartDataPoint[]> {
        await delay(100);
        return [...CHECKIN_TREND];
    },

    /**
     * Get system health trend
     */
    async getHealthTrend(): Promise<ChartDataPoint[]> {
        await delay(100);
        return [...HEALTH_TREND];
    },

    /**
     * Get kiosk status distribution
     */
    async getKioskStatusDistribution(): Promise<ChartDataPoint[]> {
        await delay(100);
        return [
            { name: 'Online', value: MOCK_KIOSKS.filter(k => k.status === 'online').length },
            { name: 'Offline', value: MOCK_KIOSKS.filter(k => k.status === 'offline').length },
            { name: 'Warning', value: MOCK_KIOSKS.filter(k => k.status === 'warning').length },
        ];
    },
};
