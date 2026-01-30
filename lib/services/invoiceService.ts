/**
 * Invoice Service
 * 
 * Abstracts all invoice-related API calls.
 */

import type { Invoice } from '@/types/finance';
import { MOCK_INVOICES } from '@/lib/admin/finance-data';
import type { ServiceResponse, PaginatedResult } from './hotelService';

// Simulate network delay
const delay = (ms: number = 200) => new Promise(resolve => setTimeout(resolve, ms));

// ... existing imports ...

export interface InvoiceQueryParams {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: Invoice['status'] | 'all';
    hotelId?: string;
}

export interface InvoiceSummary {
    totalPaid: number;
    totalPending: number;
    totalOverdue: number;
    thisMonthBilling: number;
    paidCount: number;
    pendingCount: number;
    overdueCount: number;
    totalCount: number;
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

export const invoiceService = {
    // ... existing list method ...
    /**
     * Fetch paginated list of invoices with optional filters
     */
    async list(params?: InvoiceQueryParams): Promise<PaginatedResult<Invoice>> {
        await delay();

        let data = [...MOCK_INVOICES];

        // Apply hotelId filter
        if (params?.hotelId) {
            data = data.filter(inv => inv.hotelId === params.hotelId);
        }

        // Apply search
        if (params?.search) {
            const search = params.search.toLowerCase();
            data = data.filter(inv =>
                inv.hotelName.toLowerCase().includes(search) ||
                inv.invoiceNumber.toLowerCase().includes(search)
            );
        }

        // Apply status filter
        if (params?.status && params.status !== 'all') {
            data = data.filter(inv => inv.status === params.status);
        }

        return paginate(data, params?.page, params?.pageSize);
    },

    /**
     * Get invoice summary/stats
     */
    async getSummary(): Promise<InvoiceSummary> {
        await delay(100);
        const invoices = MOCK_INVOICES;

        const paid = invoices.filter(i => i.status === 'paid');
        const pending = invoices.filter(i => i.status === 'pending');
        const overdue = invoices.filter(i => i.status === 'overdue');

        return {
            totalPaid: paid.reduce((sum, i) => sum + i.totalAmount, 0),
            totalPending: pending.reduce((sum, i) => sum + i.totalAmount, 0),
            totalOverdue: overdue.reduce((sum, i) => sum + i.totalAmount, 0),
            thisMonthBilling: invoices.reduce((sum, i) => sum + i.totalAmount, 0),
            paidCount: paid.length,
            pendingCount: pending.length,
            overdueCount: overdue.length,
            totalCount: invoices.length,
        };
    },

    /**
     * Get single invoice by ID
     */
    async get(id: string): Promise<ServiceResponse<Invoice | null>> {
        await delay();
        const invoice = MOCK_INVOICES.find(inv => inv.id === id);
        return {
            success: !!invoice,
            data: invoice || null,
            error: invoice ? undefined : 'Invoice not found',
        };
    },

    /**
     * Mark invoice as paid (mock)
     */
    async markAsPaid(id: string): Promise<ServiceResponse<void>> {
        await delay(500);
        return { success: true, data: undefined, error: undefined };
    },

    /**
     * Send payment reminder (mock)
     */
    async sendReminder(id: string): Promise<ServiceResponse<void>> {
        await delay(500);
        return { success: true, data: undefined, error: undefined };
    },

    /**
     * Create new invoice (mock)
     */
    async create(data: Partial<Invoice>): Promise<ServiceResponse<Invoice>> {
        await delay(500);
        const newInvoice = {
            id: `inv-${Date.now()}`,
            invoiceNumber: `INV-${Date.now()}`,
            ...data,
        } as Invoice;
        return { success: true, data: newInvoice, error: undefined };
    },
};
