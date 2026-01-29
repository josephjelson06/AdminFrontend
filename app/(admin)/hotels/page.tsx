'use client';

/**
 * Hotels Page
 * 
 * Admin page for managing hotel tenants.
 * Uses the HotelList component from admin/hotels.
 */

import { HotelList } from '@/components/admin/hotels';

export default function HotelsPage() {
    return (
        <div className="p-4 sm:p-6 animate-in fade-in duration-normal">
            <HotelList />
        </div>
    );
}
