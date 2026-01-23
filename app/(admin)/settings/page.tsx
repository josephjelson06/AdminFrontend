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
        <div className="p-4 sm:p-6 space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Settings & Configuration</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Manage platform preferences and system controls</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${isActive
                                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300'
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
                            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">General Configuration</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company Name</label>
                                    <input
                                        type="text"
                                        defaultValue="Aarkay Techno Consultants"
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Support Email</label>
                                    <input
                                        type="email"
                                        defaultValue="support@atc.in"
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Timezone</label>
                                    <select className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
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
                            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Alert Preferences</h2>
                            <div className="space-y-4">
                                {['Email alerts for offline kiosks', 'Payment overdue notifications', 'Contract renewal reminders', 'Daily digest report'].map((label, i) => (
                                    <label key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                        <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
                                        <input
                                            type="checkbox"
                                            defaultChecked={i < 3}
                                            className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-emerald-600 focus:ring-emerald-500"
                                        />
                                    </label>
                                ))}
                            </div>
                        </GlassCard>
                    )}

                    {/* Security */}
                    {activeTab === 'security' && (
                        <GlassCard className="p-6 space-y-6">
                            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Access Control</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Session Timeout</label>
                                    <select className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                        <option>30 minutes</option>
                                        <option>1 hour</option>
                                        <option>4 hours</option>
                                        <option>8 hours</option>
                                    </select>
                                </div>
                                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <div>
                                            <span className="block text-sm font-medium text-slate-900 dark:text-white">Require 2FA</span>
                                            <span className="text-xs text-slate-500">For all admin roles</span>
                                        </div>
                                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-emerald-600 focus:ring-emerald-500" />
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
                                            <Activity className="w-3.5 h-3.5 text-emerald-500" />
                                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{metric.label}</span>
                                        </div>
                                        <div className="text-lg font-bold text-slate-900 dark:text-white">{metric.value}</div>
                                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">{metric.trend}</div>
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
                            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                <Server className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">System Info</h3>
                                <p className="text-xs text-slate-500">Platform Status</p>
                            </div>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700/50">
                                <span className="text-slate-500 dark:text-slate-400">Version</span>
                                <span className="font-mono font-medium text-slate-700 dark:text-slate-300">v1.2.4</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700/50">
                                <span className="text-slate-500 dark:text-slate-400">Environment</span>
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Production
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-slate-500 dark:text-slate-400">Last Deploy</span>
                                <span className="font-medium text-slate-700 dark:text-slate-300">2h ago</span>
                            </div>
                        </div>
                    </GlassCard>

                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-slate-800 dark:hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20">
                        <Save className="w-4 h-4" />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
