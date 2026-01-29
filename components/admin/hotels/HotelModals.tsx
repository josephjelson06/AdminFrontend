'use client';

/**
 * HotelModals Component
 * 
 * Container for all hotel-related modals.
 * Controlled by useHotelActions hook.
 */

import { AddHotelModal } from '@/components/admin/modals/AddHotelModal';
import { EditHotelModal } from '@/components/admin/modals/EditHotelModal';
import { ImpersonationModal } from '@/components/admin/modals/ImpersonationModal';
import { ConfirmModal } from '@/components/admin/modals/ConfirmModal';
import type { UseHotelActionsReturn } from './useHotelActions';

interface HotelModalsProps {
    actions: UseHotelActionsReturn;
}

export function HotelModals({ actions }: HotelModalsProps) {
    const {
        selectedHotel,
        showAddModal,
        showEditModal,
        showDeleteModal,
        showImpersonateModal,
        closeAllModals,
        createHotel,
        updateHotel,
        deleteHotel,
        impersonateHotel,
    } = actions;

    return (
        <>
            {/* Add Hotel Modal */}
            <AddHotelModal
                isOpen={showAddModal}
                onClose={closeAllModals}
                onSubmit={(data) => createHotel({
                    name: data.name,
                    location: data.location,
                    city: data.location,
                    state: 'MH', // Default state
                    plan: data.plan as 'standard' | 'advanced',
                    contactEmail: data.contactEmail,
                    contactPhone: '',
                })}
            />

            {/* Edit Hotel Modal */}
            <EditHotelModal
                isOpen={showEditModal}
                onClose={closeAllModals}
                hotel={selectedHotel}
                onSubmit={(data) => {
                    if (selectedHotel) {
                        updateHotel(selectedHotel.id, data);
                    }
                }}
            />

            {/* Impersonation Modal */}
            <ImpersonationModal
                isOpen={showImpersonateModal}
                onClose={closeAllModals}
                hotel={selectedHotel}
                onConfirm={(hotel) => impersonateHotel(hotel)}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={closeAllModals}
                onConfirm={() => {
                    if (selectedHotel) {
                        deleteHotel(selectedHotel.id);
                    }
                }}
                title="Delete Hotel"
                message={`Are you sure you want to delete "${selectedHotel?.name}"? This will also disable all associated kiosks.`}
                confirmText="Delete Hotel"
                variant="danger"
            />
        </>
    );
}
