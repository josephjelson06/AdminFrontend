'use client';

/**
 * Support Page
 * 
 * Admin page for helpdesk and support tickets.
 * Uses the SupportList component from admin/support.
 */

import { SupportList } from '@/components/admin/support';

export default function SupportPage() {
    return (
        <div className="p-4 sm:p-6 animate-in fade-in duration-normal">
            <SupportList />
        </div>
    );
}
