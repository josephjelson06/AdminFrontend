/**
 * Support Service
 * 
 * Abstracts all helpdesk/support ticket-related API calls.
 */

import type { SupportTicket } from '@/lib/admin/support-data';
import { MOCK_TICKETS } from '@/lib/admin/support-data';
import type { ServiceResponse } from './hotelService';

// Simulate network delay
const delay = (ms: number = 200) => new Promise(resolve => setTimeout(resolve, ms));

export type TicketFilterStatus = 'all' | 'open' | 'resolved';

export interface TicketStats {
    total: number;
    open: number;
    resolved: number;
    critical: number;
}

export const supportService = {
    /**
     * Fetch all tickets with optional filter
     */
    async list(filterStatus: TicketFilterStatus = 'all'): Promise<SupportTicket[]> {
        await delay();

        if (filterStatus === 'all') {
            return [...MOCK_TICKETS];
        }

        if (filterStatus === 'open') {
            return MOCK_TICKETS.filter(t => ['new', 'open'].includes(t.status));
        }

        return MOCK_TICKETS.filter(t => t.status === 'resolved');
    },

    /**
     * Get ticket stats
     */
    async getStats(): Promise<TicketStats> {
        await delay(100);
        const openCount = MOCK_TICKETS.filter(t => ['new', 'open'].includes(t.status)).length;
        const criticalCount = MOCK_TICKETS.filter(t => t.priority === 'critical').length;

        return {
            total: MOCK_TICKETS.length,
            open: openCount,
            resolved: MOCK_TICKETS.length - openCount,
            critical: criticalCount,
        };
    },

    /**
     * Get single ticket by ID
     */
    async get(id: string): Promise<ServiceResponse<SupportTicket | null>> {
        await delay();
        const ticket = MOCK_TICKETS.find(t => t.id === id);
        return {
            success: !!ticket,
            data: ticket || null,
            error: ticket ? undefined : 'Ticket not found',
        };
    },

    /**
     * Reply to ticket (mock)
     */
    async reply(ticketId: string, message: string): Promise<ServiceResponse<void>> {
        await delay(500);
        return { success: true, data: undefined, error: undefined };
    },

    /**
     * Close ticket (mock)
     */
    async close(ticketId: string): Promise<ServiceResponse<void>> {
        await delay(500);
        return { success: true, data: undefined, error: undefined };
    },
};
