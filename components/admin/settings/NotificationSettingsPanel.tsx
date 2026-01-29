'use client';

/**
 * NotificationSettingsPanel Component
 * 
 * Notification preferences form.
 */

import { GlassCard } from '@/components/shared/ui/GlassCard';
import type { NotificationSettings } from '@/lib/services/settingsService';

interface NotificationSettingsPanelProps {
    settings: NotificationSettings;
    onChange: (settings: NotificationSettings) => void;
}

const notificationOptions: { key: keyof NotificationSettings; label: string }[] = [
    { key: 'emailOfflineKiosks', label: 'Email alerts for offline kiosks' },
    { key: 'paymentOverdue', label: 'Payment overdue notifications' },
    { key: 'contractRenewal', label: 'Contract renewal reminders' },
    { key: 'dailyDigest', label: 'Daily digest report' },
];

export function NotificationSettingsPanel({ settings, onChange }: NotificationSettingsPanelProps) {
    const handleToggle = (key: keyof NotificationSettings) => {
        onChange({ ...settings, [key]: !settings[key] });
    };

    return (
        <GlassCard className="p-6">
            <h2 className="text-sm font-semibold text-primary mb-4">Alert Preferences</h2>
            <div className="space-y-4">
                {notificationOptions.map((option) => (
                    <label
                        key={option.key}
                        className="flex items-center justify-between p-3 rounded-xl border border-glass surface-glass-soft cursor-pointer glass-hover transition-all duration-fast"
                    >
                        <span className="text-sm text-secondary-text">{option.label}</span>
                        <input
                            type="checkbox"
                            checked={settings[option.key]}
                            onChange={() => handleToggle(option.key)}
                            className="w-4 h-4 rounded border-glass text-primary focus:ring-primary"
                        />
                    </label>
                ))}
            </div>
        </GlassCard>
    );
}
