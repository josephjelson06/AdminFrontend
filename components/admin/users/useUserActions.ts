'use client';

/**
 * useUserActions Hook
 * 
 * Manages user CRUD operations and modal states.
 */

import { useState, useCallback } from 'react';
import { userService } from '@/lib/services/userService';
import { useToast } from '@/components/shared/ui/Toast';
import type { AdminUser } from '@/lib/admin/users-data';

export interface UseUserActionsReturn {
    // Selected user
    selectedUser: AdminUser | null;
    setSelectedUser: (user: AdminUser | null) => void;

    // Modal states
    showInviteModal: boolean;
    showDeleteModal: boolean;

    // Modal openers
    openInviteModal: () => void;
    openDeleteModal: (user: AdminUser) => void;
    closeAllModals: () => void;

    // Actions
    suspendUser: (user: AdminUser) => Promise<void>;
    activateUser: (user: AdminUser) => Promise<void>;
    resetPassword: (user: AdminUser) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
}

export function useUserActions(onSuccess?: () => void): UseUserActionsReturn {
    const { addToast } = useToast();

    // Selected user
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

    // Modal states
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Modal openers
    const openInviteModal = useCallback(() => setShowInviteModal(true), []);

    const openDeleteModal = useCallback((user: AdminUser) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    }, []);

    const closeAllModals = useCallback(() => {
        setShowInviteModal(false);
        setShowDeleteModal(false);
        setSelectedUser(null);
    }, []);

    // Suspend user
    const suspendUser = useCallback(async (user: AdminUser) => {
        const response = await userService.suspend(user.id);
        if (response.success) {
            addToast('warning', 'User Suspended', `${user.name} has been suspended.`);
            onSuccess?.();
        } else {
            addToast('error', 'Error', response.error || 'Failed to suspend user');
        }
    }, [addToast, onSuccess]);

    // Activate user
    const activateUser = useCallback(async (user: AdminUser) => {
        const response = await userService.activate(user.id);
        if (response.success) {
            addToast('success', 'Re-activated', 'User access restored.');
            onSuccess?.();
        } else {
            addToast('error', 'Error', response.error || 'Failed to activate user');
        }
    }, [addToast, onSuccess]);

    // Reset password
    const resetPassword = useCallback(async (user: AdminUser) => {
        const response = await userService.resetPassword(user.id);
        if (response.success) {
            addToast('success', 'Email Sent', `Password reset link sent to ${user.email}`);
        } else {
            addToast('error', 'Error', response.error || 'Failed to send reset email');
        }
    }, [addToast]);

    // Delete user
    const deleteUser = useCallback(async (id: string) => {
        const response = await userService.delete(id);
        if (response.success) {
            addToast('success', 'User Removed', `${selectedUser?.name} has been removed.`);
            closeAllModals();
            onSuccess?.();
        } else {
            addToast('error', 'Error', response.error || 'Failed to delete user');
        }
    }, [addToast, closeAllModals, onSuccess, selectedUser?.name]);

    return {
        selectedUser,
        setSelectedUser,
        showInviteModal,
        showDeleteModal,
        openInviteModal,
        openDeleteModal,
        closeAllModals,
        suspendUser,
        activateUser,
        resetPassword,
        deleteUser,
    };
}
