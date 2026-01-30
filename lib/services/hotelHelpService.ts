/**
 * Hotel Help Service
 * 
 * Abstracts help content and support operations.
 */

import type { ServiceResponse } from './hotelService';
import {
    MOCK_FAQS,
    MOCK_SUPPORT_TICKETS,
    type FAQItem,
    type SupportTicket,
} from '@/lib/hotel/hotel-data';

// Simulate network delay
const delay = (ms: number = 200) => new Promise(resolve => setTimeout(resolve, ms));

export type { FAQItem, SupportTicket };

export interface HelpData {
    faqs: FAQItem[];
    tickets: SupportTicket[];
}

export const hotelHelpService = {
    /**
     * Get help data
     */
    async getHelpData(): Promise<HelpData> {
        await delay(100);
        return {
            faqs: MOCK_FAQS,
            tickets: MOCK_SUPPORT_TICKETS,
        };
    },

    /**
     * Submit support message
     */
    async submitMessage(subject: string, message: string): Promise<ServiceResponse<void>> {
        await delay(1500);
        return { success: true, data: undefined, error: undefined };
    },
};
