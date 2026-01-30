'use client';

/**
 * InvoiceFilters Component
 * 
 * Filter controls for the invoices list using unified Toolbar.
 */

import { Download, Plus } from 'lucide-react';
import {
    Toolbar,
    ToolbarSearch,
    ToolbarFilterDropdown,
} from '@/components/shared/ui/Toolbar';

interface InvoiceFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    status: string;
    onStatusChange: (value: string) => void;
    onExport: () => void;
    onCreateNew: () => void;
}

const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'paid', label: 'Paid' },
    { value: 'pending', label: 'Pending' },
    { value: 'overdue', label: 'Overdue' },
];

export function InvoiceFiltersBar({
    search,
    onSearchChange,
    status,
    onStatusChange,
    onExport,
    onCreateNew,
}: InvoiceFiltersProps) {
    return (
        <Toolbar
            search={
                <ToolbarSearch
                    value={search}
                    onChange={onSearchChange}
                    placeholder="Search invoices..."
                />
            }
            filters={
                <ToolbarFilterDropdown
                    label="Status:"
                    value={status}
                    onChange={onStatusChange}
                    options={statusOptions}
                />
            }
            actions={
                <div className="flex items-center gap-2">
                    <button onClick={onExport} className="btn-secondary">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                    <button onClick={onCreateNew} className="btn-primary">
                        <Plus className="w-4 h-4" />
                        Create Invoice
                    </button>
                </div>
            }
        />
    );
}
