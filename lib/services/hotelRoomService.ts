/**
 * Hotel Rooms Service
 * 
 * Abstracts room management operations.
 */

import {
    MOCK_ROOMS,
    type Room,
    type RoomStatus,
    getRoomStatusLabel,
} from '@/lib/hotel/hotel-data';
import type { ServiceResponse } from './hotelService';

// Simulate network delay
const delay = (ms: number = 200) => new Promise(resolve => setTimeout(resolve, ms));

// Local mutable copy
let rooms = [...MOCK_ROOMS];

// Filter configuration
export const FLOOR_FILTERS = [
    { id: 'all', label: 'All Floors' },
    { id: '1', label: 'Floor 1' },
    { id: '2', label: 'Floor 2' },
    { id: '3', label: 'Floor 3' },
];

export const STATUS_FILTERS = [
    { id: 'all', label: 'All', color: 'bg-slate-500' },
    { id: 'ready', label: 'Ready', color: 'bg-emerald-500' },
    { id: 'cleaning', label: 'Cleaning', color: 'bg-amber-500' },
    { id: 'occupied', label: 'Occupied', color: 'bg-blue-500' },
    { id: 'dirty', label: 'Dirty', color: 'bg-rose-500' },
];

// Status cycle for tap-to-change
export const STATUS_CYCLE: RoomStatus[] = ['dirty', 'cleaning', 'ready'];

// Room stats
export interface RoomStats {
    ready: number;
    cleaning: number;
    occupied: number;
    dirty: number;
}

export const hotelRoomService = {
    /**
     * Get all rooms with optional filters
     */
    async getRooms(floorFilter?: string, statusFilter?: string): Promise<Room[]> {
        await delay(100);
        return rooms.filter((room) => {
            const matchesFloor = !floorFilter || floorFilter === 'all' || room.floor.toString() === floorFilter;
            const matchesStatus = !statusFilter || statusFilter === 'all' || room.status === statusFilter;
            return matchesFloor && matchesStatus;
        });
    },

    /**
     * Get room stats
     */
    async getStats(): Promise<RoomStats> {
        await delay(50);
        return {
            ready: rooms.filter(r => r.status === 'ready').length,
            cleaning: rooms.filter(r => r.status === 'cleaning').length,
            occupied: rooms.filter(r => r.status === 'occupied').length,
            dirty: rooms.filter(r => r.status === 'dirty').length,
        };
    },

    /**
     * Update room status
     */
    async updateStatus(roomId: string, newStatus: RoomStatus): Promise<ServiceResponse<Room | undefined>> {
        await delay(300);
        const index = rooms.findIndex(r => r.id === roomId);
        if (index === -1) {
            return { success: false, data: undefined, error: 'Room not found' };
        }
        rooms[index] = {
            ...rooms[index],
            status: newStatus,
            lastUpdated: 'Just now',
        };
        return { success: true, data: rooms[index], error: undefined };
    },

    /**
     * Refresh rooms data (reset to mock)
     */
    async refresh(): Promise<Room[]> {
        await delay(800);
        rooms = [...MOCK_ROOMS];
        return rooms;
    },

    /**
     * Get next status in cycle
     */
    getNextStatus(currentStatus: RoomStatus): RoomStatus {
        const currentIndex = STATUS_CYCLE.indexOf(currentStatus);
        if (currentIndex === -1) return currentStatus;
        return STATUS_CYCLE[(currentIndex + 1) % STATUS_CYCLE.length];
    },
};
