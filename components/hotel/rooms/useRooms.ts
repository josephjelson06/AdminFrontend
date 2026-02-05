'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/components/shared/ui/Toast';
import type { Room, RoomFilters } from './types';

export function useRooms() {
    const { addToast } = useToast();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<RoomFilters>({});

    const fetchRooms = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await api.rooms.list(filters);
            if (result.success) {
                setRooms(result.data as any); // Type cast due to generic API response
            } else {
                addToast('error', 'Error', result.error || 'Failed to fetch rooms');
            }
        } catch (err) {
            addToast('error', 'Error', 'Failed to fetch rooms');
        } finally {
            setIsLoading(false);
        }
    }, [addToast, filters]);

    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);

    const addRoom = async (data: any) => {
        try {
            const result = await api.rooms.create(data);
            if (result.success) {
                addToast('success', 'Success', 'Room created successfully');
                fetchRooms();
                return true;
            } else {
                addToast('error', 'Error', result.error || 'Failed to create room');
                return false;
            }
        } catch (err) {
            addToast('error', 'Error', 'Failed to create room');
            return false;
        }
    };

    const updateRoom = async (id: number, data: any) => {
        try {
            const result = await api.rooms.update(id, data);
            if (result.success) {
                addToast('success', 'Success', 'Room updated successfully');
                fetchRooms();
                return true;
            } else {
                addToast('error', 'Error', result.error || 'Failed to update room');
                return false;
            }
        } catch (err) {
            addToast('error', 'Error', 'Failed to update room');
            return false;
        }
    };

    const deleteRoom = async (id: number) => {
        try {
            const result = await api.rooms.delete(id);
            if (result.success) {
                addToast('success', 'Success', 'Room deleted successfully');
                fetchRooms();
                return true;
            } else {
                addToast('error', 'Error', result.error || 'Failed to delete room');
                return false;
            }
        } catch (err) {
            addToast('error', 'Error', 'Failed to delete room');
            return false;
        }
    };

    return {
        rooms,
        isLoading,
        filters,
        setFilters,
        fetchRooms,
        addRoom,
        updateRoom,
        deleteRoom,
    };
}
