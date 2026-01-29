'use client';

/**
 * RoomCard Component
 * 
 * Interactive room card with status cycling.
 */

import { useState } from 'react';
import { Check, Sparkles, User, BedDouble, Clock } from 'lucide-react';
import type { Room, RoomStatus } from '@/lib/hotel/hotel-data';
import { getRoomStatusLabel } from '@/lib/hotel/hotel-data';

interface RoomCardProps {
    room: Room;
    onStatusChange: (roomId: string, newStatus: RoomStatus) => void;
    onViewDetails: (room: Room) => void;
    getNextStatus: (currentStatus: RoomStatus) => RoomStatus;
}

const statusStyles = {
    ready: {
        bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-900/50',
        border: 'border-emerald-300 dark:border-emerald-700 hover:border-emerald-400 dark:hover:border-emerald-600',
        badge: 'bg-emerald-500 text-white',
        icon: <Check className="w-4 h-4" />,
    },
    cleaning: {
        bg: 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-900/50',
        border: 'border-amber-300 dark:border-amber-700 hover:border-amber-400 dark:hover:border-amber-600',
        badge: 'bg-amber-500 text-white',
        icon: <Sparkles className="w-4 h-4" />,
    },
    occupied: {
        bg: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/50',
        border: 'border-blue-300 dark:border-blue-700',
        badge: 'bg-blue-500 text-white',
        icon: <User className="w-4 h-4" />,
    },
    dirty: {
        bg: 'bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/30 dark:to-rose-900/50',
        border: 'border-rose-300 dark:border-rose-700 hover:border-rose-400 dark:hover:border-rose-600',
        badge: 'bg-rose-500 text-white',
        icon: <BedDouble className="w-4 h-4" />,
    },
};

export function RoomCard({ room, onStatusChange, onViewDetails, getNextStatus }: RoomCardProps) {
    const isClickable = room.status !== 'occupied';
    const [isAnimating, setIsAnimating] = useState(false);

    const handleClick = () => {
        if (!isClickable) {
            onViewDetails(room);
            return;
        }

        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);

        const nextStatus = getNextStatus(room.status);
        onStatusChange(room.id, nextStatus);
    };

    const style = statusStyles[room.status];

    return (
        <button
            onClick={handleClick}
            className={`
                relative p-4 rounded-2xl border-2 transition-all duration-200
                ${style.bg} ${style.border}
                ${isClickable ? 'cursor-pointer hover:scale-105 hover:shadow-lg active:scale-95' : 'cursor-pointer'}
                ${isAnimating ? 'scale-95' : ''}
            `}
        >
            {/* Status Badge */}
            <div className={`absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center ${style.badge} shadow-lg`}>
                {style.icon}
            </div>

            {/* Room Number */}
            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {room.number}
            </div>

            {/* Room Type */}
            <div className="text-xs text-slate-500 dark:text-slate-400 capitalize font-medium mb-3">
                {room.type}
            </div>

            {/* Status Label */}
            <div className={`text-xs font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1 ${style.badge}`}>
                {getRoomStatusLabel(room.status)}
            </div>

            {/* Updated Time */}
            <div className="mt-2 text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {room.lastUpdated}
            </div>

            {/* Tap Hint */}
            {isClickable && (
                <div className="absolute bottom-2 right-2 text-xs text-slate-400 dark:text-slate-500">
                    tap
                </div>
            )}
        </button>
    );
}
