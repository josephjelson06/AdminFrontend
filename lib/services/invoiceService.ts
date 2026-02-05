/**
 * Invoice Service
 * 
 * Abstracts all invoice-related API calls.
 */

import type { Invoice } from '@/types/finance';
import { api } from '@/lib/api';
import type { ServiceResponse, PaginatedResult } from './hotelService';

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

export const invoiceService = {
    /**
     * Fetch paginated list of invoices with optional filters
     */
    async list(params?: InvoiceQueryParams): Promise<PaginatedResult<Invoice>> {
        try {
            const response = await api.invoices.list({
                page: params?.page,
                status: params?.status !== 'all' ? params?.status : undefined,
                hotel_id: params?.hotelId ? parseInt(params.hotelId) : undefined,
            });

            if (!response.success) throw new Error(response.error);

            const rawInvoices = response.data as Array<Record<string, unknown>>;

            // Map backend snake_case to frontend camelCase
            const allInvoices = rawInvoices.map(inv => ({
                id: String(inv.id),
                hotelId: String(inv.hotel_id),
                hotelName: (inv.hotel_name || '') as string,
                invoiceNumber: inv.invoice_number as string,
                amount: inv.amount as number,
                taxAmount: inv.tax_amount as number,
                totalAmount: inv.total_amount as number,
                status: inv.status as Invoice['status'],
                issueDate: inv.issue_date as string,
                dueDate: inv.due_date as string,
                paidDate: inv.paid_date as string | null,
                lineItems: (inv.line_items || []) as Invoice['lineItems'],
                paymentReference: inv.payment_reference as string | undefined,
            })) as Invoice[];

            return {
                data: allInvoices,
                pagination: {
                    page: params?.page || 1,
                    pageSize: params?.pageSize || 10,
                    totalPages: 1,
                    totalItems: allInvoices.length,
                }
            };
        } catch (error) {
            console.error('Invoice list error:', error);
            return {
                data: [],
                pagination: { page: 1, pageSize: 10, totalPages: 1, totalItems: 0 }
            };
        }
    },

    /**
     * Get invoice summary/stats - computed from list call
     */
    async getSummary(): Promise<InvoiceSummary> {
        try {
            const result = await this.list({ pageSize: 1000 }); // Get all for summary
            const invoices = result.data;

            const paid = invoices.filter((i: Invoice) => i.status === 'paid');
            const pending = invoices.filter((i: Invoice) => i.status === 'pending');
            const overdue = invoices.filter((i: Invoice) => i.status === 'overdue');

            return {
                totalPaid: paid.reduce((sum: number, i: Invoice) => sum + i.totalAmount, 0),
                totalPending: pending.reduce((sum: number, i: Invoice) => sum + i.totalAmount, 0),
                totalOverdue: overdue.reduce((sum: number, i: Invoice) => sum + i.totalAmount, 0),
                thisMonthBilling: invoices.reduce((sum: number, i: Invoice) => sum + i.totalAmount, 0),
                paidCount: paid.length,
                pendingCount: pending.length,
                overdueCount: overdue.length,
                totalCount: invoices.length,
            };
        } catch {
            return {
                totalPaid: 0, totalPending: 0, totalOverdue: 0, thisMonthBilling: 0,
                paidCount: 0, pendingCount: 0, overdueCount: 0, totalCount: 0,
            };
        }
    },

    /**
     * Get single invoice by ID
     */
    async get(id: string): Promise<ServiceResponse<Invoice | null>> {
        try {
            const response = await api.invoices.get(id);
            if (!response.success) {
                return { success: false, data: null, error: response.error };
            }
            const inv = response.data as Record<string, unknown>;
            const invoice: Invoice = {
                id: String(inv.id),
                hotelId: String(inv.hotel_id),
                hotelName: (inv.hotel_name || '') as string,
                invoiceNumber: inv.invoice_number as string,
                amount: inv.amount as number,
                taxAmount: inv.tax_amount as number,
                totalAmount: inv.total_amount as number,
                status: inv.status as Invoice['status'],
                issueDate: inv.issue_date as string,
                dueDate: inv.due_date as string,
                paidDate: inv.paid_date as string | null,
                lineItems: (inv.line_items || []) as Invoice['lineItems'],
                paymentReference: inv.payment_reference as string | undefined,
            };
            return { success: true, data: invoice };
        } catch (error) {
            return { success: false, data: null, error: (error as Error).message };
        }
    },

    /**
     * Mark invoice as paid
     */
    async markAsPaid(id: string): Promise<ServiceResponse<void>> {
        try {
            const response = await api.invoices.update(id, { status: 'paid', paid_date: new Date().toISOString().split('T')[0] });
            return { success: response.success, data: undefined, error: response.error };
        } catch (error) {
            return { success: false, data: undefined, error: (error as Error).message };
        }
    },

    /**
     * Send payment reminder (placeholder - would need email backend)
     */
    async sendReminder(id: string): Promise<ServiceResponse<void>> {
        // TODO: Implement email sending via backend
        console.log('Sending reminder for invoice:', id);
        return { success: true, data: undefined, error: undefined };
    },

    /**
     * Create new invoice
     */
    async create(data: Partial<Invoice> & { hotelId?: string }): Promise<ServiceResponse<Invoice | null>> {
        try {
            // Map frontend camelCase to backend snake_case
            const payload = {
                hotel_id: data.hotelId ? parseInt(data.hotelId) : undefined,
                amount: data.amount || 0,
                tax_amount: data.taxAmount || 0,
                total_amount: data.totalAmount || data.amount || 0,
                status: data.status || 'pending',
                issue_date: new Date().toISOString().split('T')[0],
                due_date: data.dueDate,
                line_items: data.lineItems || [],
            };
            const response = await api.invoices.create(payload);
            if (!response.success) {
                return { success: false, data: null, error: response.error };
            }
            const inv = response.data as Record<string, unknown>;
            const invoice: Invoice = {
                id: String(inv.id),
                hotelId: String(inv.hotel_id),
                hotelName: (inv.hotel_name || '') as string,
                invoiceNumber: inv.invoice_number as string,
                amount: inv.amount as number,
                taxAmount: inv.tax_amount as number,
                totalAmount: inv.total_amount as number,
                status: inv.status as Invoice['status'],
                issueDate: inv.issue_date as string,
                dueDate: inv.due_date as string,
                paidDate: inv.paid_date as string | null,
                lineItems: (inv.line_items || []) as Invoice['lineItems'],
                paymentReference: inv.payment_reference as string | undefined,
            };
            return { success: true, data: invoice };
        } catch (error) {
            return { success: false, data: null, error: (error as Error).message };
        }
    },
};
