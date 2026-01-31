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
        <div className="animate-in fade-in duration-normal">
            <AuditList />
        </div>
    );
}
