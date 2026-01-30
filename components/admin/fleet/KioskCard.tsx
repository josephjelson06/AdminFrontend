'use client';

/**
 * KioskCard Component
 * 
 * Card display for a single kiosk in the fleet grid using BaseCard system.
 */

import { Wifi, WifiOff, Clock, Cpu, Building2, MoreVertical, Power } from 'lucide-react';
import Link from 'next/link';
import {
    BaseCard,
} from '@/components/shared/ui/BaseCard';
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

    return (
        <BaseCard
            variant="entity"
            header={{
                icon: isOnline
                    ? <Wifi className="w-5 h-5 text-white" />
                    : <WifiOff className="w-5 h-5 text-white" />,
                iconGradient: isOnline ? "from-emerald-500 to-teal-500" : "from-red-500 to-rose-500",
                title: kiosk.serialNumber,
                subtitle: kiosk.model,
                actionsMenu: (
                    <Dropdown
                        trigger={
                            <button className="p-1 glass-hover rounded-lg transition-all duration-fast">
                                <MoreVertical className="w-4 h-4 text-muted" />
                            </button>
                        }
                        align="right"
                    >
                        <DropdownItem onClick={() => onReboot(kiosk)}>
                            <Power className="w-4 h-4" /> Reboot Device
                        </DropdownItem>
                        <DropdownItem onClick={() => onViewLogs?.(kiosk)}>
                            View Logs
                        </DropdownItem>
                    </Dropdown>
                ),
            }}
            body={
                <>
                    {/* Hotel Link */}
                    {hotelName && kiosk.assignedHotelId && (
                        <Link
                            href={`/hotels/${kiosk.assignedHotelId}`}
                            className="flex items-center gap-2 text-xs text-secondary-text surface-glass-soft p-2 rounded-lg glass-hover transition-all duration-fast"
                        >
                            <Building2 className="w-3 h-3" />
                            {hotelName}
                        </Link>
                    )}
                </>
            }
            footer={
                <div className="px-6 pb-5 pt-3 border-t border-glass flex justify-between items-center text-xs">
                    <span className={`flex items-center gap-1 font-medium ${urgency.class}`}>
                        <Clock className="w-3 h-3" /> {kiosk.lastHeartbeat}
                    </span>
                    <span className="font-mono text-muted">v{kiosk.firmwareVersion}</span>
                </div>
            }
            accentGradient={isOnline ? "from-emerald-500 to-teal-500" : "from-red-500 to-rose-500"}
        />
    );
}
