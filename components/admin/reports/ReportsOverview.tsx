'use client';

/**
 * ReportsOverview Component
 * 
 * Export data reports dashboard with cards for different report types.
 */

import Link from 'next/link';
import {
    Building2,
    CreditCard,
    FileText,
    Users,
    ClipboardList,
    DollarSign,
    ArrowRight,
} from 'lucide-react';
import { GlassCard } from '@/components/shared/ui/GlassCard';

interface ReportType {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    iconBg: string;
    formats: string[];
}

const reportTypes: ReportType[] = [
    {
        id: 'hotels',
        title: 'Hotels Report',
        description: 'Export complete hotel registry data including status, ratings, and amenities.',
        icon: Building2,
        iconBg: 'from-indigo-500 to-purple-600',
        formats: ['CSV', 'PDF', 'XLSX'],
    },
    {
        id: 'subscriptions',
        title: 'Subscriptions Report',
        description: 'Export subscription data with plan details, status, and renewal information.',
        icon: CreditCard,
        iconBg: 'from-blue-500 to-cyan-500',
        formats: ['CSV', 'PDF', 'XLSX'],
    },
    {
        id: 'invoices',
        title: 'Invoices Report',
        description: 'Export invoice data with payment status, amounts, and hotel details.',
        icon: FileText,
        iconBg: 'from-emerald-500 to-teal-500',
        formats: ['CSV', 'PDF', 'XLSX'],
    },
    {
        id: 'users',
        title: 'Users Report',
        description: 'Export user accounts data with roles, status, and activity information.',
        icon: Users,
        iconBg: 'from-purple-500 to-pink-500',
        formats: ['CSV', 'XLSX'],
    },
    {
        id: 'audit',
        title: 'Audit Logs Report',
        description: 'Export system audit logs with user actions and timestamps.',
        icon: ClipboardList,
        iconBg: 'from-amber-500 to-orange-500',
        formats: ['CSV', 'XLSX'],
    },
    {
        id: 'revenue',
        title: 'Revenue Report',
        description: 'Export financial summary with revenue breakdown by hotel and period.',
        icon: DollarSign,
        iconBg: 'from-green-500 to-emerald-600',
        formats: ['PDF', 'XLSX'],
    },
];

export function ReportsOverview() {
    return (
        <div className="space-y-4">
            {/* Page Header */}
            <div className="space-y-1">
                <h1 className="text-2xl font-bold text-primary">Reports</h1>
                <p className="text-sm text-muted">Export data reports</p>
            </div>

            {/* Report Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {reportTypes.map((report) => {
                    const Icon = report.icon;

                    return (
                        <Link
                            key={report.id}
                            href={`/reports/${report.id}`}
                            className="block group"
                        >
                            <GlassCard
                                className="flex flex-col h-full transition-transform duration-200 group-hover:scale-[1.02]"
                                padding="none"
                                hover
                            >
                                <div className="p-6 flex flex-col items-center text-center flex-1 space-y-4">
                                    {/* Icon */}
                                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${report.iconBg} shadow-lg group-hover:shadow-xl transition-shadow`}>
                                        <Icon className="w-7 h-7 text-white" />
                                    </div>

                                    {/* Title & Description */}
                                    <div className="space-y-2">
                                        <h3 className="text-base font-semibold text-primary">
                                            {report.title}
                                        </h3>
                                        <p className="text-xs text-muted leading-relaxed">
                                            {report.description}
                                        </p>
                                    </div>

                                    {/* Format Badges */}
                                    <div className="flex items-center justify-center gap-2 flex-wrap">
                                        {report.formats.map((format) => (
                                            <span
                                                key={format}
                                                className="px-2.5 py-1 text-xs font-medium rounded-md surface-glass-soft text-muted"
                                            >
                                                {format}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Export Link */}
                                <div className="px-6 pb-6">
                                    <div className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-info group-hover:text-primary transition-colors">
                                        <span>Export</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </GlassCard>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
