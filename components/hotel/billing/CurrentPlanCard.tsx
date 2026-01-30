'use client';

/**
 * Current Plan Card Component
 * 
 * Displays subscription plan details with gradient background.
 * Uses the BaseCard system for consistent styling.
 */

import { Check, Calendar, Zap, Sparkles, Crown } from 'lucide-react';
import type { HotelProfile } from '@/lib/hotel/hotel-data';
import {
    BaseCard,
    CardHeader,
    CardBody,
    CardIcon,
    CardTitle,
    CardDescription,
    CardBadge,
} from '@/components/hotel/shared';

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
        <BaseCard
            variant="gradient"
            density="spacious"
            interactivity="readOnly"
            className="relative overflow-hidden"
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="relative z-10">
                <CardHeader className="flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <CardIcon color="bg-white/20" size="md" className="backdrop-blur-sm p-3">
                            <PlanIcon className="w-6 h-6" />
                        </CardIcon>
                        <div>
                            <CardDescription className="text-indigo-200">Current Plan</CardDescription>
                            <CardTitle size="lg" className="text-white capitalize">{profile.plan} Plan</CardTitle>
                        </div>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-sm ${daysUntilExpiry > 30 ? 'bg-white/20' : 'bg-amber-500/30'
                        }`}>
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-medium">
                            {daysUntilExpiry > 0 ? `Renews in ${daysUntilExpiry} days` : 'Expired'}
                        </span>
                    </div>
                </CardHeader>

                {/* Plan Stats */}
                <CardBody className="space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
                            <CardBadge
                                key={i}
                                icon={<Check className="w-3.5 h-3.5" />}
                                className="bg-white/10 text-white backdrop-blur-sm border-0"
                            >
                                {feature}
                            </CardBadge>
                        ))}
                    </div>
                </CardBody>
            </div>
        </BaseCard>
    );
}
