/**
 * Kiosk/Fleet Service
 * 
 * Abstracts all kiosk-related API calls through the adapter pattern.
 */

import type { Kiosk, KioskStatus } from '@/types/schema';
import { MOCK_KIOSKS } from '@/lib/admin/mock-data';
import type { ServiceResponse, PaginatedResult } from './hotelService';

// Simulate network delay
const delay = (ms: number = 200) => new Promise(resolve => setTimeout(resolve, ms));

export interface KioskQueryParams {
    page?: number;
    pageSize?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    filters?: {
        status?: KioskStatus;
        model?: string;
        hotelId?: string;
    };
}

export interface KioskStats {
    total: number;
    online: number;
    offline: number;
}

// Pagination helper
function paginate<T>(data: T[], page: number = 1, pageSize: number = 10): PaginatedResult<T> {
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

export const kioskService = {
    /**
     * Fetch paginated list of kiosks with optional filters
     */
    async list(params?: KioskQueryParams): Promise<PaginatedResult<Kiosk>> {
        await delay();

        let data = [...MOCK_KIOSKS] as Kiosk[];

        // Apply search
        if (params?.search) {
            const search = params.search.toLowerCase();
            data = data.filter(k =>
                k.serialNumber.toLowerCase().includes(search) ||
                k.model.toLowerCase().includes(search)
            );
        }

        // Apply filters
        if (params?.filters?.status) {
            data = data.filter(k => k.status === params.filters!.status);
        }
        if (params?.filters?.model) {
            data = data.filter(k => k.model === params.filters!.model);
        }
        if (params?.filters?.hotelId) {
            data = data.filter(k => k.assignedHotelId === params.filters!.hotelId);
        }

        // Apply sort
        if (params?.sortBy) {
            const sortOrder = params.sortOrder || 'asc';
            data.sort((a, b) => {
                const aVal = (a as Record<string, unknown>)[params.sortBy!];
                const bVal = (b as Record<string, unknown>)[params.sortBy!];
                if (typeof aVal === 'string' && typeof bVal === 'string') {
                    return sortOrder === 'asc'
                        ? aVal.localeCompare(bVal)
                        : bVal.localeCompare(aVal);
                }
                return 0;
            });
        }

        return paginate(data, params?.page, params?.pageSize);
    },

    /**
     * Get kiosk statistics
     */
    async getStats(): Promise<KioskStats> {
        await delay();
        const kiosks = MOCK_KIOSKS as Kiosk[];
        return {
            total: kiosks.length,
            online: kiosks.filter(k => k.status === 'online').length,
            offline: kiosks.filter(k => k.status === 'offline').length,
        };
    },

    /**
     * Get unique models for filtering
     */
    async getModels(): Promise<Array<{ value: string; label: string; count: number }>> {
        await delay(100);
        const kiosks = MOCK_KIOSKS as Kiosk[];
        const unique = [...new Set(kiosks.map(k => k.model))];
        return unique.map(model => ({
            value: model,
            label: model,
            count: kiosks.filter(k => k.model === model).length,
        }));
    },

    /**
     * Fetch a single kiosk by ID
     */
    async get(id: string): Promise<ServiceResponse<Kiosk | null>> {
        await delay();
        const kiosk = MOCK_KIOSKS.find(k => k.id === id) as Kiosk | undefined;
        return {
            success: !!kiosk,
            data: kiosk || null,
            error: kiosk ? undefined : 'Kiosk not found',
        };
    },

    /**
     * Reboot a kiosk (mock)
     */
    async reboot(id: string): Promise<ServiceResponse<void>> {
        await delay(500);
        return { success: true, data: undefined, error: undefined };
    },

    /**
     * Update firmware on a kiosk (mock)
     */
    async updateFirmware(id: string, version: string): Promise<ServiceResponse<void>> {
        await delay(500);
        return { success: true, data: undefined, error: undefined };
    },
};
