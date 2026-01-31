'use client';

/**
 * Invoices Page
 * 
 * Admin page for managing invoices.
 * Uses the InvoiceList component from admin/invoices.
 */

import { InvoiceList } from '@/components/admin/invoices';

export default function InvoicesPage() {
    return (
        <div className="animate-in fade-in duration-normal">
            <InvoiceList />
        </div>
    );
}
