'use client';

/**
 * Fleet Page
 * 
 * Admin page for managing kiosk fleet.
 * Uses the KioskGrid component from admin/fleet.
 */

import { KioskGrid } from '@/components/admin/fleet';

export default function FleetPage() {
    return (
        <div className="animate-in fade-in duration-normal">
            <KioskGrid />
        </div>
    );
}
