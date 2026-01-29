/**
 * Settings Service
 * 
 * Abstracts all settings-related API calls.
 */

import { SYSTEM_METRICS } from '@/lib/admin/system-data';
import type { ServiceResponse } from './hotelService';

// Simulate network delay
const delay = (ms: number = 200) => new Promise(resolve => setTimeout(resolve, ms));

// Types
export interface GeneralSettings {
    companyName: string;
    supportEmail: string;
    timezone: string;
}

export interface NotificationSettings {
    emailOfflineKiosks: boolean;
    paymentOverdue: boolean;
    contractRenewal: boolean;
    dailyDigest: boolean;
}

export interface SecuritySettings {
    sessionTimeout: '30m' | '1h' | '4h' | '8h';
    require2FA: boolean;
}

export interface SystemMetric {
    label: string;
    value: string;
    trend: string;
}

export interface SystemInfo {
    version: string;
    environment: 'production' | 'staging' | 'development';
    lastDeploy: string;
}

// Mock data
const mockGeneralSettings: GeneralSettings = {
    companyName: 'Aarkay Techno Consultants',
    supportEmail: 'support@atc.in',
    timezone: 'Asia/Kolkata',
};

const mockNotificationSettings: NotificationSettings = {
    emailOfflineKiosks: true,
    paymentOverdue: true,
    contractRenewal: true,
    dailyDigest: false,
};

const mockSecuritySettings: SecuritySettings = {
    sessionTimeout: '30m',
    require2FA: false,
};

const mockSystemInfo: SystemInfo = {
    version: 'v1.2.4',
    environment: 'production',
    lastDeploy: '2h ago',
};

export const settingsService = {
    /**
     * Get general settings
     */
    async getGeneralSettings(): Promise<GeneralSettings> {
        await delay();
        return { ...mockGeneralSettings };
    },

    /**
     * Update general settings
     */
    async updateGeneralSettings(settings: GeneralSettings): Promise<ServiceResponse<void>> {
        await delay(500);
        Object.assign(mockGeneralSettings, settings);
        return { success: true, data: undefined, error: undefined };
    },

    /**
     * Get notification settings
     */
    async getNotificationSettings(): Promise<NotificationSettings> {
        await delay();
        return { ...mockNotificationSettings };
    },

    /**
     * Update notification settings
     */
    async updateNotificationSettings(settings: NotificationSettings): Promise<ServiceResponse<void>> {
        await delay(500);
        Object.assign(mockNotificationSettings, settings);
        return { success: true, data: undefined, error: undefined };
    },

    /**
     * Get security settings
     */
    async getSecuritySettings(): Promise<SecuritySettings> {
        await delay();
        return { ...mockSecuritySettings };
    },

    /**
     * Update security settings
     */
    async updateSecuritySettings(settings: SecuritySettings): Promise<ServiceResponse<void>> {
        await delay(500);
        Object.assign(mockSecuritySettings, settings);
        return { success: true, data: undefined, error: undefined };
    },

    /**
     * Get system metrics
     */
    async getSystemMetrics(): Promise<SystemMetric[]> {
        await delay(100);
        return [...SYSTEM_METRICS];
    },

    /**
     * Get system info
     */
    async getSystemInfo(): Promise<SystemInfo> {
        await delay(100);
        return { ...mockSystemInfo };
    },
};
