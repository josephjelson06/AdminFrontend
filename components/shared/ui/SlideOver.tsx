'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface SlideOverProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    children: React.ReactNode;
}

const SIZES = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
};

export function SlideOver({
    isOpen,
    onClose,
    title,
    description,
    size = 'md',
    children
}: SlideOverProps) {
    const panelRef = useRef<HTMLDivElement>(null);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="fixed inset-y-0 right-0 flex max-w-full">
                <div
                    ref={panelRef}
                    className={`w-screen ${SIZES[size]} transform transition-transform duration-300 ease-in-out`}
                >
                    <div className="flex h-full flex-col bg-white dark:bg-slate-900 shadow-xl">
                        {/* Header */}
                        <div className="px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                        {title}
                                    </h2>
                                    {description && (
                                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                            {description}
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 -mr-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                                >
                                    <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
