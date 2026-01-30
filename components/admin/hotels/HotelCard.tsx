'use client';

/**
 * HotelCard Component
 * 
 * Card-based display for individual hotel with quick action buttons
 * for location (GPS), phone call, and email.
 */

import { MapPin, Phone, Mail, Building2, Cpu, MoreVertical } from 'lucide-react';
import { Card } from '@/components/shared/ui/Card';
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
        <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
            {/* Status Badge - Top Right */}
            <div className="absolute top-3 right-3 z-10">
                <HotelStatusBadge status={hotel.status} />
            </div>

            {/* Card Content */}
            <div className="p-4 sm:p-5">
                {/* Header with Hotel Icon and Name */}
                <div className="flex items-start gap-3 mb-4 pr-20">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                        <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-primary truncate">
                            {hotel.name}
                        </h3>
                        <p className="text-sm text-muted truncate">
                            {hotel.city}, {hotel.state}
                        </p>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    {/* Plan */}
                    <div className="p-2.5 rounded-lg bg-surface-elevated">
                        <p className="text-xs text-muted mb-0.5">Plan</p>
                        <p className="text-sm font-medium text-primary capitalize">{hotel.plan}</p>
                    </div>
                    {/* Kiosks */}
                    <div className="p-2.5 rounded-lg bg-surface-elevated">
                        <p className="text-xs text-muted mb-0.5">Kiosks</p>
                        <div className="flex items-center gap-1.5">
                            <Cpu className="w-3.5 h-3.5 text-info" />
                            <span className="text-sm font-medium text-primary">{hotel.kioskCount}</span>
                        </div>
                    </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex items-center gap-2">
                    {/* Location Button */}
                    <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-all duration-200 group/btn"
                        title="Open in Google Maps"
                    >
                        <MapPin className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        <span className="text-xs font-medium hidden sm:inline">Location</span>
                    </a>

                    {/* Phone Button */}
                    <a
                        href={phoneUrl}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-all duration-200 group/btn"
                        title={`Call ${hotel.contactPhone}`}
                    >
                        <Phone className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        <span className="text-xs font-medium hidden sm:inline">Call</span>
                    </a>

                    {/* Email Button */}
                    <a
                        href={emailUrl}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 transition-all duration-200 group/btn"
                        title={`Email ${hotel.contactEmail}`}
                    >
                        <Mail className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        <span className="text-xs font-medium hidden sm:inline">Email</span>
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
        </Card>
    );
}
