'use client';

import { Badge, getStatusVariant } from '@/components/shared/ui/Badge';
import type { KioskStatus } from '@/types/schema';

interface KioskStatusBadgeProps {
    status: KioskStatus;
}

export function KioskStatusBadge({ status }: KioskStatusBadgeProps) {
    return (
        <Badge variant={getStatusVariant(status)} dot>
            {status}
        </Badge>
    );
}
