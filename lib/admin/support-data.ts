export type TicketStatus = 'new' | 'open' | 'pending' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

export interface TicketMessage {
    id: string;
    sender: 'user' | 'agent' | 'system';
    senderName: string;
    message: string;
    timestamp: string;
    attachments?: string[];
}

export interface SupportTicket {
    id: string;
    ticketNumber: string; // e.g. TKT-2024-889
    subject: string;
    hotelId: string;
    hotelName: string; // Denormalized for display
    category: 'hardware' | 'billing' | 'software' | 'feature_request';
    priority: TicketPriority;
    status: TicketStatus;
    createdAt: string;
    lastUpdate: string;
    assignedTo?: string; // Admin User ID
    messages: TicketMessage[];
}

export const MOCK_TICKETS: SupportTicket[] = [
    {
        id: 'tkt-001',
        ticketNumber: 'TKT-9921',
        subject: 'Kiosk Printer Jamming Repeatedly',
        hotelId: 'h-001',
        hotelName: 'Royal Orchid Bangalore',
        category: 'hardware',
        priority: 'high',
        status: 'open',
        createdAt: '2 hours ago',
        lastUpdate: '10 mins ago',
        assignedTo: 'Tech Support',
        messages: [
            {
                id: 'msg-1',
                sender: 'user',
                senderName: 'Vikram Mehta',
                message: 'The kiosk in the lobby keeps showing "Paper Jam" even after we clear it.',
                timestamp: '2 hours ago'
            },
            {
                id: 'msg-2',
                sender: 'agent',
                senderName: 'Admin',
                message: 'Have you tried cleaning the roller sensors with the provided kit?',
                timestamp: '15 mins ago'
            }
        ]
    },
    {
        id: 'tkt-002',
        ticketNumber: 'TKT-9922',
        subject: 'Invoice Discrepancy - Jan 2026',
        hotelId: 'h-002',
        hotelName: 'Lemon Tree Premier',
        category: 'billing',
        priority: 'medium',
        status: 'new',
        createdAt: '5 hours ago',
        lastUpdate: '5 hours ago',
        messages: [
            {
                id: 'msg-1',
                sender: 'user',
                senderName: 'Anita Desai',
                message: 'We were charged for 15 kiosks but we only have 13 active.',
                timestamp: '5 hours ago'
            }
        ]
    },
    {
        id: 'tkt-003',
        ticketNumber: 'TKT-9920',
        subject: 'Feature Request: UPI QR on Screen',
        hotelId: 'h-005',
        hotelName: 'Taj Palace',
        category: 'feature_request',
        priority: 'low',
        status: 'resolved',
        createdAt: '2 days ago',
        lastUpdate: '1 day ago',
        messages: [
            {
                id: 'msg-1',
                sender: 'user',
                senderName: 'Manager',
                message: 'Can we show a dynamic UPI QR code for payments?',
                timestamp: '2 days ago'
            },
            {
                id: 'msg-2',
                sender: 'agent',
                senderName: 'Product Team',
                message: 'This is released in Firmware v3.0. Please update your devices.',
                timestamp: '1 day ago'
            }
        ]
    }
];
