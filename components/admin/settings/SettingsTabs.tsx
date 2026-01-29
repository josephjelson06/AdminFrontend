'use client';

/**
 * SettingsTabs Component
 * 
 * Tab navigation for settings.
 */

import { Settings, Bell, Shield, Sliders, type LucideIcon } from 'lucide-react';
import type { SettingsTab } from './useSettings';

interface Tab {
    id: SettingsTab;
    label: string;
    icon: LucideIcon;
}

const tabs: Tab[] = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'system', label: 'System Control', icon: Sliders },
];

interface SettingsTabsProps {
    activeTab: SettingsTab;
    onTabChange: (tab: SettingsTab) => void;
}

export function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
    return (
        <div className="flex gap-2 border-b border-glass overflow-x-auto">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all duration-fast whitespace-nowrap ${isActive
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted hover:text-secondary-text hover:border-glass'
                            }`}
                    >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
}
