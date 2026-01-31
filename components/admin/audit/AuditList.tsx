'use client';

/**
 * AuditList Component
 * 
 * Main component for displaying audit logs.
 */

import {
    Shield,
    Search,
    Download,
    AlertTriangle,
    Info,
    AlertOctagon,
    Clock,
    Globe,
    User,
    Activity
} from 'lucide-react';
import { Card } from '@/components/shared/ui/Card';
import { DataTable, Column, TableBadge } from '@/components/shared/ui/DataTable';
import { GlassCard } from '@/components/shared/ui/GlassCard';
import { FilterChips, SearchFilter } from '@/components/shared/ui/Filters';
import { useToast } from '@/components/shared/ui/Toast';
import { useAudit } from './useAudit';
import type { AuditLog, AuditSeverity } from '@/lib/admin/audit-data';

// Severity Badge Component
function SeverityBadge({ severity }: { severity: AuditSeverity }) {
    const styles = {
        info: 'badge-default',
        warning: 'badge-warning',
        critical: 'badge-danger',
    };

    const icons = {
        info: Info,
        warning: AlertTriangle,
        critical: AlertOctagon,
    };

    const Icon = icons[severity];

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${styles[severity]}`}>
            <Icon className="w-3.5 h-3.5" />
            <span className="capitalize">{severity}</span>
        </span>
    );
}

export function AuditList() {
    const { addToast } = useToast();
    const {
        logs,
        isLoading,
        searchQuery,
        setSearchQuery,
        severityFilter,
        setSeverityFilter,
        exportCsv,
    } = useAudit();

    const handleExport = async () => {
        await exportCsv();
        addToast('success', 'Export Started', 'Audit logs are being generated for download.');
    };

    // Table columns
    const columns: Column<AuditLog>[] = [
        {
            id: 'timestamp',
            header: 'Time',
            accessor: (log) => (
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-primary flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-muted" />
                        {log.timestamp}
                    </span>
                </div>
            ),
            className: 'w-40',
        },
        {
            id: 'actor',
            header: 'Actor',
            accessor: (log) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full surface-glass-soft flex items-center justify-center border border-glass">
                        <User className="w-4 h-4 text-muted" />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-primary">{log.actor.name}</div>
                        <div className="text-xs text-muted">{log.actor.role}</div>
                    </div>
                </div>
            ),
        },
        {
            id: 'action',
            header: 'Action & Target',
            accessor: (log) => (
                <div>
                    <div className="text-sm font-medium text-primary">{log.action}</div>
                    <div className="text-xs text-muted flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        {log.target}
                    </div>
                </div>
            ),
        },
        {
            id: 'module',
            header: 'Module',
            accessor: (log) => (
                <TableBadge variant="default" className="capitalize">{log.module}</TableBadge>
            ),
            hideOnMobile: true,
        },
        {
            id: 'severity',
            header: 'Severity',
            accessor: (log) => <SeverityBadge severity={log.severity} />,
        },
        {
            id: 'ip',
            header: 'IP Address',
            accessor: (log) => (
                <div className="flex items-center gap-1.5 text-xs text-muted font-mono">
                    <Globe className="w-3 h-3" />
                    {log.ipAddress}
                </div>
            ),
            hideOnMobile: true,
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
                        <Shield className="w-6 h-6 text-success" />
                        System Audit Logs
                    </h1>
                    <p className="text-sm text-muted mt-1">
                        Track sensitive actions, security events, and system changes.
                    </p>
                </div>
                <button onClick={handleExport} className="btn-secondary">
                    <Download className="w-4 h-4" />
                    Export CSV
                </button>
            </div>

            {/* Filters */}
            <GlassCard className="p-4">
                <div className="flex flex-col lg:flex-row gap-4 justify-between">
                    <div className="flex items-center gap-4 flex-1">
                        <SearchFilter
                            value={searchQuery}
                            onChange={setSearchQuery}
                            placeholder="Search actions, users, or targets..."
                        />
                        <div className="h-8 w-px bg-glass hidden sm:block" />
                        <FilterChips
                            label="Severity"
                            selected={severityFilter}
                            onChange={(values) => setSeverityFilter(values as AuditSeverity[])}
                            options={[
                                { value: 'info', label: 'Info' },
                                { value: 'warning', label: 'Warning' },
                                { value: 'critical', label: 'Critical' },
                            ]}
                        />
                    </div>
                </div>
            </GlassCard>

            {/* Logs Table */}
            <GlassCard className="p-0 overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <DataTable
                        data={logs}
                        columns={columns}
                        getRowKey={(log) => log.id}
                        emptyIcon={<Shield className="w-12 h-12 text-muted mx-auto" />}
                        emptyTitle="No logs found"
                        emptyDescription="Try adjusting your filters or search terms."
                    />
                )}
            </GlassCard>
        </div>
    );
}
