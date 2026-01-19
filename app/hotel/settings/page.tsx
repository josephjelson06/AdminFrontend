'use client';

import { useState } from 'react';
import { HotelLayout } from '@/components/layout/HotelLayout';
import {
    Building2,
    Phone,
    Mail,
    MapPin,
    Save,
    Check,
    Eye,
    EyeOff,
    Loader2,
    BedDouble,
    Monitor,
    Sparkles,
    Calendar,
} from 'lucide-react';
import { MOCK_HOTEL_PROFILE } from '@/lib/hotel-data';
import { useToast } from '@/components/ui/Toast';
import { ConfirmModal } from '@/components/modals/ConfirmModal';

export default function HotelSettingsPage() {
    const { addToast } = useToast();
    const [profile, setProfile] = useState(MOCK_HOTEL_PROFILE);
    const [hasChanges, setHasChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleChange = (field: string, value: string) => {
        setProfile(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    const handleSave = () => {
        setShowConfirm(true);
    };

    const confirmSave = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        setShowConfirm(false);
        addToast('success', 'Settings Saved', 'Hotel profile has been updated.');
        setHasChanges(false);
    };

    // Calculate days until expiry
    const expiryDate = new Date(profile.planExpiry);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    return (
        <HotelLayout>
            <div className="p-4 sm:p-6 max-w-4xl mx-auto">
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
                    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
                        {/* Background decoration */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                    <Building2 className="w-8 h-8" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">{profile.name}</h2>
                                    <p className="text-white/80 flex items-center gap-1 text-sm">
                                        <MapPin className="w-4 h-4" />
                                        {profile.city}, {profile.state}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                                    <div className="flex items-center gap-2 text-white/70 text-xs mb-1">
                                        <BedDouble className="w-4 h-4" />
                                        Rooms
                                    </div>
                                    <p className="text-2xl font-bold">{profile.totalRooms}</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                                    <div className="flex items-center gap-2 text-white/70 text-xs mb-1">
                                        <Monitor className="w-4 h-4" />
                                        Kiosks
                                    </div>
                                    <p className="text-2xl font-bold">{profile.kiosksAllocated}</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                                    <div className="flex items-center gap-2 text-white/70 text-xs mb-1">
                                        <Sparkles className="w-4 h-4" />
                                        Plan
                                    </div>
                                    <p className="text-2xl font-bold capitalize">{profile.plan}</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                                    <div className="flex items-center gap-2 text-white/70 text-xs mb-1">
                                        <Calendar className="w-4 h-4" />
                                        Renewal
                                    </div>
                                    <p className="text-xl font-bold">{daysUntilExpiry} days</p>
                                </div>
                            </div>
                        </div>
                    </div>

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
                                    onChange={(e) => handleChange('name', e.target.value)}
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
                                    onChange={(e) => handleChange('address', e.target.value)}
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
                                    onChange={(e) => handleChange('city', e.target.value)}
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
                                    onChange={(e) => handleChange('state', e.target.value)}
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
                                    onChange={(e) => handleChange('pincode', e.target.value)}
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
                                        onChange={(e) => handleChange('phone', e.target.value)}
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
                                        onChange={(e) => handleChange('email', e.target.value)}
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
