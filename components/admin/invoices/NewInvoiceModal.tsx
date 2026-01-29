'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
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

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            hotelName,
            amount: parseFloat(amount),
            dueDate,
            // description not in Invoice type, but passed anyway
        } as Partial<Invoice>);
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="relative w-full max-w-md surface-glass-strong rounded-2xl shadow-elevated">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-glass flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-primary">Create New Invoice</h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg glass-hover transition-all duration-fast"
                        >
                            <X className="w-5 h-5 text-muted" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
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

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn-secondary flex-1"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn-primary flex-1"
                            >
                                Create Invoice
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
