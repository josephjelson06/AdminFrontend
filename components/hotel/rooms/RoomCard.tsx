'use client';

/**
 * RoomCard Component
 * 
 * Interactive room card with status cycling.
 * Uses the BaseCard and Status systems for consistent styling.
 */

import { useState } from 'react';
import { Check, Sparkles, User, BedDouble } from 'lucide-react';
import type { Room, RoomStatus } from '@/lib/hotel/hotel-data';
import { getRoomStatusLabel } from '@/lib/hotel/hotel-data';
import {
    BaseCard,
    CardBody,
    CardFooter,
    CardTitle,
    CardDescription,
    StatusBadge,
    TimeMeta,
    getSemanticToken,
    getTokenStyles,
} from '@/components/hotel/shared';

interface RoomCardProps {
    room: Room;
    onStatusChange: (roomId: string, newStatus: RoomStatus) => void;
    onViewDetails: (room: Room) => void;
    getNextStatus: (currentStatus: RoomStatus) => RoomStatus;
}

const statusConfig: Record<RoomStatus, {
    bg: string;
    border: string;
    icon: React.ReactNode;
}> = {
    ready: {
        bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-900/50',
        border: 'border-emerald-300 dark:border-emerald-700 hover:border-emerald-400 dark:hover:border-emerald-600',
        icon: <Check className="w-4 h-4 text-white" />,
    },
    cleaning: {
        bg: 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-900/50',
        border: 'border-amber-300 dark:border-amber-700 hover:border-amber-400 dark:hover:border-amber-600',
        icon: <Sparkles className="w-4 h-4 text-white" />,
    },
    occupied: {
        bg: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/50',
        border: 'border-blue-300 dark:border-blue-700',
        icon: <User className="w-4 h-4 text-white" />,
    },
    dirty: {
        bg: 'bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/30 dark:to-rose-900/50',
        border: 'border-rose-300 dark:border-rose-700 hover:border-rose-400 dark:hover:border-rose-600',
        icon: <BedDouble className="w-4 h-4 text-white" />,
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

    const config = statusConfig[room.status];
    const token = getSemanticToken(room.status);
    const tokenStyle = getTokenStyles(token);

    return (
        <BaseCard
            variant="default"
            density="comfortable"
            interactivity={isClickable ? 'stateful' : 'actionable'}
            status={{ color: tokenStyle.badgeSolid }}
            statusPosition="top-right"
            onClick={handleClick}
            className={`
                w-full text-center border-2
                ${config.bg} ${config.border}
                ${isAnimating ? 'scale-95' : ''}
            `}
        >
            {/* Status Icon in Badge */}
            <div className={`absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center ${tokenStyle.badgeSolid} shadow-lg`}>
                {config.icon}
            </div>

            <CardBody className="space-y-1">
                {/* Room Number */}
                <CardTitle size="xl">{room.number}</CardTitle>

                {/* Room Type */}
                <CardDescription className="capitalize font-medium mb-3">
                    {room.type}
                </CardDescription>

                {/* Status Badge */}
                <StatusBadge
                    status={room.status}
                    label={getRoomStatusLabel(room.status)}
                    variant="solid"
                />
            </CardBody>

            <CardFooter className="justify-center mt-2">
                <TimeMeta time={room.lastUpdated} variant="relative" />
            </CardFooter>
        </BaseCard>
    );
}
