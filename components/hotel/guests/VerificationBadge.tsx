'use client';

import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { getVerificationColor, type VerificationStatus } from '@/lib/hotel/hotel-data';

interface VerificationBadgeProps {
    status: VerificationStatus;
}

export function VerificationBadge({ status }: VerificationBadgeProps) {
    const config = {
        verified: { icon: CheckCircle2, label: 'Verified' },
        manual: { icon: AlertCircle, label: 'Manual' },
        failed: { icon: XCircle, label: 'Failed' },
    };

    const { icon: Icon, label } = config[status] || config.verified;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${getVerificationColor(status)}`}>
            <Icon className="w-3.5 h-3.5" />
            {label}
        </span>
    );
}
