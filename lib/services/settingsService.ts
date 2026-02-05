/**
 * Settings Service
 * 
 * Abstracts all settings-related API calls.
 */

import { api } from '@/lib/api';
import { SYSTEM_METRICS } from '@/lib/admin/system-data';
import type { ServiceResponse } from './hotelService';

// Types (Keep existing interfaces)
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

// Default values for fallback
const defaults = {
    general: {
        companyName: 'Aarkay Techno Consultants',
        supportEmail: 'support@atc.in',
        timezone: 'Asia/Kolkata',
    },
    notifications: {
        emailOfflineKiosks: true,
        paymentOverdue: true,
        contractRenewal: true,
        dailyDigest: false,
    },
    security: {
        sessionTimeout: '30m',
        require2FA: false,
    },
};

export const settingsService = {
    /**
     * Get general settings
     */
    async getGeneralSettings(): Promise<GeneralSettings> {
        try {
            const response = await api.settings.get('general');
            // Cast data to any to access value property
            const data = response.data as any;
            if (data && data.value) return data.value;
            return data?.value || defaults.general; 
        } catch (error) {
            console.warn('Failed to fetch general settings, using default', error);
            return defaults.general as GeneralSettings;
        }
    },

    /**
     * Update general settings
     */
    async updateGeneralSettings(settings: GeneralSettings): Promise<ServiceResponse<void>> {
        try {
            await api.settings.update('general', { value: settings });
            return { success: true, data: undefined };
        } catch (error) {
            console.error('Failed to update general settings', error);
            return { success: false, error: 'Failed to update settings', data: undefined };
        }
    },

    /**
     * Get notification settings
     */
    async getNotificationSettings(): Promise<NotificationSettings> {
        try {
            const response = await api.settings.get('notifications');
            const data = response.data as any;
            return data?.value || defaults.notifications;
        } catch (error) {
             console.warn('Failed to fetch notification settings, using default', error);
            return defaults.notifications as NotificationSettings;
        }
    },

    /**
     * Update notification settings
     */
    async updateNotificationSettings(settings: NotificationSettings): Promise<ServiceResponse<void>> {
        try {
            await api.settings.update('notifications', { value: settings });
            return { success: true, data: undefined };
        } catch (error) {
            return { success: false, error: 'Failed to update settings', data: undefined };
        }
    },

    /**
     * Get security settings
     */
    async getSecuritySettings(): Promise<SecuritySettings> {
         try {
            const response = await api.settings.get('security');
            const data = response.data as any;
            return data?.value || defaults.security;
        } catch (error) {
             console.warn('Failed to fetch security settings, using default', error);
            return defaults.security as SecuritySettings;
        }
    },

    /**
     * Update security settings
     */
    async updateSecuritySettings(settings: SecuritySettings): Promise<ServiceResponse<void>> {
        try {
            await api.settings.update('security', { value: settings });
            return { success: true, data: undefined };
        } catch (error) {
            return { success: false, error: 'Failed to update settings', data: undefined };
        }
    },

    /**
     * Get system metrics (Keep mock/static for now or fetch from dashboard API)
     */
    async getSystemMetrics(): Promise<SystemMetric[]> {
        // Could be moved to dashboard API
        return [...SYSTEM_METRICS];
    },

    /**
     * Get system info
     */
    async getSystemInfo(): Promise<SystemInfo> {
        return {
            version: 'v1.2.4', // Could fetch from backend root/health
            environment: 'production',
            lastDeploy: '2h ago',
        };
    },
};
