'use client';

import { AlertTriangle } from 'lucide-react';
import { Modal } from '@/components/shared/ui/Modal';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    confirmText?: string; // Alias for confirmLabel
    variant?: 'danger' | 'warning' | 'default';
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel,
    confirmText,
    variant = 'default',
}: ConfirmModalProps) {
    const buttonLabel = confirmText || confirmLabel || 'Confirm';
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    const buttonStyles = {
        danger: 'bg-rose-600 hover:bg-rose-700 text-white',
        warning: 'bg-amber-500 hover:bg-amber-600 text-white',
        default: 'bg-slate-900 hover:bg-slate-800 text-white',
    };

    const iconColors = {
        danger: 'text-rose-500 bg-rose-100',
        warning: 'text-amber-500 bg-amber-100',
        default: 'text-slate-500 bg-slate-100',
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
            <div className="flex flex-col items-center text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${iconColors[variant]}`}>
                    <AlertTriangle className="w-6 h-6" />
                </div>
                <p className="text-sm text-slate-600 mb-6">{message}</p>
                <div className="flex items-center gap-3 w-full">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${buttonStyles[variant]}`}
                    >
                        {buttonLabel}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
