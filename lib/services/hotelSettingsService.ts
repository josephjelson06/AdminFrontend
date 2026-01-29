/**
 * Hotel Settings Service
 * 
 * Abstracts hotel profile management operations.
 */

import { MOCK_HOTEL_PROFILE, type HotelProfile } from '@/lib/hotel/hotel-data';
import type { ServiceResponse } from './hotelService';

// Simulate network delay
const delay = (ms: number = 200) => new Promise(resolve => setTimeout(resolve, ms));

export interface HotelSettingsData {
    profile: HotelProfile;
    daysUntilExpiry: number;
}

export const hotelSettingsService = {
    /**
     * Get hotel profile
     */
    async getProfile(): Promise<HotelSettingsData> {
        await delay(100);
        const profile = MOCK_HOTEL_PROFILE;
        const expiryDate = new Date(profile.planExpiry);
        const today = new Date();
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        return { profile, daysUntilExpiry };
    },

    /**
     * Update hotel profile
     */
    async updateProfile(profile: Partial<HotelProfile>): Promise<ServiceResponse<void>> {
        await delay(1000);
        // Mock update
        return { success: true, data: undefined, error: undefined };
    },
};
