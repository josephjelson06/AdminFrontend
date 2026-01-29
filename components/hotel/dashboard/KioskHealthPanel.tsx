'use client';

/**
 * KioskHealthPanel Component
 * 
 * Panel showing kiosk status list.
 */

import { Monitor } from 'lucide-react';
import { KioskStatusCard } from './KioskStatusCard';
import type { HotelKiosk } from '@/lib/hotel/hotel-data';

interface KioskHealthPanelProps {
    kiosks: HotelKiosk[];
    onlineCount: number;
    onReboot: (kioskId: string) => Promise<boolean>;
}

export function KioskHealthPanel({ kiosks, onlineCount, onReboot }: KioskHealthPanelProps) {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 h-fit">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Kiosk Health</h2>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                    {onlineCount} Online
                </span>
            </div>
            <div className="space-y-3">
                {kiosks.map(kiosk => (
                    <KioskStatusCard key={kiosk.id} kiosk={kiosk} onReboot={onReboot} />
                ))}
            </div>

            {/* System Status Footer */}
            <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
                <div className="flex items-start gap-3">
                    <Monitor className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-semibold text-indigo-900 dark:text-indigo-300">System Status</h4>
                        <p className="text-xs text-indigo-700 dark:text-indigo-400 mt-1">
                            All systems functionality normal. Next scheduled maintenance window is in 3 days.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
