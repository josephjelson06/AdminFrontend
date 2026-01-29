'use client';

/**
 * Current Plan Card Component
 * 
 * Displays subscription plan details.
 */

import { Check, Calendar, Zap, Sparkles, Crown } from 'lucide-react';
import type { HotelProfile } from '@/lib/hotel/hotel-data';

interface CurrentPlanCardProps {
    profile: HotelProfile;
    daysUntilExpiry: number;
    planFeatures: string[];
}

const planIcons = {
    standard: Zap,
    advanced: Sparkles,
    enterprise: Crown,
};

export function CurrentPlanCard({ profile, daysUntilExpiry, planFeatures }: CurrentPlanCardProps) {
    const PlanIcon = planIcons[profile.plan as keyof typeof planIcons] || Zap;

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                            <PlanIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-indigo-200 text-sm">Current Plan</p>
                            <h2 className="text-2xl font-bold capitalize">{profile.plan} Plan</h2>
                        </div>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-sm ${daysUntilExpiry > 30 ? 'bg-white/20' : 'bg-amber-500/30'
                        }`}>
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-medium">
                            {daysUntilExpiry > 0 ? `Renews in ${daysUntilExpiry} days` : 'Expired'}
                        </span>
                    </div>
                </div>

                {/* Plan Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                        <p className="text-indigo-200 text-xs mb-1">Rooms Included</p>
                        <p className="text-xl font-bold">{profile.totalRooms}</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                        <p className="text-indigo-200 text-xs mb-1">Kiosks Allocated</p>
                        <p className="text-xl font-bold">{profile.kiosksAllocated}</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                        <p className="text-indigo-200 text-xs mb-1">Monthly Fee</p>
                        <p className="text-xl font-bold">₹25,000</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                        <p className="text-indigo-200 text-xs mb-1">Valid Until</p>
                        <p className="text-xl font-bold">
                            {new Date(profile.planExpiry).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                            })}
                        </p>
                    </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                    {planFeatures.map((feature, i) => (
                        <span
                            key={i}
                            className="px-3 py-1.5 bg-white/10 rounded-full text-xs font-medium backdrop-blur-sm flex items-center gap-1.5"
                        >
                            <Check className="w-3.5 h-3.5" />
                            {feature}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
