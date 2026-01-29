'use client';

/**
 * useHotelActions Hook
 * 
 * Manages hotel CRUD operations and modal states.
 * Separates action logic from the main useHotels data hook.
 */

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { hotelService } from '@/lib/services/hotelService';
import { useToast } from '@/components/shared/ui/Toast';
import type { Hotel } from '@/types/schema';


export interface UseHotelActionsReturn {
    // Selected hotel for actions
    selectedHotel: Hotel | null;
    setSelectedHotel: (hotel: Hotel | null) => void;

    // Modal states
    showAddModal: boolean;
    showEditModal: boolean;
    showDeleteModal: boolean;
    showImpersonateModal: boolean;

    // Modal openers
    openAddModal: () => void;
    openEditModal: (hotel: Hotel) => void;
    openDeleteModal: (hotel: Hotel) => void;
    openImpersonateModal: (hotel: Hotel) => void;

    // Modal closers
    closeAllModals: () => void;

    // Actions
    createHotel: (data: Partial<Hotel>) => Promise<void>;
    updateHotel: (id: string, data: Partial<Hotel>) => Promise<void>;
    deleteHotel: (id: string) => Promise<void>;
    impersonateHotel: (hotel: Hotel) => Promise<void>;

    // Loading states
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
}

export function useHotelActions(onSuccess?: () => void): UseHotelActionsReturn {
    const router = useRouter();
    const { addToast } = useToast();

    // Selected hotel
    const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showImpersonateModal, setShowImpersonateModal] = useState(false);

    // Loading states
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Modal openers
    const openAddModal = useCallback(() => setShowAddModal(true), []);

    const openEditModal = useCallback((hotel: Hotel) => {
        setSelectedHotel(hotel);
        setShowEditModal(true);
    }, []);

    const openDeleteModal = useCallback((hotel: Hotel) => {
        setSelectedHotel(hotel);
        setShowDeleteModal(true);
    }, []);

    const openImpersonateModal = useCallback((hotel: Hotel) => {
        setSelectedHotel(hotel);
        setShowImpersonateModal(true);
    }, []);

    // Close all modals
    const closeAllModals = useCallback(() => {
        setShowAddModal(false);
        setShowEditModal(false);
        setShowDeleteModal(false);
        setShowImpersonateModal(false);
        setSelectedHotel(null);
    }, []);

    // Create hotel
    const createHotel = useCallback(async (data: Partial<Hotel>) => {
        setIsCreating(true);
        try {
            const response = await hotelService.create(data);
            if (response.success) {
                addToast('success', 'Hotel Added', `${data.name} has been added successfully.`);
                closeAllModals();
                onSuccess?.();
            } else {
                addToast('error', 'Error', response.error || 'Failed to create hotel');
            }
        } catch (err) {
            addToast('error', 'Error', 'Failed to create hotel');
        } finally {
            setIsCreating(false);
        }
    }, [addToast, closeAllModals, onSuccess]);

    // Update hotel
    const updateHotel = useCallback(async (id: string, data: Partial<Hotel>) => {
        setIsUpdating(true);
        try {
            const response = await hotelService.update(id, data);
            if (response.success) {
                addToast('success', 'Hotel Updated', `Hotel has been updated successfully.`);
                closeAllModals();
                onSuccess?.();
            } else {
                addToast('error', 'Error', response.error || 'Failed to update hotel');
            }
        } catch (err) {
            addToast('error', 'Error', 'Failed to update hotel');
        } finally {
            setIsUpdating(false);
        }
    }, [addToast, closeAllModals, onSuccess]);

    // Delete hotel
    const deleteHotel = useCallback(async (id: string) => {
        setIsDeleting(true);
        try {
            const response = await hotelService.delete(id);
            if (response.success) {
                addToast('success', 'Hotel Removed', `"${selectedHotel?.name}" has been deleted.`);
                closeAllModals();
                onSuccess?.();
            } else {
                addToast('error', 'Error', response.error || 'Failed to delete hotel');
            }
        } catch (err) {
            addToast('error', 'Error', 'Failed to delete hotel');
        } finally {
            setIsDeleting(false);
        }
    }, [addToast, closeAllModals, onSuccess, selectedHotel?.name]);

    // Impersonate hotel
    const impersonateHotel = useCallback(async (hotel: Hotel) => {
        try {
            const response = await hotelService.impersonate(hotel.id);
            if (response.success) {
                addToast('success', 'Session Switched', `Now logged in as admin for ${hotel.name}`);
                closeAllModals();
                router.push('/hotel');
            }
        } catch (err) {
            addToast('error', 'Error', 'Failed to switch session');
        }
    }, [addToast, closeAllModals, router]);

    return {
        // Selected hotel
        selectedHotel,
        setSelectedHotel,

        // Modal states
        showAddModal,
        showEditModal,
        showDeleteModal,
        showImpersonateModal,

        // Modal openers
        openAddModal,
        openEditModal,
        openDeleteModal,
        openImpersonateModal,

        // Modal closer
        closeAllModals,

        // Actions
        createHotel,
        updateHotel,
        deleteHotel,
        impersonateHotel,

        // Loading states
        isCreating,
        isUpdating,
        isDeleting,
    };
}
