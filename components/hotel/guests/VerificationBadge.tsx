'use client';

/**
 * VerificationBadge Component
 * 
 * Display guest verification status using the semantic status system.
 */

import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { StatusBadge } from '@/components/hotel/shared';
import type { VerificationStatus } from '@/lib/hotel/hotel-data';

interface VerificationBadgeProps {
    status: VerificationStatus;
}

const statusIcons = {
    verified: CheckCircle2,
    manual: AlertCircle,
    failed: XCircle,
};

const statusLabels: Record<VerificationStatus, string> = {
    verified: 'Verified',
    manual: 'Manual',
    failed: 'Failed',
};

export function VerificationBadge({ status }: VerificationBadgeProps) {
    return (
        <StatusBadge
            status={status}
            label={statusLabels[status]}
            icon={statusIcons[status]}
            showIcon
            size="md"
        />
    );
}
