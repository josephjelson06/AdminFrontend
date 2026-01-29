/**
 * Hotel Guest Service
 * 
 * Abstracts guest check-in data operations.
 */

import {
    MOCK_GUEST_CHECKINS,
    type GuestCheckIn,
} from '@/lib/hotel/hotel-data';
import type { ServiceResponse } from './hotelService';

// Simulate network delay
const delay = (ms: number = 200) => new Promise(resolve => setTimeout(resolve, ms));

// Filter configuration
export const DATE_FILTERS = [
    { id: 'today', label: 'Today' },
    { id: 'yesterday', label: 'Yesterday' },
    { id: 'week', label: 'This Week' },
    { id: 'custom', label: 'Custom' },
];

export const GUEST_STATUS_FILTERS = [
    { id: 'all', label: 'All', color: 'bg-slate-500' },
    { id: 'verified', label: 'Verified', color: 'bg-emerald-500' },
    { id: 'manual', label: 'Manual', color: 'bg-amber-500' },
    { id: 'failed', label: 'Failed', color: 'bg-rose-500' },
];

export type GuestStatusFilter = 'all' | 'verified' | 'manual' | 'failed';

// Guest stats
export interface GuestStats {
    total: number;
    verified: number;
    manual: number;
    failed: number;
}

export const hotelGuestService = {
    /**
     * Get guests with filters
     */
    async getGuests(statusFilter?: GuestStatusFilter, searchQuery?: string): Promise<GuestCheckIn[]> {
        await delay(100);
        return MOCK_GUEST_CHECKINS.filter((guest) => {
            const matchesSearch =
                !searchQuery ||
                guest.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                guest.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                guest.roomNumber.includes(searchQuery);

            const matchesStatus = !statusFilter || statusFilter === 'all' || guest.verification === statusFilter;

            return matchesSearch && matchesStatus;
        });
    },

    /**
     * Get guest stats
     */
    async getStats(): Promise<GuestStats> {
        await delay(50);
        return {
            total: MOCK_GUEST_CHECKINS.length,
            verified: MOCK_GUEST_CHECKINS.filter(g => g.verification === 'verified').length,
            manual: MOCK_GUEST_CHECKINS.filter(g => g.verification === 'manual').length,
            failed: MOCK_GUEST_CHECKINS.filter(g => g.verification === 'failed').length,
        };
    },

    /**
     * Export guests to CSV
     */
    async exportCSV(): Promise<ServiceResponse<Blob>> {
        await delay(1500);
        // Mock CSV generation
        const csvContent = 'Name,Booking ID,Room,Time,Language,Status\n' +
            MOCK_GUEST_CHECKINS.map(g =>
                `${g.guestName},${g.bookingId},${g.roomNumber},${g.checkInTime},${g.language},${g.verification}`
            ).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        return { success: true, data: blob, error: undefined };
    },
};
