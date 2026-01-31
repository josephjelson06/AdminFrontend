'use client';

/**
 * KioskCard Component
 * 
 * Card display for a single kiosk in the fleet grid.
 */

import { Wifi, WifiOff, Clock, Building2, MoreVertical, Power, FileText } from 'lucide-react';
import Link from 'next/link';
import { GlassCard } from '@/components/shared/ui/GlassCard';
import { Dropdown, DropdownItem } from '@/components/shared/ui/Dropdown';
import type { Kiosk } from '@/types/schema';

interface KioskCardProps {
    kiosk: Kiosk;
    hotelName?: string;
    onReboot: (kiosk: Kiosk) => void;
    onViewLogs?: (kiosk: Kiosk) => void;
}

// Helper: Heartbeat urgency
function getHeartbeatUrgency(heartbeat: string) {
    const minMatch = heartbeat.match(/(\d+)\s*min/);
    const hrMatch = heartbeat.match(/(\d+)\s*hr/);
    let minutes = 0;
    if (minMatch) minutes = parseInt(minMatch[1]);
    if (hrMatch) minutes = parseInt(hrMatch[1]) * 60;

    if (minutes > 60) return { class: 'text-danger', urgent: true };
    if (minutes > 30) return { class: 'text-warning', urgent: true };
    return { class: 'text-muted', urgent: false };
}

export function KioskCard({ kiosk, hotelName, onReboot, onViewLogs }: KioskCardProps) {
    const urgency = getHeartbeatUrgency(kiosk.lastHeartbeat);
    const isOnline = kiosk.status === 'online';
    const StatusIcon = isOnline ? Wifi : WifiOff;

    return (
        <GlassCard className="p-4 h-full hover:border-primary/50 transition-all duration-normal ease-smooth group">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-medium text-muted uppercase tracking-wide">{kiosk.model}</p>
                    <h3 className="text-lg font-bold text-primary mt-1 break-all">{kiosk.serialNumber}</h3>
                    {hotelName && kiosk.assignedHotelId && (
                        <Link
                            href={`/hotels/${kiosk.assignedHotelId}`}
                            className="flex items-center gap-1.5 text-xs text-secondary-text hover:text-primary transition-colors mt-1.5"
                        >
                            <Building2 className="w-3 h-3" />
                            {hotelName}
                        </Link>
                    )}
                </div>
                <div className={`p-2 rounded-lg ${isOnline ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'} transition-transform duration-fast group-hover:scale-105`}>
                    <StatusIcon className="w-5 h-5" />
                </div>
            </div>

            <div className="mt-4 flex items-end justify-between">
                <div className="space-y-1">
                    <div className={`flex items-center gap-1.5 text-xs font-medium ${urgency.class}`}>
                        <Clock className="w-3 h-3" />
                        {kiosk.lastHeartbeat}
                    </div>
                    <div className="text-[10px] text-muted font-mono">
                        v{kiosk.firmwareVersion}
                    </div>
                </div>

                <div className="-mb-1 -mr-1">
                    <Dropdown
                        trigger={
                            <button className="p-1.5 glass-hover rounded-lg text-muted transition-all duration-fast">
                                <MoreVertical className="w-4 h-4" />
                            </button>
                        }
                        align="right"
                    >
                        <DropdownItem onClick={() => onReboot(kiosk)}>
                            <Power className="w-4 h-4" /> Reboot Device
                        </DropdownItem>
                        <DropdownItem onClick={() => onViewLogs?.(kiosk)}>
                            <FileText className="w-4 h-4" /> View Logs
                        </DropdownItem>
                    </Dropdown>
                </div>
            </div>
        </GlassCard>
    );
}
