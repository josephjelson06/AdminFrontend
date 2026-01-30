'use client';

/**
 * ExportPageLayout Component
 * 
 * Main layout wrapper for report export pages.
 */

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { GlassCard } from '@/components/shared/ui/GlassCard';

interface ExportPageLayoutProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

export function ExportPageLayout({
    title,
    description,
    icon,
    children,
}: ExportPageLayoutProps) {
    return (
        <div className="space-y-6">
            {/* Back Link */}
            <Link
                href="/reports"
                className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Reports
            </Link>

            {/* Header */}
            <div className="flex items-start gap-4">
                <div className="shrink-0 p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                    {icon}
                </div>
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-primary">{title}</h1>
                    <p className="text-sm text-muted">{description}</p>
                </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {children}
            </div>
        </div>
    );
}
