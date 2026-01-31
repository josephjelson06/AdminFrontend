'use client';

/**
 * KioskHealthPanel Component
 * 
 * Panel showing kiosk status list.
 */

import { Monitor } from 'lucide-react';
import { GlassCard } from '@/components/shared/ui/GlassCard';
import { KioskStatusCard } from './KioskStatusCard';
import type { HotelKiosk } from '@/lib/hotel/hotel-data';

interface KioskHealthPanelProps {
    kiosks: HotelKiosk[];
    onlineCount: number;
    onReboot: (kioskId: string) => Promise<boolean>;
}

export function KioskHealthPanel({ kiosks, onlineCount, onReboot }: KioskHealthPanelProps) {
    return (
        <GlassCard className="h-fit">
            <div className="flex items-center justify-between mb-4 px-5 pt-5">
                <h2 className="text-lg font-semibold text-primary">Kiosk Health</h2>
                <span className="text-xs text-muted">
                    {onlineCount} Online
                </span>
            </div>
            <div className="space-y-3 px-5">
                {kiosks.map(kiosk => (
                    <KioskStatusCard key={kiosk.id} kiosk={kiosk} onReboot={onReboot} />
                ))}
            </div>

            {/* System Status Footer */}
            <div className="mt-6 mx-5 mb-5 p-4 bg-info/10 rounded-xl border border-info/20">
                <div className="flex items-start gap-3">
                    <Monitor className="w-5 h-5 text-info mt-0.5" />
                    <div>
                        <h4 className="text-sm font-semibold text-primary">System Status</h4>
                        <p className="text-xs text-muted mt-1">
                            All systems functionality normal. Next scheduled maintenance window is in 3 days.
                        </p>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
}
