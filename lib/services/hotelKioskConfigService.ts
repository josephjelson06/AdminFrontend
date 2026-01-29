/**
 * Hotel Kiosk Config Service
 * 
 * Abstracts kiosk configuration operations.
 */

import {
    MOCK_KIOSK_CONFIG,
    AVAILABLE_LANGUAGES,
    MOCK_HOTEL_PROFILE,
    type Language,
} from '@/lib/hotel/hotel-data';
import type { ServiceResponse } from './hotelService';

// Simulate network delay
const delay = (ms: number = 200) => new Promise(resolve => setTimeout(resolve, ms));

export interface KioskConfig {
    welcomeMessage: string;
    enabledLanguages: string[];
    maxLanguages: number;
    logo?: string;
}

export const hotelKioskConfigService = {
    /**
     * Get kiosk configuration
     */
    async getConfig(): Promise<KioskConfig> {
        await delay(100);
        return {
            welcomeMessage: MOCK_KIOSK_CONFIG.welcomeMessage,
            enabledLanguages: MOCK_KIOSK_CONFIG.enabledLanguages,
            maxLanguages: MOCK_KIOSK_CONFIG.maxLanguages,
        };
    },

    /**
     * Get available languages
     */
    getAvailableLanguages(): Language[] {
        return AVAILABLE_LANGUAGES;
    },

    /**
     * Get hotel plan
     */
    getHotelPlan(): string {
        return MOCK_HOTEL_PROFILE.plan;
    },

    /**
     * Save kiosk configuration
     */
    async saveConfig(config: Partial<KioskConfig>): Promise<ServiceResponse<void>> {
        await delay(1000);
        // Mock save - would persist in real implementation
        return { success: true, data: undefined, error: undefined };
    },

    /**
     * Upload logo
     */
    async uploadLogo(file: File): Promise<ServiceResponse<string | undefined>> {
        await delay(500);
        // Mock upload - return a data URL
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                resolve({
                    success: true,
                    data: event.target?.result as string,
                    error: undefined,
                });
            };
            reader.onerror = () => {
                resolve({
                    success: false,
                    data: undefined,
                    error: 'Failed to read file',
                });
            };
            reader.readAsDataURL(file);
        });
    },
};
