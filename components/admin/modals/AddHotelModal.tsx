'use client';

import { useState } from 'react';
import { Modal } from '@/components/shared/ui/Modal';
import { SelectDropdown } from '@/components/shared/ui/Dropdown';
import { useToast } from '@/components/shared/ui/Toast';

interface AddHotelModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (data: HotelFormData) => void;
}

interface HotelFormData {
    name: string;
    location: string;
    contactEmail: string;
    plan: string;
    status: string;
}

export function AddHotelModal({ isOpen, onClose, onSubmit }: AddHotelModalProps) {
    const { addToast } = useToast();
    const [formData, setFormData] = useState<HotelFormData>({
        name: '',
        location: '',
        contactEmail: '',
        plan: 'standard',
        status: 'onboarding',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit?.(formData);
        addToast('success', 'Hotel Added', `${formData.name} has been added successfully.`);
        onClose();
        setFormData({ name: '', location: '', contactEmail: '', plan: 'standard', status: 'onboarding' });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Hotel" size="lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-secondary mb-1">Hotel Name *</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., Royal Orchid Bangalore"
                            className="input-glass-strong"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-secondary mb-1">Location *</label>
                        <input
                            type="text"
                            required
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            placeholder="e.g., Mumbai, MH"
                            className="input-glass-strong"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-secondary mb-1">Contact Email *</label>
                        <input
                            type="email"
                            required
                            value={formData.contactEmail}
                            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                            placeholder="e.g., manager@hotel.com"
                            className="input-glass-strong"
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
                                { value: 'onboarding', label: 'Onboarding' },
                                { value: 'active', label: 'Active' },
                                { value: 'suspended', label: 'Suspended' },
                            ]}
                        />
                    </div>
                </div>

                {/* Actions */}
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
                        Add Hotel
                    </button>
                </div>
            </form>
        </Modal>
    );
}
