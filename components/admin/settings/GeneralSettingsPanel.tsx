'use client';

/**
 * GeneralSettingsPanel Component
 * 
 * General configuration form.
 */

import { GlassCard } from '@/components/shared/ui/GlassCard';
import type { GeneralSettings } from '@/lib/services/settingsService';

interface GeneralSettingsPanelProps {
    settings: GeneralSettings;
    onChange: (settings: GeneralSettings) => void;
}

export function GeneralSettingsPanel({ settings, onChange }: GeneralSettingsPanelProps) {
    const handleChange = (field: keyof GeneralSettings, value: string) => {
        onChange({ ...settings, [field]: value });
    };

    return (
        <GlassCard className="p-6 space-y-6">
            <h2 className="text-sm font-semibold text-primary mb-4">General Configuration</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-secondary-text mb-1">Company Name</label>
                    <input
                        type="text"
                        value={settings.companyName}
                        onChange={(e) => handleChange('companyName', e.target.value)}
                        className="input-glass"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-secondary-text mb-1">Support Email</label>
                    <input
                        type="email"
                        value={settings.supportEmail}
                        onChange={(e) => handleChange('supportEmail', e.target.value)}
                        className="input-glass"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-secondary-text mb-1">Timezone</label>
                    <select
                        className="input-glass"
                        value={settings.timezone}
                        onChange={(e) => handleChange('timezone', e.target.value)}
                    >
                        <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                        <option value="UTC">UTC</option>
                        <option value="America/Los_Angeles">America/Los_Angeles</option>
                    </select>
                </div>
            </div>
        </GlassCard>
    );
}
