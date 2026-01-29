'use client';

/**
 * Hotel Incidents Page
 * 
 * Incidents management for hotel (manager + staff views).
 * Uses HotelIncidentsManager from components/hotel/incidents.
 */

import { HotelIncidentsManager } from '@/components/hotel/incidents';

export default function IncidentsPage() {
    return <HotelIncidentsManager />;
}
