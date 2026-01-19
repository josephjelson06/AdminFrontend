'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Building2, MapPin, Mail, Cpu, ExternalLink, MoreVertical, Rocket } from 'lucide-react';
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
        active: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
        inactive: 'bg-slate-100 text-slate-600 border border-slate-200',
        suspended: 'bg-rose-100 text-rose-700 border border-rose-200',
        pending: 'bg-amber-100 text-amber-700 border border-amber-200',
        onboarding: 'bg-blue-100 text-blue-700 border border-blue-200',
    };

    return (
        <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${styles[status]}`}>
            {status}
        </span>
    );
}

function PlanBadge({ plan }: { plan: HotelPlan }) {
    const styles: Record<HotelPlan, string> = {
        standard: 'bg-slate-700 text-white',
        advanced: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white',
    };

    return (
        <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${styles[plan]}`}>
            {plan}
        </span>
    );
}

export default function HotelsPage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [editHotel, setEditHotel] = useState<Hotel | null>(null);
    const [suspendHotel, setSuspendHotel] = useState<Hotel | null>(null);
    const { addToast } = useToast();

    const handleSuspend = () => {
        if (suspendHotel) {
            addToast('warning', 'Hotel Suspended', `${suspendHotel.name} has been suspended.`);
            setSuspendHotel(null);
        }
    };

    return (
        <div className="p-6">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900">Hotel Registry</h1>
                    <p className="text-sm text-slate-500">Manage all registered hotels</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-sm text-slate-500">
                        <span className="font-medium text-slate-900">{MOCK_HOTELS.length}</span> hotels
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-50 transition-colors"
                    >
                        + Quick Add
                    </button>
                    <button
                        onClick={() => setIsWizardOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800 transition-colors"
                    >
                        <Rocket className="w-4 h-4" />
                        Onboard Hotel
                    </button>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                Hotel
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                Status
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                Plan
                            </th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                Kiosks
                            </th>
                            <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                MRR
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                Contract Renewal
                            </th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {MOCK_HOTELS.map((hotel) => (
                            <tr key={hotel.id} className="hover:bg-slate-50 transition-colors">
                                {/* Hotel Info */}
                                <td className="px-4 py-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                                            <Building2 className="w-4 h-4 text-slate-600" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-sm font-medium text-slate-900 truncate">
                                                {hotel.name}
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
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
                                    <div className="flex items-center justify-center gap-1 text-sm text-slate-700">
                                        <Cpu className="w-3.5 h-3.5 text-slate-400" />
                                        <span className="font-medium">{hotel.kioskCount}</span>
                                    </div>
                                </td>

                                {/* MRR */}
                                <td className="px-4 py-3 text-right">
                                    <span className={`text-sm font-semibold ${hotel.mrr > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                                        {hotel.mrr > 0 ? formatCurrency(hotel.mrr) : '—'}
                                    </span>
                                </td>

                                {/* Contract Renewal */}
                                <td className="px-4 py-3">
                                    <span className="text-sm text-slate-600">
                                        {new Date(hotel.contractRenewalDate).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </span>
                                </td>

                                {/* Actions */}
                                <td className="px-4 py-3 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                        <Link
                                            href={`/hotels/${hotel.id}`}
                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors"
                                        >
                                            View
                                            <ExternalLink className="w-3 h-3" />
                                        </Link>
                                        <Dropdown
                                            trigger={
                                                <button className="p-1.5 hover:bg-slate-100 rounded-md transition-colors">
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
            <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                <div>
                    Showing <span className="font-medium text-slate-700">{MOCK_HOTELS.length}</span> of{' '}
                    <span className="font-medium text-slate-700">{MOCK_HOTELS.length}</span> hotels
                </div>
                <div className="flex items-center gap-2">
                    <span>Total MRR:</span>
                    <span className="font-semibold text-emerald-600">
                        {formatCurrency(MOCK_HOTELS.reduce((sum, h) => sum + h.mrr, 0))}
                    </span>
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
