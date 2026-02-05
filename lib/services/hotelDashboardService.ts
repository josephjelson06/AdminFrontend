/**
 * Hotel Dashboard Service
 * 
 * Abstracts all hotel dashboard data fetching.
 */

import {
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

// Placeholder data - to be replaced with real API calls
const PLACEHOLDER_KIOSKS: HotelKiosk[] = [];
const PLACEHOLDER_CHECKINS: GuestCheckIn[] = [];

export const hotelDashboardService = {
    /**
     * Get dashboard stats
     */
    async getStats(): Promise<DashboardStats> {
        await delay(100);
        // TODO: Replace with real API call
        return {
            todayCheckIns: 0,
            failedVerifications: 0,
            onlineKiosks: 0,
            totalKiosks: 0,
            readyRooms: 0,
            totalRooms: 0,
            occupiedRooms: 0,
        };
    },

    /**
     * Get sparkline data for KPIs
     */
    async getSparklineData(): Promise<SparklineData> {
        await delay(50);
        return {
            checkIns: [12, 18, 14, 25, 20, 32, 24],
            failed: [0, 1, 0, 2, 1, 0, 0],
            kiosks: [50, 60, 55, 70, 65, 80, 75],
            rooms: [40, 45, 42, 48, 46, 50, 48],
        };
    },

    /**
     * Get recent check-ins with optional filter
     */
    async getRecentActivity(filter: ActivityFilter = 'All'): Promise<GuestCheckIn[]> {
        await delay(100);
        // TODO: Replace with real API call
        return [];
    },

    /**
     * Get kiosk list
     */
    async getKiosks(): Promise<HotelKiosk[]> {
        await delay(100);
        // TODO: Replace with real API call
        return [];
    },

    /**
     * Get kiosk name by ID
     */
    getKioskName(kioskId: string): string {
        // TODO: Replace with real lookup
        return kioskId;
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
