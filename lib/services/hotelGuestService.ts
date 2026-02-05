/**
 * Hotel Guest Service
 * 
 * Abstracts guest check-in data operations.
 */

import {
    type GuestCheckIn,
} from '@/lib/hotel/hotel-data';
import type { ServiceResponse } from './hotelService';

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

// hotelGuestService object removed as functionality moved to api.ts hooks
