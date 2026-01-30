'use client';

/**
 * GuestMobileCard Component
 * 
 * Mobile-optimized guest card for the guests list.
 * Uses the BaseCard system for consistent styling.
 */

import type { GuestCheckIn } from '@/lib/hotel/hotel-data';
import { VerificationBadge } from './VerificationBadge';
import {
    BaseCard,
    CardHeader,
    CardBody,
    CardFooter,
    CardIcon,
} from '@/components/hotel/shared';

interface GuestMobileCardProps {
    guest: GuestCheckIn;
    onClick: () => void;
    animationDelay?: number;
}

export function GuestMobileCard({ guest, onClick, animationDelay = 0 }: GuestMobileCardProps) {
    const initials = guest.guestName.split(' ').map(n => n[0]).join('').slice(0, 2);

    return (
        <BaseCard
            variant="default"
            density="comfortable"
            interactivity="actionable"
            onClick={onClick}
            className="w-full text-left animate-in fade-in slide-in-from-bottom-2"
            style={{ animationDelay: `${animationDelay}ms` }}
        >
            <CardHeader className="mb-2">
                <div className="flex items-center gap-3">
                    <CardIcon
                        color="bg-gradient-to-br from-indigo-400 to-indigo-600"
                        size="md"
                        className="rounded-full"
                    >
                        <span className="text-sm font-semibold text-white">{initials}</span>
                    </CardIcon>
                    <div>
                        <p className="font-medium text-slate-900 dark:text-white">{guest.guestName}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Room {guest.roomNumber}</p>
                    </div>
                </div>
                <VerificationBadge status={guest.verification} />
            </CardHeader>

            <CardFooter className="justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{guest.checkInTime}</span>
                <span>{guest.language}</span>
            </CardFooter>
        </BaseCard>
    );
}
