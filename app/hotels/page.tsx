'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Building2,
    MapPin,
    Mail,
    Cpu,
    ExternalLink,
    MoreVertical,
    Rocket,
    Search,
    Filter,
    X,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Calendar,
    AlertCircle,
} from 'lucide-react';
import { MOCK_HOTELS } from '@/lib/mock-data';
import type { Status, HotelPlan, Hotel } from '@/types/schema';
import { AddHotelModal } from '@/components/modals/AddHotelModal';
import { EditHotelModal } from '@/components/modals/EditHotelModal';
import { OnboardingWizard } from '@/components/modals/OnboardingWizard';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';
import { useToast } from '@/components/ui/Toast';

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
}

function StatusBadge({ status }: { status: Status }) {
    const styles: Record<Status, string> = {
        active: 'bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
        inactive: 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:border-slate-600',
        suspended: 'bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800',
        pending: 'bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
        onboarding: 'bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
    };

    return (
        <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${styles[status]}`}>
            {status}
        </span>
    );
}

function PlanBadge({ plan }: { plan: HotelPlan }) {
    const styles: Record<HotelPlan, string> = {
        standard: 'bg-slate-700 text-white dark:bg-slate-600',
        advanced: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white',
    };

    return (
        <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${styles[plan]}`}>
            {plan}
        </span>
    );
}

// Sort type definition
type SortField = 'name' | 'status' | 'plan' | 'kiosks' | 'mrr' | 'renewal';
type SortDirection = 'asc' | 'desc';

