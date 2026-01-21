'use client';

import { useState } from 'react';
import { User, Mail, Phone, Shield, Key, Bell, Camera, Save } from 'lucide-react';
import { useToast } from '@/components/shared/ui/Toast';

export default function ProfilePage() {
    const { addToast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: 'Admin User',
        email: 'admin@atc.in',
        phone: '+91 98765 43210',
        role: 'Super Admin',
        department: 'Technology',
        joinDate: '2024-03-15',
    });

    const handleSave = () => {
        setIsEditing(false);
        addToast('success', 'Profile Updated', 'Your profile has been saved successfully.');
    };

    return (
        <div className="p-6 max-w-4xl">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-xl font-semibold text-slate-900 dark:text-white">My Profile</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Manage your account settings and preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Personal Information</h2>
                            <button
                                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${isEditing
                                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                    }`}
                            >
                                {isEditing ? (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </>
                                ) : (
                                    'Edit Profile'
                                )}
                            </button>
                        </div>

                        <div className="flex items-start gap-6">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-24 h-24 rounded-xl bg-slate-900 dark:bg-emerald-600 flex items-center justify-center">
                                    <span className="text-3xl font-bold text-white">AU</span>
                                </div>
                                {isEditing && (
                                    <button className="absolute -bottom-2 -right-2 p-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600">
                                        <Camera className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                    </button>
                                )}
                            </div>

                            {/* Form Fields */}
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={profile.name}
                                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                            className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                                        />
                                    ) : (
                                        <p className="text-sm text-slate-900 dark:text-white">{profile.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            value={profile.email}
                                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                            className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                                        />
                                    ) : (
                                        <p className="text-sm text-slate-900 dark:text-white">{profile.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            value={profile.phone}
                                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                            className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                                        />
                                    ) : (
                                        <p className="text-sm text-slate-900 dark:text-white">{profile.phone}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Department</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={profile.department}
                                            onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                                            className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                                        />
                                    ) : (
                                        <p className="text-sm text-slate-900 dark:text-white">{profile.department}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                        <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Security</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700">
                                        <Key className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">Password</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Last changed 30 days ago</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => addToast('info', 'Password Reset', 'Check your email for reset link.')}
                                    className="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600"
                                >
                                    Change
                                </button>
                            </div>

                            <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700">
                                        <Shield className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">Two-Factor Authentication</p>
                                        <p className="text-xs text-emerald-600 dark:text-emerald-400">Enabled</p>
                                    </div>
                                </div>
                                <button className="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600">
                                    Configure
                                </button>
                            </div>

                            <div className="flex items-center justify-between py-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700">
                                        <Bell className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">Login Alerts</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Get notified of new sign-ins</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-9 h-5 bg-slate-200 dark:bg-slate-600 peer-checked:bg-emerald-500 rounded-full peer-focus:ring-2 peer-focus:ring-emerald-300 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-transform peer-checked:after:translate-x-4" />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Role Card */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Account Details</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500 dark:text-slate-400">Role</span>
                                <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded">
                                    {profile.role}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500 dark:text-slate-400">Member Since</span>
                                <span className="text-sm text-slate-900 dark:text-white">
                                    {new Date(profile.joinDate).toLocaleDateString('en-IN', {
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500 dark:text-slate-400">Status</span>
                                <span className="inline-flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Sessions */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Active Sessions</h3>
                        <div className="space-y-3">
                            <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-900 dark:text-white">Windows PC</span>
                                    <span className="text-xs text-emerald-600 dark:text-emerald-400">Current</span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Chrome • Mumbai, IN</p>
                            </div>
                            <button
                                onClick={() => addToast('info', 'Sessions Cleared', 'All other sessions have been logged out.')}
                                className="w-full text-center text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300"
                            >
                                Sign out all other sessions
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
