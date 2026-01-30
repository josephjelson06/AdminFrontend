'use client';

/**
 * SubscriptionFilters Component
 * 
 * Filter controls for the subscriptions list using unified Toolbar.
 */

import { Download, ChevronDown, FileText } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import {
    Toolbar,
    ToolbarSearch,
    ToolbarFilterTabs,
    ToolbarFilterDropdown,
} from '@/components/shared/ui/Toolbar';
import type { TabCounts } from '@/lib/services/subscriptionService';

export type TabType = 'all' | 'auto_pay' | 'manual' | 'failed' | 'grace_period';

interface SubscriptionFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
    tabCounts: TabCounts;
    plan: string;
    onPlanChange: (value: string) => void;
    status: string;
    onStatusChange: (value: string) => void;
}

// Tab definitions
function getTabs(counts: TabCounts): { id: string; label: string; count: number; color?: string }[] {
    return [
        { id: 'all', label: 'All Hotels', count: counts.all },
        { id: 'auto_pay', label: 'Auto-Pay', count: counts.auto_pay },
        { id: 'manual', label: 'Manual Pay', count: counts.manual },
        { id: 'failed', label: 'Failed', count: counts.failed, color: 'text-danger' },
        { id: 'grace_period', label: 'Grace', count: counts.grace_period, color: 'text-warning' },
    ];
}

const planOptions = [
    { value: 'all', label: 'All Plans' },
    { value: 'standard', label: 'Standard' },
    { value: 'advanced', label: 'Advanced' },
];

const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'grace_period', label: 'Grace Period' },
];

// Export Dropdown
function ExportDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleExport = (format: 'pdf' | 'excel') => {
        console.log(`Exporting as ${format}`);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="btn-secondary"
            >
                <Download className="w-4 h-4" />
                Export
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-1 w-40 surface-glass-strong border border-glass rounded-xl shadow-lg z-50">
                    <button
                        onClick={() => handleExport('pdf')}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-secondary-text glass-hover transition-colors rounded-t-xl"
                    >
                        <FileText className="w-4 h-4" />
                        Export as PDF
                    </button>
                    <button
                        onClick={() => handleExport('excel')}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-secondary-text glass-hover transition-colors rounded-b-xl"
                    >
                        <FileText className="w-4 h-4" />
                        Export as Excel
                    </button>
                </div>
            )}
        </div>
    );
}

export function SubscriptionFiltersBar({
    search,
    onSearchChange,
    activeTab,
    onTabChange,
    tabCounts,
    plan,
    onPlanChange,
    status,
    onStatusChange,
}: SubscriptionFiltersProps) {
    const tabs = getTabs(tabCounts);

    return (
        <Toolbar
            search={
                <ToolbarSearch
                    value={search}
                    onChange={onSearchChange}
                    placeholder="Search hotels..."
                />
            }
            filters={
                <>
                    <ToolbarFilterTabs
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={(id) => onTabChange(id as TabType)}
                    />
                    <ToolbarFilterDropdown
                        value={plan}
                        onChange={onPlanChange}
                        options={planOptions}
                    />
                    <ToolbarFilterDropdown
                        value={status}
                        onChange={onStatusChange}
                        options={statusOptions}
                    />
                </>
            }
            actions={<ExportDropdown />}
        />
    );
}
