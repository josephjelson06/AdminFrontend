'use client';

/**
 * KioskCard Component
 * 
 * Card display for a single kiosk in the fleet grid.
 */

import { Wifi, WifiOff, Clock, Cpu, Building2, MoreVertical, Power } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/shared/ui/Card';
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
        <Card className="hover:border-primary/50 transition-all duration-normal group">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${isOnline ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                    {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
                </div>
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
            </div>

            {/* Device Info */}
            <div className="mb-4">
                <h3 className="font-bold text-primary flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-muted" />
                    {kiosk.serialNumber}
                </h3>
                <p className="text-xs text-muted ml-6">{kiosk.model}</p>
            </div>

            {/* Hotel Link */}
            {hotelName && kiosk.assignedHotelId && (
                <Link
                    href={`/hotels/${kiosk.assignedHotelId}`}
                    className="flex items-center gap-2 text-xs text-secondary-text surface-glass-soft p-2 rounded-lg glass-hover transition-all duration-fast mb-4"
                >
                    <Building2 className="w-3 h-3" />
                    {hotelName}
                </Link>
            )}

            {/* Footer */}
            <div className="flex justify-between items-center pt-3 border-t border-glass text-xs">
                <span className={`flex items-center gap-1 font-medium ${urgency.class}`}>
                    <Clock className="w-3 h-3" /> {kiosk.lastHeartbeat}
                </span>
                <span className="font-mono text-muted">v{kiosk.firmwareVersion}</span>
            </div>
        </Card>
    );
}
