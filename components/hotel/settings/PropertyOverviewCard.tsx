'use client';

/**
 * PropertyOverviewCard Component
 * 
 * Displays hotel property summary.
 */

import { Building2, MapPin, BedDouble, Monitor, Sparkles, Calendar } from 'lucide-react';
import type { HotelProfile } from '@/lib/hotel/hotel-data';

interface PropertyOverviewCardProps {
    profile: HotelProfile;
    daysUntilExpiry: number;
}

export function PropertyOverviewCard({ profile, daysUntilExpiry }: PropertyOverviewCardProps) {
    return (
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
    );
}
