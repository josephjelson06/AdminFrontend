'use client';

/**
 * QuickAccessGrid Component
 * 
 * Quick access navigation grid.
 */

import Link from 'next/link';
import {
    Building2,
    Cpu,
    IndianRupee,
    BarChart3,
    Users,
    Settings,
    type LucideIcon,
} from 'lucide-react';
import { GlassCard } from '@/components/shared/ui/GlassCard';

interface QuickAccessItem {
    name: string;
    description: string;
    href: string;
    icon: LucideIcon;
    color: string;
}

const QUICK_ACCESS: QuickAccessItem[] = [
    { name: 'Hotels', description: 'Manage hotel registry', href: '/hotels', icon: Building2, color: 'bg-info/10 text-info' },
    { name: 'Kiosk Fleet', description: 'Monitor device health', href: '/fleet', icon: Cpu, color: 'bg-success/10 text-success' },
    { name: 'Subscriptions', description: 'View entitlements', href: '/subscriptions', icon: IndianRupee, color: 'bg-warning/10 text-warning' },
    { name: 'Reports', description: 'Analytics & insights', href: '/reports', icon: BarChart3, color: 'bg-secondary/10 text-secondary' },
    { name: 'Team & Users', description: 'Manage access', href: '/users', icon: Users, color: 'bg-primary/10 text-primary' },
    { name: 'Settings', description: 'System configuration', href: '/settings', icon: Settings, color: 'bg-surface-elevated text-muted' },
];

export function QuickAccessGrid() {
    return (
        <GlassCard className="lg:col-span-2">
            <div className="px-4 py-3 border-b border-glass">
                <h3 className="text-sm font-semibold text-primary">Quick Access</h3>
            </div>
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {QUICK_ACCESS.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-3 p-3 rounded-xl border border-glass glass-hover transition-all duration-fast group"
                    >
                        <div className={`p-2 rounded-lg ${item.color}`}>
                            <item.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-primary group-hover:text-primary transition-colors">{item.name}</p>
                            <p className="text-xs text-muted truncate">{item.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </GlassCard>
    );
}
