'use client';

/**
 * AlertsFeed Component
 * 
 * Displays alerts requiring attention.
 */

import Link from 'next/link';
import {
    AlertTriangle,
    Clock,
    ChevronRight,
    WifiOff,
    CreditCard,
    FileText,
} from 'lucide-react';
import { GlassCard } from '@/components/shared/ui/GlassCard';
import type { Alert } from '@/lib/services/dashboardService';

interface AlertsFeedProps {
    alerts: Alert[];
}

function AlertIcon({ type }: { type: string }) {
    switch (type) {
        case 'offline':
            return <WifiOff className="w-4 h-4 text-danger" />;
        case 'payment':
            return <CreditCard className="w-4 h-4 text-warning" />;
        case 'contract':
            return <FileText className="w-4 h-4 text-info" />;
        default:
            return <AlertTriangle className="w-4 h-4 text-muted" />;
    }
}

function SeverityDot({ severity }: { severity: string }) {
    const colors: Record<string, string> = {
        critical: 'bg-danger',
        warning: 'bg-warning',
        info: 'bg-info',
    };
    return <span className={`w-2 h-2 rounded-full ${colors[severity] || 'bg-muted'}`} />;
}

export function AlertsFeed({ alerts }: AlertsFeedProps) {
    return (
        <GlassCard aurora>
            <div className="px-4 py-3 border-b border-glass">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-warning" />
                        Attention Required
                    </h3>
                    <span className="badge-danger">{alerts.length}</span>
                </div>
            </div>
            <div className="divide-y divide-glass max-h-64 overflow-y-auto">
                {alerts.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                        <p className="text-sm text-success">✓ All systems operational</p>
                    </div>
                ) : (
                    alerts.map((alert) => (
                        <Link
                            key={alert.id}
                            href={alert.href}
                            className="block px-4 py-3 glass-hover transition-all duration-fast cursor-pointer group"
                        >
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5">
                                    <AlertIcon type={alert.type} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <SeverityDot severity={alert.severity} />
                                        <span className="text-sm font-medium text-primary group-hover:text-primary transition-colors">
                                            {alert.title}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted mt-0.5">{alert.message}</p>
                                    <p className="text-xs text-muted mt-1 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {alert.time}
                                    </p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                            </div>
                        </Link>
                    ))
                )}
            </div>
            <div className="px-4 py-2 border-t border-glass">
                <Link
                    href="/audit"
                    className="text-xs text-muted hover:text-primary flex items-center gap-1 transition-colors"
                >
                    View audit logs <ChevronRight className="w-3 h-3" />
                </Link>
            </div>
        </GlassCard>
    );
}
