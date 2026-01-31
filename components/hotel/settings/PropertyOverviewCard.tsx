'use client';

/**
 * PropertyOverviewCard Component
 * 
 * Displays hotel property summary with gradient background.
 * Uses the BaseCard system for consistent styling.
 */

import { Building2, MapPin, BedDouble, Monitor, Sparkles, Calendar } from 'lucide-react';
import type { HotelProfile } from '@/lib/hotel/hotel-data';
import {
    BaseCard,
    CardHeader,
    CardBody,
    CardIcon,
    CardTitle,
    CardDescription,
} from '@/components/hotel/shared';

interface PropertyOverviewCardProps {
    profile: HotelProfile;
    daysUntilExpiry: number;
}

export function PropertyOverviewCard({ profile, daysUntilExpiry }: PropertyOverviewCardProps) {
    return (
        <BaseCard
            variant="gradient"
            density="spacious"
            interactivity="readOnly"
            className="relative overflow-hidden"
        >
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="relative z-10">
                <CardHeader className="gap-4 mb-6">
                    <CardIcon color="bg-white/20" size="lg" className="backdrop-blur-sm">
                        <Building2 className="w-8 h-8" />
                    </CardIcon>
                    <div>
                        <CardTitle size="lg" className="text-white">{profile.name}</CardTitle>
                        <CardDescription className="text-white/80 flex items-center gap-1 text-sm">
                            <MapPin className="w-4 h-4" />
                            {profile.city}, {profile.state}
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardBody>
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
                </CardBody>
            </div>
        </BaseCard>
    );
}
