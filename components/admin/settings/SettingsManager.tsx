'use client';

/**
 * SettingsManager Component
 * 
 * Main settings management component.
 */

import { useSettings } from './useSettings';
import { SettingsTabs } from './SettingsTabs';
import { GeneralSettingsPanel } from './GeneralSettingsPanel';
import { NotificationSettingsPanel } from './NotificationSettingsPanel';
import { SecuritySettingsPanel } from './SecuritySettingsPanel';
import { SystemControlPanel } from './SystemControlPanel';
import { SystemInfoSidebar } from './SystemInfoSidebar';

export function SettingsManager() {
    const {
        activeTab,
        setActiveTab,
        generalSettings,
        notificationSettings,
        securitySettings,
        systemMetrics,
        systemInfo,
        isLoading,
        isSaving,
        updateGeneralSettings,
        updateNotificationSettings,
        updateSecuritySettings,
        saveAll,
    } = useSettings();

    if (isLoading) {
        return (
            <div className="p-4 sm:p-6 flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 space-y-6 animate-in fade-in duration-normal">
            {/* Page Header */}
            <div>
                <h1 className="text-xl font-semibold text-primary">Settings & Configuration</h1>
                <p className="text-sm text-muted">Manage platform preferences and system controls</p>
            </div>

            {/* Tabs */}
            <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Area */}
                <div className="lg:col-span-2">
                    {activeTab === 'general' && (
                        <GeneralSettingsPanel
                            settings={generalSettings}
                            onChange={updateGeneralSettings}
                        />
                    )}

                    {activeTab === 'notifications' && (
                        <NotificationSettingsPanel
                            settings={notificationSettings}
                            onChange={updateNotificationSettings}
                        />
                    )}

                    {activeTab === 'security' && (
                        <SecuritySettingsPanel
                            settings={securitySettings}
                            onChange={updateSecuritySettings}
                        />
                    )}

                    {activeTab === 'system' && (
                        <SystemControlPanel metrics={systemMetrics} />
                    )}
                </div>

                {/* Sidebar */}
                <SystemInfoSidebar
                    systemInfo={systemInfo}
                    isSaving={isSaving}
                    onSave={saveAll}
                />
            </div>
        </div>
    );
}
