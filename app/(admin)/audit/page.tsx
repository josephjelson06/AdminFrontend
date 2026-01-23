'use client';

import { useState, useMemo } from 'react';
import {
    Shield,
    Search,
    Filter,
    Download,
    AlertTriangle,
    Info,
    AlertOctagon,
    Clock,
    Globe,
    User,
    Activity
} from 'lucide-react';
import { DataTable, Column, TableBadge } from '@/components/shared/ui/DataTable';
import { GlassCard } from '@/components/shared/ui/GlassCard';
import { FilterChips, SearchFilter } from '@/components/shared/ui/Filters';
import { MOCK_AUDIT_LOGS, type AuditLog, type AuditSeverity } from '@/lib/admin/audit-data';
import { useToast } from '@/components/shared/ui/Toast';

// Helper for Severity Badge
function SeverityBadge({ severity }: { severity: AuditSeverity }) {
    const styles = {
        info: 'bg-blue-100/50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200/50',
        warning: 'bg-amber-100/50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200/50',
        critical: 'bg-rose-100/50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200/50',
    };

    const icons = {
        info: Info,
        warning: AlertTriangle,
        critical: AlertOctagon,
    };

    const Icon = icons[severity];

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${styles[severity]} backdrop-blur-md`}>
            <Icon className="w-3.5 h-3.5" />
            <span className="capitalize">{severity}</span>
        </span>
    );
}

export default function AuditPage() {
    const { addToast } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [severityFilter, setSeverityFilter] = useState<string[]>([]);
    const [moduleFilter, setModuleFilter] = useState<string[]>([]);

    // Filter Logic
    const filteredLogs = useMemo(() => {
        return MOCK_AUDIT_LOGS.filter(log => {
            const matchesSearch =
                log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.actor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.target.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesSeverity = severityFilter.length === 0 || severityFilter.includes(log.severity);
            const matchesModule = moduleFilter.length === 0 || moduleFilter.includes(log.module);

            return matchesSearch && matchesSeverity && matchesModule;
        });
    }, [searchQuery, severityFilter, moduleFilter]);

    const handleExport = () => {
        addToast('success', 'Export Started', 'Audit logs are being generated for download.');
    };

    // Columns
    const columns: Column<AuditLog>[] = [
        {
            id: 'timestamp',
            header: 'Time',
            accessor: (log) => (
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
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
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                        <User className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">{log.actor.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{log.actor.role}</div>
                    </div>
                </div>
            ),
        },
        {
            id: 'action',
            header: 'Action & Target',
            accessor: (log) => (
                <div>
                    <div className="text-sm font-medium text-slate-900 dark:text-white">{log.action}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
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
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
                    <Globe className="w-3 h-3" />
                    {log.ipAddress}
                </div>
            ),
            hideOnMobile: true,
        },
    ];

    return (
        <div className="p-4 sm:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        System Audit Logs
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Track sensitive actions, security events, and system changes.
                    </p>
                </div>
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-all shadow-sm"
                >
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
                        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
                        <FilterChips
                            label="Severity"
                            selected={severityFilter}
                            onChange={setSeverityFilter}
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
                <DataTable
                    data={filteredLogs}
                    columns={columns}
                    getRowKey={(log) => log.id}
                    emptyIcon={<Shield className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />}
                    emptyTitle="No logs found"
                    emptyDescription="Try adjusting your filters or search terms."
                />
            </GlassCard>
        </div>
    );
}
