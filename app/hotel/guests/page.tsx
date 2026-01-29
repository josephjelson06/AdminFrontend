'use client';

/**
 * Hotel Guests Page
 * 
 * Guest check-in log for hotel staff.
 * Uses HotelGuestsManager from components/hotel/guests.
 */

import { HotelGuestsManager } from '@/components/hotel/guests';

export default function GuestsPage() {
    return <HotelGuestsManager />;
}
