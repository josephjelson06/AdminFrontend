'use client';

/**
 * RecentCheckInItem Component
 * 
 * Expandable row for recent check-in activity.
 */

import { useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import type { GuestCheckIn } from '@/lib/hotel/hotel-data';

interface RecentCheckInItemProps {
    guest: GuestCheckIn;
}

export function RecentCheckInItem({ guest }: RecentCheckInItemProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="border-b border-slate-100 dark:border-slate-700 last:border-0">
            <div
                className="flex items-center justify-between py-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 px-2 rounded-lg transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                        <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                            {guest.guestName.split(' ').map(n => n[0]).join('')}
                        </span>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{guest.guestName}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Room {guest.roomNumber}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">{guest.checkInTime}</p>
                    {guest.verification === 'verified' && (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" />
                            Verified
                        </span>
                    )}
                    {guest.verification === 'manual' && (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                            <AlertCircle className="w-3 h-3" />
                            Manual
                        </span>
                    )}
                    {guest.verification === 'failed' && (
                        <span className="inline-flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400">
                            <AlertCircle className="w-3 h-3" />
                            Failed
                        </span>
                    )}
                </div>
            </div>
            {isExpanded && (
                <div className="px-14 pb-3 pt-0 text-xs text-slate-500 dark:text-slate-400 grid grid-cols-2 gap-2 animate-in slide-in-from-top-1 fade-in duration-200">
                    <div>
                        <span className="block text-slate-400 dark:text-slate-500">Booking ID</span>
                        <span className="font-mono text-slate-700 dark:text-slate-300">{guest.bookingId}</span>
                    </div>
                    <div>
                        <span className="block text-slate-400 dark:text-slate-500">Kiosk</span>
                        <span>{guest.kioskId}</span>
                    </div>
                    <div>
                        <span className="block text-slate-400 dark:text-slate-500">Language</span>
                        <span>{guest.language}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
