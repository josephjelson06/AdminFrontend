'use client';

/**
 * Unified Modal System
 * 
 * Compositional modal with layout variants and sub-components.
 * Supports center, side-panel, and compact layouts.
 */

import { useEffect, useRef, useState, ReactNode, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// TYPES
// ============================================================================

export type ModalLayout = 'center' | 'side-panel' | 'compact';
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface ModalContextValue {
    onClose: () => void;
    layout: ModalLayout;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    /** Layout variant - defaults to center */
    layout?: ModalLayout;
    /** Size - defaults to md */
    size?: ModalSize;
    /** Legacy: title prop for backward compatibility */
    title?: string;
}

// ============================================================================
// CONTEXT
// ============================================================================

const ModalContext = createContext<ModalContextValue | null>(null);

function useModalContext() {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('Modal sub-components must be used within Modal');
    }
    return context;
}

// ============================================================================
// ANIMATIONS
// ============================================================================

const overlayVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

const centerModalVariants = {
    initial: { opacity: 0, scale: 0.95, y: 16 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.97, y: -8 },
};

const sidePanelVariants = {
    initial: { opacity: 0, x: '100%' },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: '100%' },
};

const compactModalVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
};

const smoothTransition = {
    type: 'spring' as const,
    stiffness: 350,
    damping: 30,
};

const slideTransition = {
    type: 'spring' as const,
    stiffness: 300,
    damping: 35,
};

// ============================================================================
// MAIN MODAL COMPONENT
// ============================================================================

export function Modal({
    isOpen,
    onClose,
    children,
    layout = 'center',
    size = 'md',
    title,
}: ModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // Size classes based on layout
    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-6xl',
    };

    const sidePanelSizeClasses = {
        sm: 'w-80',
        md: 'w-96',
        lg: 'w-[28rem]',
        xl: 'w-[32rem]',
        full: 'w-[40rem]',
    };

    // Get variants and classes based on layout
    const getLayoutConfig = () => {
        switch (layout) {
            case 'side-panel':
                return {
                    variants: sidePanelVariants,
                    transition: slideTransition,
                    containerClass: 'fixed inset-0 z-[9999] flex justify-end',
                    modalClass: `h-full ${sidePanelSizeClasses[size]} glass-elevated overflow-hidden flex flex-col`,
                };
            case 'compact':
                return {
                    variants: compactModalVariants,
                    transition: smoothTransition,
                    containerClass: 'fixed inset-0 z-[9999] flex items-center justify-center p-4',
                    modalClass: `w-full max-w-sm glass-elevated rounded-2xl overflow-hidden`,
                };
            default: // center
                return {
                    variants: centerModalVariants,
                    transition: smoothTransition,
                    containerClass: 'fixed inset-0 z-[9999] flex items-center justify-center p-4',
                    modalClass: `w-full ${sizeClasses[size]} glass-elevated rounded-2xl overflow-hidden max-h-[90vh] flex flex-col`,
                };
        }
    };

    const config = getLayoutConfig();

    if (!mounted) return null;

    // Backward compatibility: if title prop is provided, render legacy format
    const renderContent = () => {
        if (title) {
            return (
                <>
                    <ModalHeader title={title} />
                    <ModalBody>{children}</ModalBody>
                </>
            );
        }
        return children;
    };

    return createPortal(
        <ModalContext.Provider value={{ onClose, layout }}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={overlayRef}
                        variants={overlayVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.2 }}
                        className={config.containerClass}
                        style={{
                            background: 'rgba(var(--shadow-color), 0.5)',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                        }}
                        onClick={(e) => e.target === overlayRef.current && onClose()}
                    >
                        <motion.div
                            variants={config.variants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={config.transition}
                            className={config.modalClass}
                        >
                            {renderContent()}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </ModalContext.Provider>,
        document.body
    );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface ModalHeaderProps {
    title: string;
    description?: string;
    icon?: ReactNode;
    /** Hide close button */
    hideClose?: boolean;
}

export function ModalHeader({ title, description, icon, hideClose = false }: ModalHeaderProps) {
    const { onClose, layout } = useModalContext();

    return (
        <div className={`shrink-0 border-b border-glass ${layout === 'side-panel' ? 'px-6 py-5' : 'px-6 py-4'}`}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-semibold text-primary">{title}</h2>
                    {description && (
                        <p className="text-sm text-muted mt-1">{description}</p>
                    )}
                </div>
                {!hideClose && (
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="p-2 btn-ghost rounded-xl shrink-0"
                    >
                        <X className="w-5 h-5 text-muted" />
                    </motion.button>
                )}
            </div>
            {icon && (
                <div className="flex justify-center mt-4">
                    {icon}
                </div>
            )}
        </div>
    );
}

interface ModalBodyProps {
    children: ReactNode;
    className?: string;
    /** No padding */
    noPadding?: boolean;
}

export function ModalBody({ children, className = '', noPadding = false }: ModalBodyProps) {
    const { layout } = useModalContext();
    const paddingClass = noPadding ? '' : layout === 'side-panel' ? 'px-6 py-5' : 'px-6 py-5';

    return (
        <div className={`flex-1 overflow-y-auto ${paddingClass} ${className}`}>
            {children}
        </div>
    );
}

interface ModalFooterProps {
    children: ReactNode;
    className?: string;
}

export function ModalFooter({ children, className = '' }: ModalFooterProps) {
    const { layout } = useModalContext();

    return (
        <div className={`shrink-0 border-t border-glass ${layout === 'side-panel' ? 'px-6 py-4' : 'px-6 py-4'} ${className}`}>
            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3">
                {children}
            </div>
        </div>
    );
}

interface ModalSectionProps {
    title: string;
    icon?: ReactNode;
    children: ReactNode;
    className?: string;
}

export function ModalSection({ title, icon, children, className = '' }: ModalSectionProps) {
    return (
        <div className={`space-y-4 ${className}`}>
            <div className="flex items-center gap-2 text-sm font-medium text-secondary-text">
                {icon}
                {title}
            </div>
            {children}
        </div>
    );
}

// ============================================================================
// BUTTON HELPERS
// ============================================================================

interface ModalCancelButtonProps {
    label?: string;
    onClick?: () => void;
}

export function ModalCancelButton({ label = 'Cancel', onClick }: ModalCancelButtonProps) {
    const { onClose } = useModalContext();

    return (
        <button
            type="button"
            onClick={onClick || onClose}
            className="btn-ghost"
        >
            {label}
        </button>
    );
}

interface ModalSubmitButtonProps {
    label?: string;
    variant?: 'primary' | 'danger' | 'warning';
    disabled?: boolean;
    loading?: boolean;
    type?: 'submit' | 'button';
    onClick?: () => void;
}

export function ModalSubmitButton({
    label = 'Submit',
    variant = 'primary',
    disabled = false,
    loading = false,
    type = 'submit',
    onClick,
}: ModalSubmitButtonProps) {
    const buttonClasses = {
        primary: 'btn-primary',
        danger: 'bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all',
        warning: 'bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-xl font-medium transition-all',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${buttonClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {loading ? 'Loading...' : label}
        </button>
    );
}

// ============================================================================
// COMPOUND COMPONENT EXPORTS
// ============================================================================

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
Modal.Section = ModalSection;
Modal.CancelButton = ModalCancelButton;
Modal.SubmitButton = ModalSubmitButton;
