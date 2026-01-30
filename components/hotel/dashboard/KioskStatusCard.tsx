'use client';

/**
 * KioskStatusCard Component
 * 
 * Individual kiosk status with reboot action.
 * Uses the BaseCard and Status systems for consistent styling.
 */

import { RotateCw } from 'lucide-react';
import { useToast } from '@/components/shared/ui/Toast';
import type { HotelKiosk } from '@/lib/hotel/hotel-data';
import {
    BaseCard,
    CardBody,
    StateDot,
    StatusBadge,
} from '@/components/hotel/shared';

interface KioskStatusCardProps {
    kiosk: HotelKiosk;
    onReboot: (kioskId: string) => Promise<boolean>;
}

export function KioskStatusCard({ kiosk, onReboot }: KioskStatusCardProps) {
    const { addToast } = useToast();

    // Check if heartbeat is stale (> 10 mins)
    const parseMinutesAgo = (str: string) => {
        const match = str.match(/(\d+)\s+mins?\s+ago/);
        return match ? parseInt(match[1], 10) : 0;
    };

    const minutesAgo = parseMinutesAgo(kiosk.lastHeartbeat);
    const isStale = minutesAgo > 10;

    // Get effective status for display  
    const effectiveStatus = isStale && kiosk.status === 'online' ? 'maintenance' : kiosk.status;

    const handleReboot = async () => {
        const success = await onReboot(kiosk.id);
        if (success) {
            addToast('success', 'Reboot Signal Sent', `Reboot command sent to ${kiosk.name}.`);
        } else {
            addToast('error', 'Reboot Failed', `Could not send reboot to ${kiosk.name}.`);
        }
    };

    return (
        <BaseCard
            variant="default"
            density="compact"
            interactivity="readOnly"
            className="bg-slate-50 dark:bg-slate-700/50 border-0 group"
        >
            <CardBody className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <StateDot status={effectiveStatus} size="md" />
                    <div>
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-slate-900 dark:text-white">{kiosk.name}</p>
                            {isStale && kiosk.status === 'online' && (
                                <StatusBadge status="maintenance" label="Stale" size="sm" />
                            )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{kiosk.location} • {kiosk.lastHeartbeat}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{kiosk.todayCheckIns}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">check-ins</p>
                    </div>
                    <button
                        onClick={handleReboot}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                        title="Reboot Kiosk"
                    >
                        <RotateCw className="w-4 h-4" />
                    </button>
                </div>
            </CardBody>
        </BaseCard>
    );
}
