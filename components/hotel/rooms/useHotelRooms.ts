'use client';

/**
 * useHotelRooms Hook
 * 
 * Manages hotel rooms state and operations.
 */

import { useState, useEffect, useCallback } from 'react';
import {
    hotelRoomService,
    type RoomStats,
} from '@/lib/services/hotelRoomService';
import type { Room, RoomStatus } from '@/lib/hotel/hotel-data';

export interface UseHotelRoomsReturn {
    // Data
    rooms: Room[];
    stats: RoomStats;

    // Filters
    floorFilter: string;
    setFloorFilter: (filter: string) => void;
    statusFilter: string;
    setStatusFilter: (filter: string) => void;

    // Pagination
    currentPage: number;
    setCurrentPage: (page: number) => void;
    rowsPerPage: number;
    setRowsPerPage: (rows: number) => void;
    totalPages: number;
    paginatedRooms: Room[];

    // Actions
    updateRoomStatus: (roomId: string, newStatus: RoomStatus) => Promise<boolean>;
    getNextStatus: (currentStatus: RoomStatus) => RoomStatus;
    refresh: () => Promise<void>;

    // State
    isLoading: boolean;
    isRefreshing: boolean;
}

const defaultStats: RoomStats = {
    ready: 0,
    cleaning: 0,
    occupied: 0,
    dirty: 0,
};

export function useHotelRooms(): UseHotelRoomsReturn {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [stats, setStats] = useState<RoomStats>(defaultStats);
    const [floorFilter, setFloorFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(12);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [roomsData, statsData] = await Promise.all([
                hotelRoomService.getRooms(floorFilter, statusFilter),
                hotelRoomService.getStats(),
            ]);
            setRooms(roomsData);
            setStats(statsData);
        } finally {
            setIsLoading(false);
        }
    }, [floorFilter, statusFilter]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [floorFilter, statusFilter, rowsPerPage]);

    // Calculate pagination
    const totalPages = Math.max(1, Math.ceil(rooms.length / rowsPerPage));
    const paginatedRooms = rooms.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const updateRoomStatus = useCallback(async (roomId: string, newStatus: RoomStatus): Promise<boolean> => {
        const result = await hotelRoomService.updateStatus(roomId, newStatus);
        if (result.success) {
            setRooms(prev => prev.map(room =>
                room.id === roomId ? { ...room, status: newStatus, lastUpdated: 'Just now' } : room
            ));
            // Update stats locally
            await hotelRoomService.getStats().then(setStats);
        }
        return result.success;
    }, []);

    const refresh = useCallback(async () => {
        setIsRefreshing(true);
        try {
            const refreshedRooms = await hotelRoomService.refresh();
            setRooms(refreshedRooms.filter((room) => {
                const matchesFloor = floorFilter === 'all' || room.floor.toString() === floorFilter;
                const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
                return matchesFloor && matchesStatus;
            }));
            const statsData = await hotelRoomService.getStats();
            setStats(statsData);
        } finally {
            setIsRefreshing(false);
        }
    }, [floorFilter, statusFilter]);

    return {
        rooms,
        stats,
        floorFilter,
        setFloorFilter,
        statusFilter,
        setStatusFilter,
        currentPage,
        setCurrentPage,
        rowsPerPage,
        setRowsPerPage,
        totalPages,
        paginatedRooms,
        updateRoomStatus,
        getNextStatus: hotelRoomService.getNextStatus,
        refresh,
        isLoading,
        isRefreshing,
    };
}
