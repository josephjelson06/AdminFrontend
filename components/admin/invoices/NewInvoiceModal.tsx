'use client';

import { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalCancelButton, ModalSubmitButton } from '@/components/shared/ui/Modal';
import { hotelService } from '@/lib/services/hotelService';
import type { Invoice } from '@/types/finance';
import type { Hotel } from '@/types/schema';

interface NewInvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<Invoice> & { hotelId?: string }) => void;
}

export function NewInvoiceModal({ isOpen, onClose, onSubmit }: NewInvoiceModalProps) {
    const [hotelId, setHotelId] = useState('');
    const [amount, setAmount] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [description, setDescription] = useState('');
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [loadingHotels, setLoadingHotels] = useState(false);

    // Fetch hotels when modal opens
    useEffect(() => {
        if (isOpen) {
            setLoadingHotels(true);
            hotelService.list({ pageSize: 100 }).then(result => {
                setHotels(result.data);
                setLoadingHotels(false);
            });
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const selectedHotel = hotels.find(h => h.id === hotelId);
        onSubmit({
            hotelId,
            hotelName: selectedHotel?.name || '',
            amount: parseFloat(amount),
            totalAmount: parseFloat(amount),
            dueDate,
        });
        // Reset form
        setHotelId('');
        setAmount('');
        setDueDate('');
        setDescription('');
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
                                value={hotelId}
                                onChange={(e) => setHotelId(e.target.value)}
                                required
                                className="input-glass"
                                disabled={loadingHotels}
                            >
                                <option value="">{loadingHotels ? 'Loading hotels...' : 'Select a hotel...'}</option>
                                {hotels.map(hotel => (
                                    <option key={hotel.id} value={hotel.id}>
                                        {hotel.name}
                                    </option>
                                ))}
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
