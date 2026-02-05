'use client';

/**
 * HotelProfileManager Component
 * 
 * Allows hotel users to view and update their profile.
 */

import { User, Mail, Save, Loader2, Shield } from 'lucide-react';
import { HotelLayout } from '@/components/hotel/layout/HotelLayout';
import { useHotelProfile } from './useHotelProfile';
import { useToast } from '@/components/shared/ui/Toast';
import { GlassCard } from '@/components/shared/ui/GlassCard';

export function HotelProfileManager() {
    const { addToast } = useToast();
    const {
        profile,
        isLoading,
        isSaving,
        hasChanges,
        updateField,
        saveProfile,
    } = useHotelProfile();

    const handleSave = async () => {
        const success = await saveProfile();
        if (success) {
            addToast('success', 'Profile Saved', 'Your profile information has been updated.');
        } else {
            addToast('error', 'Save Failed', 'Failed to update profile. Please try again.');
        }
    };

    if (isLoading || !profile) {
        return (
            <HotelLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
                </div>
            </HotelLayout>
        );
    }

    return (
        <HotelLayout>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Profile</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Manage your account settings and preferences
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={!hasChanges || isSaving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 dark:shadow-none transition-all"
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Save Changes
                        </>
                    )}
                </button>
            </div>

            <div className="max-w-3xl space-y-6">
                <GlassCard padding="lg">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                            <User className="w-10 h-10" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                {profile.fullName || 'User'}
                            </h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300">
                                    <Shield className="w-3 h-3" />
                                    {profile.role.replace('_', ' ')}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="text"
                                    value={profile.fullName}
                                    onChange={(e) => updateField('fullName', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    placeholder="Enter your full name"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="email"
                                    value={profile.email}
                                    onChange={(e) => updateField('email', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </HotelLayout>
    );
}
