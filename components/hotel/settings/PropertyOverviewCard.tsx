'use client';

/**
 * PropertyOverviewCard Component
 * 
 * Displays hotel property summary with gradient background.
 * Uses the BaseCard system for consistent styling.
 */

import { Building2, MapPin, BedDouble, Monitor, Sparkles, Calendar } from 'lucide-react';
import type { HotelProfile } from '@/lib/hotel/hotel-data';
import { GlassCard } from '@/components/shared/ui/GlassCard';

interface PropertyOverviewCardProps {
    profile: HotelProfile;
    daysUntilExpiry: number;
}

export function PropertyOverviewCard({ profile, daysUntilExpiry }: PropertyOverviewCardProps) {
    return (
        <GlassCard
            padding="lg"
            className="relative overflow-hidden group"
            aurora={true}
        >
            <div className="relative z-10">
                <div className="flex items-start gap-4 mb-8">
                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/10 shadow-lg">
                        <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">{profile.name}</h2>
                        <div className="flex items-center gap-1.5 text-white/70 text-sm">
                            <MapPin className="w-4 h-4" />
                            {profile.city}, {profile.state}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-slate-900/40 rounded-xl p-4 backdrop-blur-sm border border-white/5 hover:bg-slate-900/60 transition-colors">
                        <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
                            <BedDouble className="w-4 h-4" />
                            Rooms
                        </div>
                        <p className="text-3xl font-bold text-white">{profile.totalRooms}</p>
                    </div>
                    <div className="bg-slate-900/40 rounded-xl p-4 backdrop-blur-sm border border-white/5 hover:bg-slate-900/60 transition-colors">
                        <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
                            <Monitor className="w-4 h-4" />
                            Kiosks
                        </div>
                        <p className="text-3xl font-bold text-white">{profile.kiosksAllocated}</p>
                    </div>
                    <div className="bg-slate-900/40 rounded-xl p-4 backdrop-blur-sm border border-white/5 hover:bg-slate-900/60 transition-colors">
                        <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
                            <Sparkles className="w-4 h-4" />
                            Plan
                        </div>
                        <p className="text-3xl font-bold text-white capitalize">{profile.plan}</p>
                    </div>
                    <div className="bg-slate-900/40 rounded-xl p-4 backdrop-blur-sm border border-white/5 hover:bg-slate-900/60 transition-colors">
                        <div className="flex items-center gap-2 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-2">
                            <Calendar className="w-4 h-4" />
                            Renewal
                        </div>
                        <p className="text-3xl font-bold text-white">{daysUntilExpiry} days</p>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
}
