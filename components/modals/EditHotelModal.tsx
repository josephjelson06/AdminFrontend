'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { SelectDropdown } from '@/components/ui/Dropdown';
import { useToast } from '@/components/ui/Toast';
import type { Hotel } from '@/types/schema';

interface EditHotelModalProps {
    isOpen: boolean;
    onClose: () => void;
    hotel: Hotel | null;
    onSubmit?: (data: Partial<Hotel>) => void;
}

export function EditHotelModal({ isOpen, onClose, hotel, onSubmit }: EditHotelModalProps) {
    const { addToast } = useToast();
    const [formData, setFormData] = useState({
        name: hotel?.name || '',
        location: hotel?.location || '',
        contactEmail: hotel?.contactEmail || '',
        plan: hotel?.plan || 'standard',
        status: hotel?.status || 'active',
    });

    // Update form when hotel changes
    useState(() => {
        if (hotel) {
            setFormData({
                name: hotel.name,
                location: hotel.location,
                contactEmail: hotel.contactEmail,
                plan: hotel.plan,
                status: hotel.status,
            });
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit?.(formData);
        addToast('success', 'Hotel Updated', `${formData.name} has been updated successfully.`);
        onClose();
    };

    if (!hotel) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Hotel" size="lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Hotel Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                        <input
                            type="text"
                            required
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Contact Email</label>
                        <input
                            type="email"
                            required
                            value={formData.contactEmail}
                            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Plan</label>
                        <SelectDropdown
                            value={formData.plan}
                            onChange={(value) => setFormData({ ...formData, plan: value })}
                            options={[
                                { value: 'standard', label: 'Standard' },
                                { value: 'advanced', label: 'Advanced' },
                            ]}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                        <SelectDropdown
                            value={formData.status}
                            onChange={(value) => setFormData({ ...formData, status: value })}
                            options={[
                                { value: 'active', label: 'Active' },
                                { value: 'suspended', label: 'Suspended' },
                                { value: 'onboarding', label: 'Onboarding' },
                                { value: 'inactive', label: 'Inactive' },
                            ]}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800 transition-colors"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </Modal>
    );
}
