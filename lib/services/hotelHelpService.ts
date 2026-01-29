/**
 * Hotel Help Service
 * 
 * Abstracts help content and support operations.
 */

import type { ServiceResponse } from './hotelService';

// Simulate network delay
const delay = (ms: number = 200) => new Promise(resolve => setTimeout(resolve, ms));

export interface FAQItem {
    question: string;
    answer: string;
}

export interface SupportTicket {
    id: string;
    subject: string;
    createdAt: string;
    status: 'open' | 'resolved';
}

export interface HelpData {
    faqs: FAQItem[];
    tickets: SupportTicket[];
}

// Mock FAQ data
const MOCK_FAQS: FAQItem[] = [
    {
        question: 'How do I update room status for housekeeping?',
        answer: 'Navigate to the Room Status page from the sidebar. Tap on any room card to cycle through statuses: Dirty → Cleaning → Ready. Occupied rooms will automatically change to Dirty upon guest checkout.',
    },
    {
        question: 'What languages can guests use on the kiosk?',
        answer: 'Available languages depend on your subscription plan. Standard plans support 2 languages, Advanced plans support 4, and Enterprise plans support all 8 languages. Configure languages in Kiosk Settings.',
    },
    {
        question: 'How do I add a new team member?',
        answer: 'Go to Team Access, click "Add Team Member", fill in their details and assign a role. They will receive an email invitation to set up their account.',
    },
    {
        question: 'What does "Manual Verification" mean in Guest Log?',
        answer: 'Manual verification occurs when the kiosk cannot automatically verify a guest\'s ID. Front desk staff then manually verifies the guest\'s identity.',
    },
    {
        question: 'How do I download invoice history?',
        answer: 'Visit Subscription & Billing, find the invoice in the history table, and click the download icon. Invoices are available in PDF format.',
    },
];

const MOCK_TICKETS: SupportTicket[] = [
    { id: '4521', subject: 'Kiosk display issue', createdAt: '3 days ago', status: 'resolved' },
    { id: '4519', subject: 'Add Hindi language', createdAt: '5 days ago', status: 'resolved' },
];

export const hotelHelpService = {
    /**
     * Get help data
     */
    async getHelpData(): Promise<HelpData> {
        await delay(100);
        return {
            faqs: MOCK_FAQS,
            tickets: MOCK_TICKETS,
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
