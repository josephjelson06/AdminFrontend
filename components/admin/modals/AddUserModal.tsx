'use client';

import { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalCancelButton, ModalSubmitButton } from '@/components/shared/ui/Modal';
import { SelectDropdown } from '@/components/shared/ui/Dropdown';
import { useToast } from '@/components/shared/ui/Toast';

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
        <Modal isOpen={isOpen} onClose={onClose} layout="center" size="md">
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
                <ModalHeader title="Add New User" />

                <ModalBody>
                    <div className="space-y-4">
                        <div>
                            <label className="field-label required">Full Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., Rahul Sharma"
                                className="input-glass w-full"
                            />
                        </div>

                        <div>
                            <label className="field-label required">Email Address</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="e.g., rahul@atc.in"
                                className="input-glass w-full"
                            />
                        </div>

                        <div>
                            <label className="field-label">Role</label>
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
                    </div>
                </ModalBody>

                <ModalFooter>
                    <ModalCancelButton />
                    <ModalSubmitButton label="Add User" />
                </ModalFooter>
            </form>
        </Modal>
    );
}
