'use client';

import { useState } from 'react';
import {
    Settings,
    Bell,
    Shield,
    Save,
    Server,
    Sliders,
    Activity
} from 'lucide-react';
import { GlassCard } from '@/components/shared/ui/GlassCard';
import { FeatureManager } from '@/components/admin/settings/FeatureManager';
import { SYSTEM_METRICS } from '@/lib/admin/system-data';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('general');

    const tabs = [
        { id: 'general', label: 'General', icon: Settings },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'system', label: 'System Control', icon: Sliders },
    ];

    return (
        <div className="p-4 sm:p-6 space-y-6 animate-in fade-in duration-normal">
            {/* Page Header */}
            <div>
                <h1 className="text-xl font-semibold text-primary">Settings & Configuration</h1>
                <p className="text-sm text-muted">Manage platform preferences and system controls</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-glass overflow-x-auto">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Area */}
                <div className="lg:col-span-2">
                    {/* General Settings */}
                    {activeTab === 'general' && (
                        <GlassCard className="p-6 space-y-6">
                            <h2 className="text-sm font-semibold text-primary mb-4">General Configuration</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-text mb-1">Company Name</label>
                                    <input
                                        type="text"
                                        defaultValue="Aarkay Techno Consultants"
                                        className="input-glass"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-text mb-1">Support Email</label>
                                    <input
                                        type="email"
                                        defaultValue="support@atc.in"
                                        className="input-glass"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-text mb-1">Timezone</label>
                                    <select className="input-glass">
                                        <option>Asia/Kolkata (IST)</option>
                                        <option>UTC</option>
                                        <option>America/Los_Angeles</option>
                                    </select>
                                </div>
                            </div>
                        </GlassCard>
                    )}

                    {/* Notifications */}
                    {activeTab === 'notifications' && (
                        <GlassCard className="p-6">
                            <h2 className="text-sm font-semibold text-primary mb-4">Alert Preferences</h2>
                            <div className="space-y-4">
                                {['Email alerts for offline kiosks', 'Payment overdue notifications', 'Contract renewal reminders', 'Daily digest report'].map((label, i) => (
                                    <label key={i} className="flex items-center justify-between p-3 rounded-xl border border-glass surface-glass-soft cursor-pointer glass-hover transition-all duration-fast">
                                        <span className="text-sm text-secondary-text">{label}</span>
                                        <input
                                            type="checkbox"
                                            defaultChecked={i < 3}
                                            className="w-4 h-4 rounded border-glass text-primary focus:ring-primary"
                                        />
                                    </label>
                                ))}
                            </div>
                        </GlassCard>
                    )}

                    {/* Security */}
                    {activeTab === 'security' && (
                        <GlassCard className="p-6 space-y-6">
                            <h2 className="text-sm font-semibold text-primary mb-4">Access Control</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-text mb-1">Session Timeout</label>
                                    <select className="input-glass">
                                        <option>30 minutes</option>
                                        <option>1 hour</option>
                                        <option>4 hours</option>
                                        <option>8 hours</option>
                                    </select>
                                </div>
                                <div className="pt-4 border-t border-glass">
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <div>
                                            <span className="block text-sm font-medium text-primary">Require 2FA</span>
                                            <span className="text-xs text-muted">For all admin roles</span>
                                        </div>
                                        <input type="checkbox" className="w-4 h-4 rounded border-glass text-primary focus:ring-primary" />
                                    </label>
                                </div>
                            </div>
                        </GlassCard>
                    )}

                    {/* System Control (New) */}
                    {activeTab === 'system' && (
                        <div className="space-y-6">
                            {/* Health Stats */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {SYSTEM_METRICS.map((metric, i) => (
                                    <GlassCard key={i} className="p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Activity className="w-3.5 h-3.5 text-success" />
                                            <span className="text-xs font-medium text-muted">{metric.label}</span>
                                        </div>
                                        <div className="text-lg font-bold text-primary">{metric.value}</div>
                                        <div className="text-[10px] text-success mt-1">{metric.trend}</div>
                                    </GlassCard>
                                ))}
                            </div>

                            {/* Feature Flags */}
                            <FeatureManager />
                        </div>
                    )}
                </div>

                {/* Sidebar Info */}
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
                                <span className="font-mono font-medium text-secondary-text">v1.2.4</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-glass">
                                <span className="text-muted">Environment</span>
                                <span className="badge-success">
                                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                                    Production
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-muted">Last Deploy</span>
                                <span className="font-medium text-secondary-text">2h ago</span>
                            </div>
                        </div>
                    </GlassCard>

                    <button className="btn-primary w-full">
                        <Save className="w-4 h-4" />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
