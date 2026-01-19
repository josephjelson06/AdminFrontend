'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { SelectDropdown } from '@/components/ui/Dropdown';
import { useToast } from '@/components/ui/Toast';

interface AddUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (data: UserFormData) => void;
}

interface UserFormData {
    name: string;
    email: string;
    role: string;
}

export function AddUserModal({ isOpen, onClose, onSubmit }: AddUserModalProps) {
    const { addToast } = useToast();
    const [formData, setFormData] = useState<UserFormData>({
        name: '',
        email: '',
        role: 'Support',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit?.(formData);
        addToast('success', 'User Added', `${formData.name} has been added as ${formData.role}.`);
        onClose();
        setFormData({ name: '', email: '', role: 'Support' });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New User">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Rahul Sharma"
                        className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label>
                    <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g., rahul@atc.in"
                        className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                    <SelectDropdown
                        value={formData.role}
                        onChange={(value) => setFormData({ ...formData, role: value })}
                        options={[
                            { value: 'Super Admin', label: 'Super Admin' },
                            { value: 'Operations', label: 'Operations' },
                            { value: 'Finance', label: 'Finance' },
                            { value: 'Support', label: 'Support' },
                        ]}
                    />
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
                        Add User
                    </button>
                </div>
            </form>
        </Modal>
    );
}
