'use client';

import { useState } from 'react';
import { User, Mail, Phone, Shield, Key, Bell, Camera, Save } from 'lucide-react';
import { useToast } from '@/components/shared/ui/Toast';
import { GlassCard } from '@/components/shared/ui/GlassCard';

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
                <h1 className="text-xl font-semibold text-primary">My Profile</h1>
                <p className="text-sm text-muted">Manage your account settings and preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <GlassCard padding="lg">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-primary">Personal Information</h2>
                            <button
                                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all ${isEditing
                                    ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20'
                                    : 'bg-slate-700/50 text-slate-200 hover:bg-slate-700 border border-slate-600 hover:border-slate-500'
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

                        <div className="flex flex-col sm:flex-row items-start gap-6">
                            {/* Avatar */}
                            <div className="relative mx-auto sm:mx-0">
                                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                    <span className="text-3xl font-bold text-white">AU</span>
                                </div>
                                {isEditing && (
                                    <button className="absolute -bottom-2 -right-2 p-2 bg-slate-800 border border-slate-600 rounded-full shadow-lg text-white hover:bg-slate-700 transition-colors">
                                        <Camera className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {/* Form Fields */}
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
                                    {isEditing ? (
                                        <div className="relative">
                                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <input
                                                type="text"
                                                value={profile.name}
                                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-600 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                    ) : (
                                        <p className="text-sm font-medium text-white py-2.5 px-1">{profile.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
                                    {isEditing ? (
                                        <div className="relative">
                                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <input
                                                type="email"
                                                value={profile.email}
                                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-600 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                    ) : (
                                        <p className="text-sm font-medium text-white py-2.5 px-1">{profile.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Phone</label>
                                    {isEditing ? (
                                        <div className="relative">
                                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <input
                                                type="tel"
                                                value={profile.phone}
                                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-600 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                    ) : (
                                        <p className="text-sm font-medium text-white py-2.5 px-1">{profile.phone}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Department</label>
                                    {isEditing ? (
                                        <div className="relative">
                                            <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <input
                                                type="text"
                                                value={profile.department}
                                                onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                                                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-600 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                    ) : (
                                        <p className="text-sm font-medium text-white py-2.5 px-1">{profile.department}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Security */}
                    <GlassCard padding="lg">
                        <h2 className="text-lg font-semibold text-primary mb-4">Security</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                                        <Key className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">Password</p>
                                        <p className="text-xs text-muted">Last changed 30 days ago</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => addToast('info', 'Password Reset', 'Check your email for reset link.')}
                                    className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 border border-slate-600 rounded-xl hover:bg-slate-700 hover:border-slate-500 transition-all"
                                >
                                    Change
                                </button>
                            </div>

                            <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                                        <Shield className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">Two-Factor Authentication</p>
                                        <p className="text-xs text-emerald-400">Enabled</p>
                                    </div>
                                </div>
                                <button className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 border border-slate-600 rounded-xl hover:bg-slate-700 hover:border-slate-500 transition-all">
                                    Configure
                                </button>
                            </div>

                            <div className="flex items-center justify-between py-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                                        <Bell className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">Login Alerts</p>
                                        <p className="text-xs text-muted">Get notified of new sign-ins</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-indigo-500/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
                                </label>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Role Card */}
                    <GlassCard padding="lg">
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Account Details</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                                <span className="text-sm text-slate-400">Role</span>
                                <span className="px-3 py-1 text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full">
                                    {profile.role}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                                <span className="text-sm text-slate-400">Member Since</span>
                                <span className="text-sm font-medium text-white">
                                    {new Date(profile.joinDate).toLocaleDateString('en-IN', {
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                                <span className="text-sm text-slate-400">Status</span>
                                <span className="inline-flex items-center gap-2 text-sm text-emerald-400 font-medium">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    Active
                                </span>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Sessions */}
                    <GlassCard padding="lg">
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Active Sessions</h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-white">Windows PC</span>
                                    <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Current</span>
                                </div>
                                <p className="text-xs text-slate-400">Chrome • Mumbai, IN</p>
                            </div>
                            <button
                                onClick={() => addToast('info', 'Sessions Cleared', 'All other sessions have been logged out.')}
                                className="w-full py-2 text-center text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
                            >
                                Sign out all other sessions
                            </button>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
