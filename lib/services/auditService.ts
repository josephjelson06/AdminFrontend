/**
 * Audit Service
 * 
 * Abstracts all audit log-related API calls.
 */

import { api } from '@/lib/api';
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
        try {
            const limit = params?.pageSize || 20;
            const page = params?.page || 1;
            
            const response = await api.audit.list({
                page,
                limit,
                search: params?.search
            });

            const data = response.data as any; // Cast to bypass type check for now if needed, or update api.ts return type

            // Determine total count (API needs to return this, or we estimate/fetch all)
            // For now, if we get less than limit, we are at end.
            // Ideally backend returns { items: [], total: 100 }
            
            // Backend currently returns List[AuditLog]. 
            // We need to adhere to PaginatedResult structure.
            const items = Array.isArray(data) ? data : (data?.data || []);
            
            return {
                data: items,
                pagination: {
                    page,
                    pageSize: limit,
                    totalPages: items.length < limit ? page : page + 1, // Rough estimation without total count from backend
                    totalItems: items.length, // Only for this page unfortunately
                }
            };

        } catch (error) {
            console.error('Failed to fetch audit logs', error);
            return {
                data: [],
                pagination: {
                    page: 1,
                    pageSize: 20,
                    totalPages: 1,
                    totalItems: 0
                }
            };
        }
    },

    /**
     * Export audit logs (mock)
     */
    async exportCsv(): Promise<ServiceResponse<void>> {
        await delay(500);
        return { success: true, data: undefined, error: undefined };
    },
};
