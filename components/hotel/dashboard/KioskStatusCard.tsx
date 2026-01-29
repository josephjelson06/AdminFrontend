'use client';

/**
 * KioskStatusCard Component
 * 
 * Individual kiosk status with reboot action.
 */

import { RotateCw } from 'lucide-react';
import { useToast } from '@/components/shared/ui/Toast';
import type { HotelKiosk } from '@/lib/hotel/hotel-data';

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

    // Determine status color
    let statusColor = 'bg-emerald-500';
    if (kiosk.status === 'offline') statusColor = 'bg-rose-500';
    else if (kiosk.status === 'maintenance' || isStale) statusColor = 'bg-amber-500';

    const handleReboot = async () => {
        const success = await onReboot(kiosk.id);
        if (success) {
            addToast('success', 'Reboot Signal Sent', `Reboot command sent to ${kiosk.name}.`);
        } else {
            addToast('error', 'Reboot Failed', `Could not send reboot to ${kiosk.name}.`);
        }
    };

    return (
        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg group">
            <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${statusColor}`} />
                <div>
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{kiosk.name}</p>
                        {isStale && kiosk.status === 'online' && (
                            <span className="text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded">
                                Stale
                            </span>
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
        </div>
    );
}
