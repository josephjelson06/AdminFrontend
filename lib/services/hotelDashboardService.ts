/**
 * Hotel Dashboard Service
 * 
 * Abstracts all hotel dashboard data fetching.
 */

import {
    MOCK_HOTEL_KIOSKS,
    MOCK_GUEST_CHECKINS,
    MOCK_ROOMS,
    type GuestCheckIn,
    type HotelKiosk,
} from '@/lib/hotel/hotel-data';
import type { ServiceResponse } from './hotelService';

// Simulate network delay
const delay = (ms: number = 200) => new Promise(resolve => setTimeout(resolve, ms));

// Types
export interface DashboardStats {
    todayCheckIns: number;
    failedVerifications: number;
    onlineKiosks: number;
    totalKiosks: number;
    readyRooms: number;
    totalRooms: number;
    occupiedRooms: number;
}

export interface SparklineData {
    checkIns: number[];
    failed: number[];
    kiosks: number[];
    rooms: number[];
}

export type ActivityFilter = 'All' | 'Failed' | 'Success';

export const hotelDashboardService = {
    /**
     * Get dashboard stats
     */
    async getStats(): Promise<DashboardStats> {
        await delay(100);
        return {
            todayCheckIns: MOCK_GUEST_CHECKINS.length,
            failedVerifications: MOCK_GUEST_CHECKINS.filter(g => g.verification === 'failed').length,
            onlineKiosks: MOCK_HOTEL_KIOSKS.filter(k => k.status === 'online').length,
            totalKiosks: MOCK_HOTEL_KIOSKS.length,
            readyRooms: MOCK_ROOMS.filter(r => r.status === 'ready').length,
            totalRooms: MOCK_ROOMS.length,
            occupiedRooms: MOCK_ROOMS.filter(r => r.status === 'occupied').length,
        };
    },

    /**
     * Get sparkline data for KPIs
     */
    async getSparklineData(): Promise<SparklineData> {
        await delay(50);
        const failedCount = MOCK_GUEST_CHECKINS.filter(g => g.verification === 'failed').length;
        return {
            checkIns: [12, 18, 14, 25, 20, 32, 24],
            failed: [0, 1, 0, 2, 1, 0, failedCount],
            kiosks: [50, 60, 55, 70, 65, 80, 75],
            rooms: [40, 45, 42, 48, 46, 50, 48],
        };
    },

    /**
     * Get recent check-ins with optional filter
     */
    async getRecentActivity(filter: ActivityFilter = 'All'): Promise<GuestCheckIn[]> {
        await delay(100);
        let filtered = [...MOCK_GUEST_CHECKINS];

        if (filter === 'Failed') {
            filtered = filtered.filter(g => g.verification === 'failed');
        } else if (filter === 'Success') {
            filtered = filtered.filter(g => g.verification === 'verified');
        }

        // Sort by kiosk for grouping
        return filtered.sort((a, b) => {
            if (a.kioskId === b.kioskId) return 0;
            return a.kioskId > b.kioskId ? 1 : -1;
        });
    },

    /**
     * Get kiosk list
     */
    async getKiosks(): Promise<HotelKiosk[]> {
        await delay(100);
        return [...MOCK_HOTEL_KIOSKS];
    },

    /**
     * Get kiosk name by ID
     */
    getKioskName(kioskId: string): string {
        const kiosk = MOCK_HOTEL_KIOSKS.find(k => k.id === kioskId);
        return kiosk?.name || kioskId;
    },

    /**
     * Send reboot signal to kiosk
     */
    async rebootKiosk(kioskId: string): Promise<ServiceResponse<void>> {
        await delay(500);
        // Mock successful reboot
        return { success: true, data: undefined, error: undefined };
    },
};
