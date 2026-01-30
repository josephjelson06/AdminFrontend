'use client';

import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalCancelButton, ModalSubmitButton } from '@/components/shared/ui/Modal';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    confirmText?: string;
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

    const iconConfigs = {
        danger: {
            bg: 'bg-rose-100 dark:bg-rose-500/20',
            color: 'text-rose-500',
            Icon: AlertTriangle,
        },
        warning: {
            bg: 'bg-amber-100 dark:bg-amber-500/20',
            color: 'text-amber-500',
            Icon: AlertTriangle,
        },
        default: {
            bg: 'bg-slate-100 dark:bg-slate-500/20',
            color: 'text-slate-500',
            Icon: Info,
        },
    };

    const { bg, color, Icon } = iconConfigs[variant];

    const buttonVariant = variant === 'danger' ? 'danger' : variant === 'warning' ? 'warning' : 'primary';

    return (
        <Modal isOpen={isOpen} onClose={onClose} layout="compact">
            <ModalHeader title={title} hideClose />

            <ModalBody>
                <div className="flex flex-col items-center text-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${bg} ${color}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <p className="text-sm text-muted">{message}</p>
                </div>
            </ModalBody>

            <ModalFooter className="!justify-center">
                <ModalCancelButton />
                <ModalSubmitButton
                    label={buttonLabel}
                    variant={buttonVariant}
                    type="button"
                    onClick={handleConfirm}
                />
            </ModalFooter>
        </Modal>
    );
}
