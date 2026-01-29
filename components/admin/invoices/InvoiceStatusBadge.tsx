'use client';

import { CheckCircle, Clock, AlertCircle, X } from 'lucide-react';
import { Badge, getStatusVariant } from '@/components/shared/ui/Badge';
import type { Invoice } from '@/types/finance';

interface InvoiceStatusBadgeProps {
    status: Invoice['status'];
}

const statusConfig = {
    paid: { icon: CheckCircle, label: 'Paid' },
    pending: { icon: Clock, label: 'Pending' },
    overdue: { icon: AlertCircle, label: 'Overdue' },
    cancelled: { icon: X, label: 'Cancelled' },
};

export function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
    const { icon: Icon, label } = statusConfig[status];

    return (
        <Badge variant={getStatusVariant(status)}>
            <Icon className="w-3 h-3" />
            {label}
        </Badge>
    );
}
