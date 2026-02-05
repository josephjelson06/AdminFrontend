'use client';

import { useState } from 'react';
import { Modal } from '@/components/shared/ui/Modal';
import { SelectDropdown } from '@/components/shared/ui/Dropdown';
import { Building2 } from 'lucide-react';

interface AddHotelModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (data: HotelFormData) => void;
}

interface HotelFormData {
    name: string;
    location: string;
    contactEmail: string;
    password: string; // Added password
    managerName: string; // Added manager name
    plan: string;
    status: string;
}

export function AddHotelModal({ isOpen, onClose, onSubmit }: AddHotelModalProps) {
    const [formData, setFormData] = useState<HotelFormData>({
        name: '',
        location: '',
        contactEmail: '',
        password: '',
        managerName: '',
        plan: 'standard',
        status: 'onboarding',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit?.(formData);
        onClose();
        setFormData({ name: '', location: '', contactEmail: '', password: '', managerName: '', plan: 'standard', status: 'onboarding' });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Hotel" size="lg">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Header Icon */}
                <div className="flex justify-center">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25">
                        <Building2 className="w-8 h-8 text-white" />
                    </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-5">
                    {/* Hotel Name - Full Width */}
                    <div className="space-y-2">
                        <label className="field-label required">Hotel Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., Royal Orchid Bangalore"
                            className="input-glass w-full"
                        />
                    </div>

                    {/* Manager Name & Email - Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="field-label required">Manager Name</label>
                            <input
                                type="text"
                                required
                                value={formData.managerName}
                                onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                                placeholder="e.g., John Doe"
                                className="input-glass w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="field-label required">Contact Email</label>
                            <input
                                type="email"
                                required
                                value={formData.contactEmail}
                                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                placeholder="e.g., manager@hotel.com"
                                className="input-glass w-full"
                            />
                        </div>
                    </div>

                    {/* Location & Password - Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="field-label required">Location</label>
                            <input
                                type="text"
                                required
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="e.g., Mumbai, MH"
                                className="input-glass w-full"
                            />
                            <p className="text-xs text-muted">Format: City, State</p>
                        </div>

                        <div className="space-y-2">
                            <label className="field-label required">Password</label>
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="e.g., SecurePassword123"
                                className="input-glass w-full"
                            />
                            <p className="text-xs text-muted">For Hotel Admin login</p>
                        </div>
                    </div>

                    {/* Plan & Status - Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="field-label">Subscription Plan</label>
                            <SelectDropdown
                                value={formData.plan}
                                onChange={(value) => setFormData({ ...formData, plan: value })}
                                options={[
                                    { value: 'basic', label: 'Basic' },
                                    { value: 'standard', label: 'Standard' },
                                    { value: 'premium', label: 'Premium' },
                                    { value: 'enterprise', label: 'Enterprise' },
                                ]}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="field-label">Initial Status</label>
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
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-6 border-t border-glass">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn-ghost"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn-primary"
                    >
                        Add Hotel
                    </button>
                </div>
            </form>
        </Modal>
    );
}
