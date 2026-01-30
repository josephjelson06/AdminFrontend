'use client';

/**
 * HotelCard Component
 * 
 * Card-based display for individual hotel using BaseCard system.
 */

import { MapPin, Phone, Mail, Building2, Cpu } from 'lucide-react';
import {
    BaseCard,
    CardInfoGrid,
    CardInfoCell,
} from '@/components/shared/ui/BaseCard';
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
    // Generate URLs
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.location + ', ' + hotel.city + ', ' + hotel.state)}`;
    const phoneUrl = `tel:${hotel.contactPhone}`;
    const emailUrl = `mailto:${hotel.contactEmail}`;

    return (
        <BaseCard
            variant="entity"
            header={{
                icon: <Building2 className="w-6 h-6 text-white" />,
                iconGradient: "from-indigo-500 to-purple-600",
                title: hotel.name,
                subtitle: `${hotel.city}, ${hotel.state}`,
                badge: <HotelStatusBadge status={hotel.status} />,
                actionsMenu: (
                    <HotelActionsMenu
                        hotel={hotel}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onImpersonate={onImpersonate}
                    />
                ),
            }}
            body={
                <CardInfoGrid>
                    <CardInfoCell
                        label="Plan"
                        value={<span className="capitalize">{hotel.plan}</span>}
                    />
                    <CardInfoCell
                        label="Kiosks"
                        value={hotel.kioskCount}
                        icon={<Cpu className="w-4 h-4 text-info" />}
                    />
                </CardInfoGrid>
            }
            footer={
                <div className="flex items-center gap-2.5 px-6 pb-5 pt-5 border-t border-glass">
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
                </div>
            }
            accentGradient="from-indigo-500 via-purple-500 to-pink-500"
        />
    );
}
