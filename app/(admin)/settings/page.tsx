import { Settings, Bell, Shield, Palette, Globe, Save } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="p-6">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-xl font-semibold text-slate-900">Settings</h1>
                <p className="text-sm text-slate-500">System configuration and preferences</p>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {/* Settings Sections */}
                <div className="col-span-2 space-y-6">
                    {/* General Settings */}
                    <div className="bg-white rounded-lg border border-slate-200 p-5">
                        <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-4">
                            <Settings className="w-4 h-4 text-slate-400" />
                            General Settings
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                                <input
                                    type="text"
                                    defaultValue="Aarkay Techno Consultants"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Support Email</label>
                                <input
                                    type="email"
                                    defaultValue="support@atc.in"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Notification Settings */}
                    <div className="bg-white rounded-lg border border-slate-200 p-5">
                        <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-4">
                            <Bell className="w-4 h-4 text-slate-400" />
                            Notifications
                        </h2>
                        <div className="space-y-3">
                            <label className="flex items-center justify-between">
                                <span className="text-sm text-slate-700">Email alerts for offline kiosks</span>
                                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300" />
                            </label>
                            <label className="flex items-center justify-between">
                                <span className="text-sm text-slate-700">Payment overdue notifications</span>
                                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300" />
                            </label>
                            <label className="flex items-center justify-between">
                                <span className="text-sm text-slate-700">Contract renewal reminders</span>
                                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300" />
                            </label>
                        </div>
                    </div>

                    {/* Security Settings */}
                    <div className="bg-white rounded-lg border border-slate-200 p-5">
                        <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-4">
                            <Shield className="w-4 h-4 text-slate-400" />
                            Security
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Session Timeout</label>
                                <select className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900">
                                    <option>30 minutes</option>
                                    <option>1 hour</option>
                                    <option>4 hours</option>
                                    <option>8 hours</option>
                                </select>
                            </div>
                            <label className="flex items-center justify-between">
                                <span className="text-sm text-slate-700">Require 2FA for all users</span>
                                <input type="checkbox" className="w-4 h-4 rounded border-slate-300" />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-slate-50 rounded-lg border border-slate-200 p-5">
                        <h3 className="text-sm font-semibold text-slate-900 mb-3">System Info</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Version</span>
                                <span className="font-medium text-slate-700">v1.0.0</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Environment</span>
                                <span className="font-medium text-slate-700">Production</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Last Updated</span>
                                <span className="font-medium text-slate-700">Jan 19, 2026</span>
                            </div>
                        </div>
                    </div>

                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800 transition-colors">
                        <Save className="w-4 h-4" />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
