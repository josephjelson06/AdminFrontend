'use client';

import { MapPin, Phone, Mail, Building2, Cpu } from 'lucide-react';
import { GlassCard } from '@/components/shared/ui/GlassCard';
import { HotelStatusBadge } from './HotelStatusBadge';
import { HotelActionsMenu } from './HotelActionsMenu';
import type { Hotel } from '@/types/schema';

interface HotelCardProps {
    hotel: Hotel;
    onEdit: (hotel: Hotel) => void;
    onDelete: (hotel: Hotel) => void;
    onImpersonate: (hotel: Hotel) => void;
}

export function HotelCard({ hotel, onEdit, onDelete, onImpersonate }: HotelCardProps) {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.location + ', ' + hotel.city + ', ' + hotel.state)}`;
    const phoneUrl = `tel:${hotel.contactPhone}`;
    const emailUrl = `mailto:${hotel.contactEmail}`;

    return (
        <GlassCard
            // FIXED SHADOW: Lower opacity (0.25) prevents the "glitchy solid block" look
            className="group relative h-full flex flex-col transition-all duration-500 hover:translate-y-[-4px] hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.25)]"
            padding="none"
        >
            {/* Header / Hero */}
            <div className="relative h-24 bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-purple-900/40 p-5 flex items-start justify-between border-b border-white/5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Building2 className="w-6 h-6 text-white drop-shadow-md" />
                </div>
                <HotelStatusBadge status={hotel.status} />
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-1 gap-6">
                <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white leading-snug group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-blue-200 transition-all">
                        {hotel.name}
                    </h3>
                    <div className="flex items-start gap-2 text-blue-200/70">
                        <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                        <p className="text-sm font-medium leading-relaxed">
                            {hotel.location}, <br />
                            <span className="text-white/60">{hotel.city}, {hotel.state}</span>
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs uppercase tracking-wider text-white/40 font-semibold">Current Plan</span>
                        <span className="text-sm font-medium text-white flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${hotel.plan === 'advanced' ? 'bg-amber-400' : 'bg-blue-400'}`} />
                            {hotel.plan.charAt(0).toUpperCase() + hotel.plan.slice(1)}
                        </span>
                    </div>
                    <div className="flex flex-col gap-1 border-l border-white/5 pl-4">
                        <span className="text-xs uppercase tracking-wider text-white/40 font-semibold">Active Kiosks</span>
                        <div className="flex items-center gap-2 text-white">
                            <Cpu className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm font-bold tracking-tight">{hotel.kioskCount} Units</span>
                        </div>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="mt-auto grid grid-cols-4 gap-2">
                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="col-span-1 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all border border-transparent hover:border-white/10" title="Open Maps">
                        <MapPin className="w-4 h-4" />
                    </a>
                    <a href={phoneUrl} className="col-span-1 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all border border-transparent hover:border-white/10" title="Call Hotel">
                        <Phone className="w-4 h-4" />
                    </a>
                    <a href={emailUrl} className="col-span-1 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all border border-transparent hover:border-white/10" title="Send Email">
                        <Mail className="w-4 h-4" />
                    </a>
                    <div className="col-span-1 flex items-center justify-center">
                        <HotelActionsMenu
                            hotel={hotel}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onImpersonate={onImpersonate}
                        />
                    </div>
                </div>
            </div>
        </GlassCard>
    );
}