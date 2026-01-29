'use client';

/**
 * useAudit Hook
 * 
 * Manages audit log fetching with filtering.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { auditService } from '@/lib/services/auditService';
import type { AuditLog, AuditSeverity } from '@/lib/admin/audit-data';

export interface UseAuditReturn {
    logs: AuditLog[];
    isLoading: boolean;
    error: Error | null;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    severityFilter: AuditSeverity[];
    setSeverityFilter: (filter: AuditSeverity[]) => void;
    moduleFilter: string[];
    setModuleFilter: (filter: string[]) => void;
    exportCsv: () => Promise<void>;
    refresh: () => void;
}

export function useAudit(): UseAuditReturn {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [severityFilter, setSeverityFilter] = useState<AuditSeverity[]>([]);
    const [moduleFilter, setModuleFilter] = useState<string[]>([]);

    const fetchLogs = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await auditService.list({
                search: searchQuery || undefined,
                severity: severityFilter.length > 0 ? severityFilter : undefined,
                module: moduleFilter.length > 0 ? moduleFilter : undefined,
            });

            setLogs(response.data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch audit logs'));
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery, severityFilter, moduleFilter]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const exportCsv = useCallback(async () => {
        await auditService.exportCsv();
    }, []);

    return {
        logs,
        isLoading,
        error,
        searchQuery,
        setSearchQuery,
        severityFilter,
        setSeverityFilter,
        moduleFilter,
        setModuleFilter,
        exportCsv,
        refresh: fetchLogs,
    };
}
