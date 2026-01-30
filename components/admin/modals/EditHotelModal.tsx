'use client';

import { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalCancelButton, ModalSubmitButton } from '@/components/shared/ui/Modal';
import { SelectDropdown } from '@/components/shared/ui/Dropdown';
import { useToast } from '@/components/shared/ui/Toast';
import type { Hotel, HotelPlan, Status } from '@/types/schema';

interface EditHotelModalProps {
    isOpen: boolean;
    onClose: () => void;
    hotel: Hotel | null;
    onSubmit?: (data: Partial<Hotel>) => void;
}

export function EditHotelModal({ isOpen, onClose, hotel, onSubmit }: EditHotelModalProps) {
    const { addToast } = useToast();
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        contactEmail: '',
        plan: 'standard' as HotelPlan,
        status: 'active' as Status,
    });

    // Update form when hotel changes
    useEffect(() => {
        if (hotel) {
            setFormData({
                name: hotel.name,
                location: hotel.location,
                contactEmail: hotel.contactEmail,
                plan: hotel.plan,
                status: hotel.status,
            });
        }
    }, [hotel]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit?.(formData);
        addToast('success', 'Hotel Updated', `${formData.name} has been updated successfully.`);
        onClose();
    };

    if (!hotel) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} layout="center" size="lg">
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
                <ModalHeader title="Edit Hotel" />

                <ModalBody>
                    <div className="space-y-4">
                        <div>
                            <label className="field-label">Hotel Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="input-glass w-full"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="field-label">Location</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="input-glass w-full"
                                />
                            </div>

                            <div>
                                <label className="field-label">Contact Email</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.contactEmail}
                                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                    className="input-glass w-full"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="field-label">Plan</label>
                                <SelectDropdown
                                    value={formData.plan}
                                    onChange={(value) => setFormData({ ...formData, plan: value as HotelPlan })}
                                    options={[
                                        { value: 'standard', label: 'Standard' },
                                        { value: 'advanced', label: 'Advanced' },
                                    ]}
                                />
                            </div>

                            <div>
                                <label className="field-label">Status</label>
                                <SelectDropdown
                                    value={formData.status}
                                    onChange={(value) => setFormData({ ...formData, status: value as Status })}
                                    options={[
                                        { value: 'active', label: 'Active' },
                                        { value: 'suspended', label: 'Suspended' },
                                        { value: 'onboarding', label: 'Onboarding' },
                                        { value: 'inactive', label: 'Inactive' },
                                    ]}
                                />
                            </div>
                        </div>
                    </div>
                </ModalBody>

                <ModalFooter>
                    <ModalCancelButton />
                    <ModalSubmitButton label="Save Changes" />
                </ModalFooter>
            </form>
        </Modal>
    );
}
