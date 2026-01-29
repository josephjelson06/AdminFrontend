'use client';

/**
 * Audit Page
 * 
 * Admin page for viewing audit logs.
 * Uses the AuditList component from admin/audit.
 */

import { AuditList } from '@/components/admin/audit';

export default function AuditPage() {
    return (
        <div className="p-4 sm:p-6 animate-in fade-in duration-normal">
            <AuditList />
        </div>
    );
}
