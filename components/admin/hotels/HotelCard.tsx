'use client';

/**
 * HotelCard Component
 * 
 * Card-based display for individual hotel with quick action buttons
 * for location (GPS), phone call, and email.
 */

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
    // Generate Google Maps URL from location
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.location + ', ' + hotel.city + ', ' + hotel.state)}`;

    // Generate tel: and mailto: links
    const phoneUrl = `tel:${hotel.contactPhone}`;
    const emailUrl = `mailto:${hotel.contactEmail}`;

    return (
        <GlassCard className="group relative overflow-hidden h-full flex flex-col" hover padding="none">
            {/* Status Badge - Top Right */}
            <div className="absolute top-5 right-5 z-10">
                <HotelStatusBadge status={hotel.status} />
            </div>

            {/* Card Content */}
            <div className="p-6 flex flex-col flex-1 space-y-6">
                {/* Header with Hotel Icon and Name */}
                <div className="flex items-start gap-4 pr-24">
                    <div className="shrink-0 p-3.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25">
                        <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1.5">
                        <h3 className="text-lg font-semibold text-primary truncate leading-tight">
                            {hotel.name}
                        </h3>
                        <p className="text-sm text-muted truncate">
                            {hotel.city}, {hotel.state}
                        </p>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4 flex-1">
                    {/* Plan */}
                    <div className="p-4 rounded-xl surface-glass-soft space-y-2">
                        <p className="text-xs font-medium text-muted uppercase tracking-wide">Plan</p>
                        <p className="text-base font-semibold text-primary capitalize">{hotel.plan}</p>
                    </div>
                    {/* Kiosks */}
                    <div className="p-4 rounded-xl surface-glass-soft space-y-2">
                        <p className="text-xs font-medium text-muted uppercase tracking-wide">Kiosks</p>
                        <div className="flex items-center gap-2">
                            <Cpu className="w-4 h-4 text-info" />
                            <span className="text-base font-semibold text-primary">{hotel.kioskCount}</span>
                        </div>
                    </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex items-center gap-2.5 pt-5 border-t border-glass">
                    {/* Location Button */}
                    <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-all duration-200 group/btn"
                        title="Open in Google Maps"
                    >
                        <MapPin className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        <span className="text-xs font-semibold hidden sm:inline">Map</span>
                    </a>

                    {/* Phone Button */}
                    <a
                        href={phoneUrl}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-all duration-200 group/btn"
                        title={`Call ${hotel.contactPhone}`}
                    >
                        <Phone className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        <span className="text-xs font-semibold hidden sm:inline">Call</span>
                    </a>

                    {/* Email Button */}
                    <a
                        href={emailUrl}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 transition-all duration-200 group/btn"
                        title={`Email ${hotel.contactEmail}`}
                    >
                        <Mail className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        <span className="text-xs font-semibold hidden sm:inline">Email</span>
                    </a>

                    {/* More Actions */}
                    <HotelActionsMenu
                        hotel={hotel}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onImpersonate={onImpersonate}
                    />
                </div>
            </div>

            {/* Bottom Border Accent */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </GlassCard>
    );
}
