'use client';

import { useState } from 'react';
import { Modal } from '@/components/shared/ui/Modal';
import { AlertTriangle, UserCheck, Shield } from 'lucide-react';
import type { Hotel } from '@/types/schema';

interface ImpersonationModalProps {
    isOpen: boolean;
    onClose: () => void;
    hotel: Hotel | null;
    onConfirm: (hotel: Hotel) => void;
}

export function ImpersonationModal({ isOpen, onClose, hotel, onConfirm }: ImpersonationModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = async () => {
        if (!hotel) return;
        setIsLoading(true);
        // Simulate API call for audit logging
        await new Promise(resolve => setTimeout(resolve, 500));
        onConfirm(hotel);
        setIsLoading(false);
        onClose();
    };

    if (!hotel) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="" size="md">
            <div className="text-center">
                {/* Warning Icon */}
                <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
                    <Shield className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    Login as Hotel Admin
                </h3>

                {/* Hotel Name */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg mb-4">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {hotel.name}
                    </span>
                </div>

                {/* Warning Message */}
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                        <div className="text-left">
                            <p className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-1">
                                Privileged Access Warning
                            </p>
                            <p className="text-xs text-amber-700 dark:text-amber-400">
                                You are about to enter this hotel&apos;s admin panel as a Super Admin.
                                All actions will be logged for audit purposes. You will see a
                                persistent banner while impersonating.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                        <UserCheck className="w-4 h-4" />
                        {isLoading ? 'Logging in...' : 'Confirm & Login'}
                    </button>
                </div>

                {/* Audit Note */}
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">
                    This action will be recorded in the audit log
                </p>
            </div>
        </Modal>
    );
}
