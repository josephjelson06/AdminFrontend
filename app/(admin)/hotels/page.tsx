'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Plus,
    MoreHorizontal,
    Edit2,
    Trash2,
    ExternalLink,
    MapPin,
    Search,
    UserCheck
} from 'lucide-react';
import { MOCK_HOTELS } from '@/lib/admin/mock-data';
import type { Hotel } from '@/types/schema';
import { DataTable, Column, TableBadge } from '@/components/shared/ui/DataTable';
import { Dropdown, DropdownItem } from '@/components/shared/ui/Dropdown';
import { AddHotelModal } from '@/components/admin/modals/AddHotelModal';
import { EditHotelModal } from '@/components/admin/modals/EditHotelModal';
import { ImpersonationModal } from '@/components/admin/modals/ImpersonationModal'; // Import the modal
import { ConfirmModal } from '@/components/admin/modals/ConfirmModal';
import { useToast } from '@/components/shared/ui/Toast';
import { GlassCard } from '@/components/shared/ui/GlassCard';

function StatusBadge({ status }: { status: string }) {
    const variant = status === 'active' ? 'success' : status === 'onboarding' ? 'warning' : 'default';
    return <TableBadge variant={variant}>{status}</TableBadge>;
}

export default function HotelsPage() {
    const router = useRouter();
    const { addToast } = useToast();
    
    // Modal States
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showImpersonateModal, setShowImpersonateModal] = useState(false); // State for impersonation
    const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

    // Handlers
    const handleImpersonate = (hotel: Hotel) => {
        // In a real app, this would swap the JWT token for a Hotel Admin token
        // For this demo, we verify the intent and redirect to the hotel layout
        addToast('success', 'Session Switched', `Now logged in as admin for ${hotel.name}`);
        
        // Redirect to the Hotel Panel
        router.push('/hotel'); 
    };

    const handleDelete = () => {
        addToast('success', 'Hotel Removed', `"${selectedHotel?.name}" has been deleted.`);
        setShowDeleteModal(false);
        setSelectedHotel(null);
    };

    // Columns Definition
    const columns: Column<Hotel>[] = [
        {
            id: 'name',
            header: 'Hotel Name',
            accessor: (hotel) => (
                <div>
                    <div className="font-medium text-slate-900 dark:text-white">{hotel.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 md:hidden">{hotel.location}</div>
                </div>
            ),
        },
        {
            id: 'location',
            header: 'Location',
            accessor: (hotel) => (
                <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                    <MapPin className="w-3.5 h-3.5" />
                    {hotel.city}
                </div>
            ),
            hideOnMobile: true,
        },
        {
            id: 'plan',
            header: 'Plan',
            accessor: (hotel) => (
                <span className="capitalize text-slate-600 dark:text-slate-300">{hotel.plan}</span>
            ),
            hideOnMobile: true,
        },
        {
            id: 'kiosks',
            header: 'Kiosks',
            accessor: (hotel) => (
                <span className="font-medium text-slate-900 dark:text-white">{hotel.kioskCount}</span>
            ),
        },
        {
            id: 'status',
            header: 'Status',
            accessor: (hotel) => <StatusBadge status={hotel.status} />,
        },
        {
            id: 'actions',
            header: 'Actions',
            accessor: (hotel) => (
                <div className="flex justify-end">
                    <Dropdown
                        trigger={
                            <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors">
                                <MoreHorizontal className="w-4 h-4 text-slate-500" />
                            </button>
                        }
                        align="right"
                    >
                        <DropdownItem onClick={() => {
                            setSelectedHotel(hotel);
                            setShowImpersonateModal(true);
                        }}>
                            <UserCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                            <span className="text-amber-700 dark:text-amber-400 font-medium">Login as Admin</span>
                        </DropdownItem>
                        <div className="my-1 border-t border-slate-100 dark:border-slate-700" />
                        <DropdownItem onClick={() => router.push(`/hotels/${hotel.id}`)}>
                            <ExternalLink className="w-4 h-4" />
                            View Details
                        </DropdownItem>
                        <DropdownItem onClick={() => {
                            setSelectedHotel(hotel);
                            setShowEditModal(true);
                        }}>
                            <Edit2 className="w-4 h-4" />
                            Edit Hotel
                        </DropdownItem>
                        <DropdownItem
                            onClick={() => {
                                setSelectedHotel(hotel);
                                setShowDeleteModal(true);
                            }}
                            className="text-rose-600 dark:text-rose-400"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </DropdownItem>
                    </Dropdown>
                </div>
            ),
            className: 'w-16 text-right',
        },
    ];

    return (
        <div className="p-4 sm:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Hotels Registry</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Manage hotel tenants and subscriptions
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-slate-800 dark:hover:bg-emerald-700 transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add Hotel
                </button>
            </div>

            {/* Table */}
            <GlassCard className="p-0 overflow-hidden">
                <DataTable
                    data={MOCK_HOTELS}
                    columns={columns}
                    searchPlaceholder="Search hotels..."
                    searchKeys={['name', 'city', 'location']}
                    getRowKey={(hotel) => hotel.id}
                    emptyIcon={<Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />}
                    emptyTitle="No hotels found"
                />
            </GlassCard>

            {/* Modals */}
            <AddHotelModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
            />

            <EditHotelModal 
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedHotel(null);
                }}
                hotel={selectedHotel}
            />

            {/* Integration of the Impersonation Modal */}
            <ImpersonationModal
                isOpen={showImpersonateModal}
                onClose={() => {
                    setShowImpersonateModal(false);
                    setSelectedHotel(null);
                }}
                hotel={selectedHotel}
                onConfirm={handleImpersonate}
            />

            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedHotel(null);
                }}
                onConfirm={handleDelete}
                title="Delete Hotel"
                message={`Are you sure you want to delete "${selectedHotel?.name}"? This will also disable all associated kiosks.`}
                confirmText="Delete Hotel"
                variant="danger"
            />
        </div>
    );
}
