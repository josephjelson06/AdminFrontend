'use client';

/**
 * AuditFilters Component
 * 
 * Filter controls for the audit logs using unified Toolbar.
 */

import { Download } from 'lucide-react';
import {
    Toolbar,
    ToolbarSearch,
} from '@/components/shared/ui/Toolbar';
import { FilterChips } from '@/components/shared/ui/Filters';
import type { AuditSeverity } from '@/lib/admin/audit-data';

interface AuditFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    severityFilter: AuditSeverity[];
    onSeverityChange: (values: AuditSeverity[]) => void;
    onExport: () => void;
}

export function AuditFiltersBar({
    search,
    onSearchChange,
    severityFilter,
    onSeverityChange,
    onExport,
}: AuditFiltersProps) {
    return (
        <Toolbar
            search={
                <ToolbarSearch
                    value={search}
                    onChange={onSearchChange}
                    placeholder="Search actions, users, or targets..."
                />
            }
            filters={
                <FilterChips
                    label="Severity"
                    selected={severityFilter}
                    onChange={(values) => onSeverityChange(values as AuditSeverity[])}
                    options={[
                        { value: 'info', label: 'Info' },
                        { value: 'warning', label: 'Warning' },
                        { value: 'critical', label: 'Critical' },
                    ]}
                />
            }
            actions={
                <button onClick={onExport} className="btn-secondary">
                    <Download className="w-4 h-4" />
                    Export CSV
                </button>
            }
        />
    );
}
