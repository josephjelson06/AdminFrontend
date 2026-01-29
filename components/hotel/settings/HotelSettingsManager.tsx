'use client';

/**
 * HotelSettingsManager Component
 * 
 * Main hotel settings management component.
 */

import { useState } from 'react';
import { Building2, Phone, Mail, Save, Loader2 } from 'lucide-react';
import { HotelLayout } from '@/components/hotel/layout/HotelLayout';
import { useHotelSettings } from './useHotelSettings';
import { PropertyOverviewCard } from './PropertyOverviewCard';
import { useToast } from '@/components/shared/ui/Toast';
import { ConfirmModal } from '@/components/shared/ui/ConfirmModal';

export function HotelSettingsManager() {
    const { addToast } = useToast();
    const {
        profile,
        daysUntilExpiry,
        updateField,
        saveProfile,
        hasChanges,
        isLoading,
        isSaving,
    } = useHotelSettings();

    const [showConfirm, setShowConfirm] = useState(false);

    const handleSave = () => {
        setShowConfirm(true);
    };

    const confirmSave = async () => {
        const success = await saveProfile();
        if (success) {
            addToast('success', 'Settings Saved', 'Hotel profile has been updated.');
        }
        setShowConfirm(false);
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
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Hotel</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Manage your hotel profile and contact information
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

            <div className="space-y-6">
                {/* Property Overview Card */}
                <PropertyOverviewCard profile={profile} daysUntilExpiry={daysUntilExpiry} />

                {/* Hotel Information */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
                            <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                Hotel Information
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Basic details about your property
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Hotel Name
                            </label>
                            <input
                                type="text"
                                value={profile.name}
                                onChange={(e) => updateField('name', e.target.value)}
                                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Street Address
                            </label>
                            <input
                                type="text"
                                value={profile.address}
                                onChange={(e) => updateField('address', e.target.value)}
                                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                City
                            </label>
                            <input
                                type="text"
                                value={profile.city}
                                onChange={(e) => updateField('city', e.target.value)}
                                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                State
                            </label>
                            <input
                                type="text"
                                value={profile.state}
                                onChange={(e) => updateField('state', e.target.value)}
                                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                PIN Code
                            </label>
                            <input
                                type="text"
                                value={profile.pincode}
                                onChange={(e) => updateField('pincode', e.target.value)}
                                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl">
                            <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                Contact Information
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                How guests and ATC can reach you
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Phone Number
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="tel"
                                    value={profile.phone}
                                    onChange={(e) => updateField('phone', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="email"
                                    value={profile.email}
                                    onChange={(e) => updateField('email', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Unsaved Changes Banner */}
                {hasChanges && (
                    <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 animate-in slide-in-from-bottom duration-300">
                        <p className="text-sm text-amber-800 dark:text-amber-300">
                            You have unsaved changes
                        </p>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors"
                        >
                            <Save className="w-4 h-4" />
                            Save Now
                        </button>
                    </div>
                )}
            </div>

            {/* Save Confirmation */}
            <ConfirmModal
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={confirmSave}
                title="Save Hotel Profile"
                message="Are you sure you want to update your hotel profile? These changes will be visible to ATC support."
                confirmLabel="Save Changes"
                variant="default"
            />
        </HotelLayout>
    );
}
