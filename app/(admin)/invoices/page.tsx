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
        <div className="p-4 sm:p-6 animate-in fade-in duration-normal">
            <InvoiceList />
        </div>
    );
}
