/**
 * Audit Service
 * 
 * Abstracts all audit log-related API calls.
 */

import type { AuditLog, AuditSeverity } from '@/lib/admin/audit-data';
import { MOCK_AUDIT_LOGS } from '@/lib/admin/audit-data';
import type { ServiceResponse, PaginatedResult } from './hotelService';

// Simulate network delay
const delay = (ms: number = 200) => new Promise(resolve => setTimeout(resolve, ms));

export interface AuditQueryParams {
    page?: number;
    pageSize?: number;
    search?: string;
    severity?: AuditSeverity[];
    module?: string[];
}

// Pagination helper
function paginate<T>(data: T[], page: number = 1, pageSize: number = 20): PaginatedResult<T> {
    const start = (page - 1) * pageSize;
    return {
        data: data.slice(start, start + pageSize),
        pagination: {
            page,
            pageSize,
            totalPages: Math.ceil(data.length / pageSize),
            totalItems: data.length,
        },
    };
}

export const auditService = {
    /**
     * Fetch paginated list of audit logs with optional filters
     */
    async list(params?: AuditQueryParams): Promise<PaginatedResult<AuditLog>> {
        await delay();

        let data = [...MOCK_AUDIT_LOGS];

        // Apply search
        if (params?.search) {
            const search = params.search.toLowerCase();
            data = data.filter(log =>
                log.action.toLowerCase().includes(search) ||
                log.actor.name.toLowerCase().includes(search) ||
                log.target.toLowerCase().includes(search)
            );
        }

        // Apply severity filter
        if (params?.severity && params.severity.length > 0) {
            data = data.filter(log => params.severity!.includes(log.severity));
        }

        // Apply module filter
        if (params?.module && params.module.length > 0) {
            data = data.filter(log => params.module!.includes(log.module));
        }

        return paginate(data, params?.page, params?.pageSize);
    },

    /**
     * Export audit logs (mock)
     */
    async exportCsv(): Promise<ServiceResponse<void>> {
        await delay(500);
        return { success: true, data: undefined, error: undefined };
    },
};
