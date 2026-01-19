'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

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

        // Auto remove after 5 seconds
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

function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 space-y-2">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
            ))}
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

    const styles: Record<ToastType, { bg: string; icon: string; border: string }> = {
        success: { bg: 'bg-emerald-50', icon: 'text-emerald-500', border: 'border-emerald-200' },
        error: { bg: 'bg-rose-50', icon: 'text-rose-500', border: 'border-rose-200' },
        warning: { bg: 'bg-amber-50', icon: 'text-amber-500', border: 'border-amber-200' },
        info: { bg: 'bg-blue-50', icon: 'text-blue-500', border: 'border-blue-200' },
    };

    const Icon = icons[toast.type];
    const style = styles[toast.type];

    return (
        <div
            className={`${style.bg} ${style.border} border rounded-lg shadow-lg p-4 min-w-[300px] max-w-[400px] animate-in slide-in-from-right-5 duration-300`}
        >
            <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 ${style.icon} flex-shrink-0 mt-0.5`} />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">{toast.title}</p>
                    {toast.message && (
                        <p className="text-xs text-slate-500 mt-0.5">{toast.message}</p>
                    )}
                </div>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-white/50 rounded transition-colors"
                >
                    <X className="w-4 h-4 text-slate-400" />
                </button>
            </div>
        </div>
    );
}
