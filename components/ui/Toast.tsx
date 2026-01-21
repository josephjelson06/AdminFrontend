'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (type: ToastType, title: string, message?: string) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((type: ToastType, title: string, message?: string) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast = { id, type, title, message };

        setToasts((prev) => [...prev, newToast]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 5000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
}

const toastVariants = {
    initial: { opacity: 0, x: 50, scale: 0.95 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: 80, scale: 0.9 },
};

const smoothTransition = {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
};

function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
    return (
        <div className="fixed bottom-4 right-4 z-50 space-y-2">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
                ))}
            </AnimatePresence>
        </div>
    );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
    const icons: Record<ToastType, typeof CheckCircle> = {
        success: CheckCircle,
        error: XCircle,
        warning: AlertTriangle,
        info: Info,
    };

    const styles: Record<ToastType, { iconColor: string; accentColor: string }> = {
        success: { iconColor: 'text-emerald-500', accentColor: 'border-l-emerald-500' },
        error: { iconColor: 'text-rose-500', accentColor: 'border-l-rose-500' },
        warning: { iconColor: 'text-amber-500', accentColor: 'border-l-amber-500' },
        info: { iconColor: 'text-blue-500', accentColor: 'border-l-blue-500' },
    };

    const Icon = icons[toast.type];
    const style = styles[toast.type];

    return (
        <motion.div
            layout
            variants={toastVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={smoothTransition}
            className={`glass-panel rounded-xl p-4 min-w-[300px] max-w-[400px] border-l-4 ${style.accentColor}`}
        >
            <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 ${style.iconColor} flex-shrink-0 mt-0.5`} />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{toast.title}</p>
                    {toast.message && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{toast.message}</p>
                    )}
                </div>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                    <X className="w-4 h-4 text-slate-400" />
                </motion.button>
            </div>
        </motion.div>
    );
}

