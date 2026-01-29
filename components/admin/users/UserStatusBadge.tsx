'use client';

import { Badge, getStatusVariant } from '@/components/shared/ui/Badge';
import type { AdminUser } from '@/lib/admin/users-data';

interface UserStatusBadgeProps {
    status: AdminUser['status'];
}

export function UserStatusBadge({ status }: UserStatusBadgeProps) {
    return (
        <Badge variant={getStatusVariant(status)} dot>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
    );
}
