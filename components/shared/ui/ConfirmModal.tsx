'use client';

import { AlertTriangle, Trash2, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    confirmLabel?: string;
    variant?: 'danger' | 'warning' | 'default';
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText,
    confirmLabel,
    variant = 'default',
}: ConfirmModalProps) {
    if (!isOpen) return null;

    const buttonLabel = confirmLabel || confirmText || 'Confirm';

    const variants = {
        danger: {
            icon: <Trash2 className="w-6 h-6 text-rose-500" />,
            bgColor: 'bg-rose-50 dark:bg-rose-900/20',
            buttonColor: 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500',
        },
        warning: {
            icon: <AlertTriangle className="w-6 h-6 text-amber-500" />,
            bgColor: 'bg-amber-50 dark:bg-amber-900/20',
            buttonColor: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
        },
        default: {
            icon: <AlertCircle className="w-6 h-6 text-indigo-500" />,
            bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
            buttonColor: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
        },
    };

    const config = variants[variant];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Content */}
                        <div className="p-6">
                            <div className={`w-12 h-12 rounded-full ${config.bgColor} flex items-center justify-center mb-4`}>
                                {config.icon}
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                {title}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                {message}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="px-6 pb-6 flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                className={`flex-1 px-4 py-2.5 text-sm font-medium text-white rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${config.buttonColor}`}
                            >
                                {buttonLabel}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
