'use client';

/**
 * SystemInfoSidebar Component
 * 
 * Sidebar with system info and save button.
 */

import { Server, Save } from 'lucide-react';
import { GlassCard } from '@/components/shared/ui/GlassCard';
import type { SystemInfo } from '@/lib/services/settingsService';

interface SystemInfoSidebarProps {
    systemInfo: SystemInfo;
    isSaving: boolean;
    onSave: () => void;
}

export function SystemInfoSidebar({ systemInfo, isSaving, onSave }: SystemInfoSidebarProps) {
    return (
        <div className="space-y-6">
            <GlassCard className="p-5">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 surface-glass-soft rounded-lg">
                        <Server className="w-5 h-5 text-secondary-text" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-primary">System Info</h3>
                        <p className="text-xs text-muted">Platform Status</p>
                    </div>
                </div>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center py-2 border-b border-glass">
                        <span className="text-muted">Version</span>
                        <span className="font-mono font-medium text-secondary-text">{systemInfo.version}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-glass">
                        <span className="text-muted">Environment</span>
                        <span className="badge-success">
                            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                            {systemInfo.environment.charAt(0).toUpperCase() + systemInfo.environment.slice(1)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                        <span className="text-muted">Last Deploy</span>
                        <span className="font-medium text-secondary-text">{systemInfo.lastDeploy}</span>
                    </div>
                </div>
            </GlassCard>

            <button
                className="btn-primary w-full"
                onClick={onSave}
                disabled={isSaving}
            >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
        </div>
    );
}
