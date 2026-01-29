'use client';

import { Badge, getStatusVariant } from '@/components/shared/ui/Badge';
import type { Status } from '@/types/schema';

interface HotelStatusBadgeProps {
    status: Status;
}

export function HotelStatusBadge({ status }: HotelStatusBadgeProps) {
    return (
        <Badge variant={getStatusVariant(status)} dot>
            {status}
        </Badge>
    );
}
