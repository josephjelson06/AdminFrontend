import { MOCK_HOTELS, MOCK_KIOSKS } from '@/lib/admin/mock-data';
import { MOCK_INVOICES } from '@/lib/admin/finance-data';
import { MOCK_TICKETS } from '@/lib/admin/support-data';

export function getHotelFullProfile(hotelId: string) {
    const hotel = MOCK_HOTELS.find(h => h.id === hotelId);
    if (!hotel) return null;

    const kiosks = MOCK_KIOSKS.filter(k => k.assignedHotelId === hotelId);
    const invoices = MOCK_INVOICES.filter(i => i.hotelId === hotelId);
    const tickets = MOCK_TICKETS.filter(t => t.hotelId === hotelId);

    // Mock Users for this hotel (using static data for now as we don't have a global users list with hotelId)
    const users = [
        { id: 'u1', name: 'Rajesh Kumar', role: 'Hotel Admin', email: 'rajesh@royalorchid.com', status: 'active' },
        { id: 'u2', name: 'Front Desk A', role: 'Front Desk', email: 'reception@royalorchid.com', status: 'active' },
        { id: 'u3', name: 'Manager', role: 'General Manager', email: 'gm@royalorchid.com', status: 'active' }
    ];

    return {
        ...hotel,
        stats: {
            kiosksTotal: kiosks.length,
            kiosksOnline: kiosks.filter(k => k.status === 'online').length,
            openTickets: tickets.filter(t => t.status !== 'resolved').length,
            totalSpent: invoices.filter(i => i.status === 'paid').reduce((acc, inv) => acc + inv.totalAmount, 0)
        },
        kiosks,
        invoices,
        tickets,
        users
    };
}