export default function HotelsPage() {
    const router = useRouter();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [editHotel, setEditHotel] = useState<Hotel | null>(null);
    const [suspendHotel, setSuspendHotel] = useState<Hotel | null>(null);
    const { addToast } = useToast();

    // Search, filter, and sort state
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
    const [sortField, setSortField] = useState<SortField>('name');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

    // Calculate days until contract renewal
    const getDaysUntilRenewal = (date: string) => {
        const renewalDate = new Date(date);
        const today = new Date();
        const diffTime = renewalDate.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    // Contract urgency styling
    const getContractUrgency = (date: string) => {
        const days = getDaysUntilRenewal(date);
        if (days < 0) return { label: 'Expired', class: 'text-rose-600 dark:text-rose-400', urgent: true };
        if (days <= 30) return { label: `${days} days`, class: 'text-amber-600 dark:text-amber-400', urgent: true };
        if (days <= 60) return { label: `${days} days`, class: 'text-blue-600 dark:text-blue-400', urgent: false };
        return { label: '', class: 'text-slate-600 dark:text-slate-400', urgent: false };
    };

    // Filter and sort hotels
    const filteredHotels = useMemo(() => {
        let result = [...MOCK_HOTELS];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(hotel =>
                hotel.name.toLowerCase().includes(query) ||
                hotel.location.toLowerCase().includes(query) ||
                hotel.contactEmail.toLowerCase().includes(query)
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            result = result.filter(hotel => hotel.status === statusFilter);
        }

        // Sort
        result.sort((a, b) => {
            let comparison = 0;
            switch (sortField) {
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'status':
                    comparison = a.status.localeCompare(b.status);
                    break;
                case 'plan':
                    comparison = a.plan.localeCompare(b.plan);
                    break;
                case 'kiosks':
                    comparison = a.kioskCount - b.kioskCount;
                    break;
                case 'mrr':
                    comparison = a.mrr - b.mrr;
                    break;
                case 'renewal':
                    comparison = new Date(a.contractRenewalDate).getTime() - new Date(b.contractRenewalDate).getTime();
                    break;
            }
            return sortDirection === 'asc' ? comparison : -comparison;
        });

        return result;
    }, [searchQuery, statusFilter, sortField, sortDirection]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />;
        return sortDirection === 'asc'
            ? <ArrowUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            : <ArrowDown className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
    };

    const handleSuspend = () => {
        if (suspendHotel) {
            addToast('warning', 'Hotel Suspended', `${suspendHotel.name} has been suspended.`);
            setSuspendHotel(null);
        }
    };

    return (
        <div className="p-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Hotel Registry</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Manage all registered hotels • {filteredHotels.length} of {MOCK_HOTELS.length} shown
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        + Quick Add
                    </button>
                    <button
                        onClick={() => setIsWizardOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-slate-800 dark:hover:bg-emerald-700 transition-colors"
                    >
                        <Rocket className="w-4 h-4" />
                        Onboard Hotel
                    </button>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search hotels by name, location, or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-10 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                        >
                            <X className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                    )}
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as Status | 'all')}
                        className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="onboarding">Onboarding</option>
                        <option value="pending">Pending</option>
                        <option value="suspended">Suspended</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                            <th
                                onClick={() => handleSort('name')}
                                className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            >
                                <div className="flex items-center gap-1">
                                    Hotel
                                    <SortIcon field="name" />
                                </div>
                            </th>
                            <th
                                onClick={() => handleSort('status')}
                                className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            >
                                <div className="flex items-center gap-1">
                                    Status
                                    <SortIcon field="status" />
                                </div>
                            </th>
                            <th
                                onClick={() => handleSort('plan')}
                                className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            >
                                <div className="flex items-center gap-1">
                                    Plan
                                    <SortIcon field="plan" />
                                </div>
                            </th>
                            <th
                                onClick={() => handleSort('kiosks')}
                                className="text-center px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            >
                                <div className="flex items-center justify-center gap-1">
                                    Kiosks
                                    <SortIcon field="kiosks" />
                                </div>
                            </th>
                            <th
                                onClick={() => handleSort('mrr')}
                                className="text-right px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            >
                                <div className="flex items-center justify-end gap-1">
                                    MRR
                                    <SortIcon field="mrr" />
                                </div>
                            </th>
                            <th
                                onClick={() => handleSort('renewal')}
                                className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            >
                                <div className="flex items-center gap-1">
                                    Contract Renewal
                                    <SortIcon field="renewal" />
                                </div>
                            </th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {filteredHotels.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-4 py-12 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <Building2 className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                                        <p className="text-sm text-slate-500 dark:text-slate-400">No hotels found matching your criteria</p>
                                        <button
                                            onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
                                            className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
                                        >
                                            Clear filters
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredHotels.map((hotel) => (
                            <tr
                                key={hotel.id}
                                onClick={() => router.push(`/hotels/${hotel.id}`)}
                                className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group"
                            >
                                {/* Hotel Info */}
                                <td className="px-4 py-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                                            <Building2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-sm font-medium text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                                {hotel.name}
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {hotel.location}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Mail className="w-3 h-3" />
                                                    {hotel.contactEmail}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                {/* Status */}
                                <td className="px-4 py-3">
                                    <StatusBadge status={hotel.status} />
                                </td>

                                {/* Plan */}
                                <td className="px-4 py-3">
                                    <PlanBadge plan={hotel.plan} />
                                </td>

                                {/* Kiosks */}
                                <td className="px-4 py-3 text-center">
                                    <div className="flex items-center justify-center gap-1 text-sm text-slate-700 dark:text-slate-300">
                                        <Cpu className="w-3.5 h-3.5 text-slate-400" />
                                        <span className="font-medium">{hotel.kioskCount}</span>
                                    </div>
                                </td>

                                {/* MRR */}
                                <td className="px-4 py-3 text-right">
                                    <span className={`text-sm font-semibold ${hotel.mrr > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
                                        {hotel.mrr > 0 ? formatCurrency(hotel.mrr) : '—'}
                                    </span>
                                </td>

                                {/* Contract Renewal - Enhanced with urgency */}
                                <td className="px-4 py-3">
                                    {(() => {
                                        const urgency = getContractUrgency(hotel.contractRenewalDate);
                                        return (
                                            <div className="flex items-center gap-2">
                                                <Calendar className={`w-3.5 h-3.5 ${urgency.urgent ? urgency.class : 'text-slate-400'}`} />
                                                <span className={`text-sm ${urgency.class}`}>
                                                    {new Date(hotel.contractRenewalDate).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </span>
                                                {urgency.urgent && (
                                                    <span className={`flex items-center gap-1 text-xs ${urgency.class} font-medium`}>
                                                        <AlertCircle className="w-3 h-3" />
                                                        {urgency.label}
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })()}
                                </td>

                                {/* Actions */}
                                <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex items-center justify-center gap-1">
                                        <Link
                                            href={`/hotels/${hotel.id}`}
                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                        >
                                            View
                                            <ExternalLink className="w-3 h-3" />
                                        </Link>
                                        <Dropdown
                                            trigger={
                                                <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors">
                                                    <MoreVertical className="w-4 h-4 text-slate-400" />
                                                </button>
                                            }
                                            align="right"
                                        >
                                            <DropdownItem onClick={() => setEditHotel(hotel)}>
                                                Edit Details
                                            </DropdownItem>
                                            <DropdownItem onClick={() => addToast('info', 'Reset Password', 'Password reset email sent to hotel admin.')}>
                                                Reset Admin Password
                                            </DropdownItem>
                                            <DropdownItem
                                                variant="danger"
                                                onClick={() => setSuspendHotel(hotel)}
                                            >
                                                Suspend Service
                                            </DropdownItem>
                                        </Dropdown>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Summary Footer */}
            <div className="mt-4 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                <div>
                    Showing <span className="font-medium text-slate-700 dark:text-slate-300">{filteredHotels.length}</span> of{' '}
                    <span className="font-medium text-slate-700 dark:text-slate-300">{MOCK_HOTELS.length}</span> hotels
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span>Filtered MRR:</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            {formatCurrency(filteredHotels.reduce((sum, h) => sum + h.mrr, 0))}
                        </span>
                    </div>
                    <div className="hidden sm:flex items-center gap-2">
                        <span>Total MRR:</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {formatCurrency(MOCK_HOTELS.reduce((sum, h) => sum + h.mrr, 0))}
                        </span>
                    </div>
                </div>
            </div>

            {/* Quick Add Modal */}
            <AddHotelModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />

            {/* Onboarding Wizard */}
            <OnboardingWizard
                isOpen={isWizardOpen}
                onClose={() => setIsWizardOpen(false)}
            />

            {/* Edit Modal */}
            <EditHotelModal
                isOpen={!!editHotel}
                onClose={() => setEditHotel(null)}
                hotel={editHotel}
            />

            {/* Suspend Confirm */}
            <ConfirmModal
                isOpen={!!suspendHotel}
                onClose={() => setSuspendHotel(null)}
                onConfirm={handleSuspend}
                title="Suspend Hotel Service"
                message={`Are you sure you want to suspend service for ${suspendHotel?.name}? Their kiosks will go offline and admins will lose portal access.`}
                confirmLabel="Suspend Service"
                variant="danger"
            />
        </div>
    );
}
