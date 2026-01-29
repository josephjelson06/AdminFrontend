'use client';

/**
 * useSettings Hook
 * 
 * Manages settings state across all tabs.
 */

import { useState, useEffect, useCallback } from 'react';
import {
    settingsService,
    type GeneralSettings,
    type NotificationSettings,
    type SecuritySettings,
    type SystemMetric,
    type SystemInfo,
} from '@/lib/services/settingsService';

export type SettingsTab = 'general' | 'notifications' | 'security' | 'system';

export interface UseSettingsReturn {
    // Tab state
    activeTab: SettingsTab;
    setActiveTab: (tab: SettingsTab) => void;

    // Data
    generalSettings: GeneralSettings;
    notificationSettings: NotificationSettings;
    securitySettings: SecuritySettings;
    systemMetrics: SystemMetric[];
    systemInfo: SystemInfo;

    // State
    isLoading: boolean;
    isSaving: boolean;
    error: Error | null;

    // Actions
    updateGeneralSettings: (settings: GeneralSettings) => Promise<void>;
    updateNotificationSettings: (settings: NotificationSettings) => Promise<void>;
    updateSecuritySettings: (settings: SecuritySettings) => Promise<void>;
    saveAll: () => Promise<void>;
}

const defaultGeneralSettings: GeneralSettings = {
    companyName: '',
    supportEmail: '',
    timezone: 'Asia/Kolkata',
};

const defaultNotificationSettings: NotificationSettings = {
    emailOfflineKiosks: true,
    paymentOverdue: true,
    contractRenewal: true,
    dailyDigest: false,
};

const defaultSecuritySettings: SecuritySettings = {
    sessionTimeout: '30m',
    require2FA: false,
};

const defaultSystemInfo: SystemInfo = {
    version: '',
    environment: 'production',
    lastDeploy: '',
};

export function useSettings(): UseSettingsReturn {
    const [activeTab, setActiveTab] = useState<SettingsTab>('general');
    const [generalSettings, setGeneralSettings] = useState<GeneralSettings>(defaultGeneralSettings);
    const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(defaultNotificationSettings);
    const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(defaultSecuritySettings);
    const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([]);
    const [systemInfo, setSystemInfo] = useState<SystemInfo>(defaultSystemInfo);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Load all settings
    useEffect(() => {
        async function loadSettings() {
            setIsLoading(true);
            setError(null);

            try {
                const [general, notifications, security, metrics, info] = await Promise.all([
                    settingsService.getGeneralSettings(),
                    settingsService.getNotificationSettings(),
                    settingsService.getSecuritySettings(),
                    settingsService.getSystemMetrics(),
                    settingsService.getSystemInfo(),
                ]);

                setGeneralSettings(general);
                setNotificationSettings(notifications);
                setSecuritySettings(security);
                setSystemMetrics(metrics);
                setSystemInfo(info);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to load settings'));
            } finally {
                setIsLoading(false);
            }
        }

        loadSettings();
    }, []);

    const updateGeneralSettings = useCallback(async (settings: GeneralSettings) => {
        setGeneralSettings(settings);
    }, []);

    const updateNotificationSettings = useCallback(async (settings: NotificationSettings) => {
        setNotificationSettings(settings);
    }, []);

    const updateSecuritySettings = useCallback(async (settings: SecuritySettings) => {
        setSecuritySettings(settings);
    }, []);

    const saveAll = useCallback(async () => {
        setIsSaving(true);
        try {
            await Promise.all([
                settingsService.updateGeneralSettings(generalSettings),
                settingsService.updateNotificationSettings(notificationSettings),
                settingsService.updateSecuritySettings(securitySettings),
            ]);
        } finally {
            setIsSaving(false);
        }
    }, [generalSettings, notificationSettings, securitySettings]);

    return {
        activeTab,
        setActiveTab,
        generalSettings,
        notificationSettings,
        securitySettings,
        systemMetrics,
        systemInfo,
        isLoading,
        isSaving,
        error,
        updateGeneralSettings,
        updateNotificationSettings,
        updateSecuritySettings,
        saveAll,
    };
}
