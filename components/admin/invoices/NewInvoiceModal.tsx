'use client';

import { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalCancelButton, ModalSubmitButton } from '@/components/shared/ui/Modal';
import type { Invoice } from '@/types/finance';

interface NewInvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<Invoice>) => void;
}

export function NewInvoiceModal({ isOpen, onClose, onSubmit }: NewInvoiceModalProps) {
    const [hotelName, setHotelName] = useState('');
    const [amount, setAmount] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            hotelName,
            amount: parseFloat(amount),
            dueDate,
        } as Partial<Invoice>);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} layout="center" size="sm">
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
                <ModalHeader title="Create New Invoice" />

                <ModalBody>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-secondary-text mb-1">
                                Hotel
                            </label>
                            <select
                                value={hotelName}
                                onChange={(e) => setHotelName(e.target.value)}
                                required
                                className="input-glass"
                            >
                                <option value="">Select a hotel...</option>
                                <option value="Royal Orchid Bangalore">Royal Orchid Bangalore</option>
                                <option value="Lemon Tree Premier">Lemon Tree Premier</option>
                                <option value="Ginger Hotel, Panjim">Ginger Hotel, Panjim</option>
                                <option value="Taj Palace">Taj Palace</option>
                                <option value="ITC Maratha">ITC Maratha</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary-text mb-1">
                                Amount (₹)
                            </label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                                min="1"
                                placeholder="Enter amount"
                                className="input-glass"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary-text mb-1">
                                Due Date
                            </label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                required
                                className="input-glass"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary-text mb-1">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                placeholder="Invoice description or notes..."
                                className="input-glass resize-none"
                            />
                        </div>
                    </div>
                </ModalBody>

                <ModalFooter>
                    <ModalCancelButton />
                    <ModalSubmitButton label="Create Invoice" />
                </ModalFooter>
            </form>
        </Modal>
    );
}
