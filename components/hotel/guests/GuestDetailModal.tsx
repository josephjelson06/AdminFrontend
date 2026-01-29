'use client';

import {
    User,
    X,
    Clock,
    Globe,
    CreditCard,
    BedDouble,
    CheckCircle2,
    AlertCircle,
    XCircle,
} from 'lucide-react';
import { GuestCheckIn } from '@/lib/hotel/hotel-data';

interface GuestDetailModalProps {
    guest: GuestCheckIn | null;
    onClose: () => void;
}

export function GuestDetailModal({ guest, onClose }: GuestDetailModalProps) {
    if (!guest) return null;

    const statusConfig = {
        verified: {
            icon: CheckCircle2,
            bg: 'bg-emerald-100 dark:bg-emerald-900/30',
            text: 'text-emerald-700 dark:text-emerald-400',
            label: 'ID Verified'
        },
        manual: {
            icon: AlertCircle,
            bg: 'bg-amber-100 dark:bg-amber-900/30',
            text: 'text-amber-700 dark:text-amber-400',
            label: 'Manual Override'
        },
        failed: {
            icon: XCircle,
            bg: 'bg-rose-100 dark:bg-rose-900/30',
            text: 'text-rose-700 dark:text-rose-400',
            label: 'Verification Failed'
        },
    };

    const status = statusConfig[guest.verification];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-5 text-white">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                            <User className="w-7 h-7" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{guest.guestName}</h2>
                            <p className="text-white/80 text-sm">Room {guest.roomNumber}</p>
                        </div>
                    </div>
                </div>

                {/* Status Banner */}
                <div className={`mx-5 -mt-4 p-4 rounded-xl ${status.bg} flex items-center gap-3 relative z-10 shadow-lg`}>
                    <status.icon className={`w-5 h-5 ${status.text}`} />
                    <div>
                        <p className={`font-semibold ${status.text}`}>{status.label}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                            Check-in completed {guest.checkInTime}
                        </p>
                    </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                                <CreditCard className="w-3.5 h-3.5" />
                                Booking ID
                            </p>
                            <p className="text-sm font-mono font-medium text-slate-900 dark:text-white">
                                {guest.bookingId}
                            </p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                                <BedDouble className="w-3.5 h-3.5" />
                                Room
                            </p>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                                {guest.roomNumber}
                            </p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                                <Globe className="w-3.5 h-3.5" />
                                Language
                            </p>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                                {guest.language}
                            </p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                Time
                            </p>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                                {guest.checkInTime}
                            </p>
                        </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Kiosk Used</p>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                            <span className="text-sm text-slate-900 dark:text-white">
                                {guest.kioskId === 'kiosk-001' ? 'Lobby Kiosk 1' : 'Lobby Kiosk 2'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-slate-200 dark:border-slate-700 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                        Close
                    </button>
                    <button className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors">
                        View Booking
                    </button>
                </div>
            </div>
        </div>
    );
}
