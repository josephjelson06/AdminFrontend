'use client';

/**
 * SecuritySettingsPanel Component
 * 
 * Security configuration form.
 */

import { GlassCard } from '@/components/shared/ui/GlassCard';
import type { SecuritySettings } from '@/lib/services/settingsService';

interface SecuritySettingsPanelProps {
    settings: SecuritySettings;
    onChange: (settings: SecuritySettings) => void;
}

const timeoutOptions = [
    { value: '30m', label: '30 minutes' },
    { value: '1h', label: '1 hour' },
    { value: '4h', label: '4 hours' },
    { value: '8h', label: '8 hours' },
] as const;

export function SecuritySettingsPanel({ settings, onChange }: SecuritySettingsPanelProps) {
    return (
        <GlassCard className="p-6 space-y-6">
            <h2 className="text-sm font-semibold text-primary mb-4">Access Control</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-secondary-text mb-1">Session Timeout</label>
                    <select
                        className="input-glass"
                        value={settings.sessionTimeout}
                        onChange={(e) => onChange({ ...settings, sessionTimeout: e.target.value as SecuritySettings['sessionTimeout'] })}
                    >
                        {timeoutOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
                <div className="pt-4 border-t border-glass">
                    <label className="flex items-center justify-between cursor-pointer">
                        <div>
                            <span className="block text-sm font-medium text-primary">Require 2FA</span>
                            <span className="text-xs text-muted">For all admin roles</span>
                        </div>
                        <input
                            type="checkbox"
                            checked={settings.require2FA}
                            onChange={() => onChange({ ...settings, require2FA: !settings.require2FA })}
                            className="w-4 h-4 rounded border-glass text-primary focus:ring-primary"
                        />
                    </label>
                </div>
            </div>
        </GlassCard>
    );
}
