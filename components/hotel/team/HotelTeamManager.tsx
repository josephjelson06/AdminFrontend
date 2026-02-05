'use client';

/**
 * HotelTeamManager Component
 * 
 * Main team management component.
 */

import { useState } from 'react';
import {
    UserPlus,
    Users,
    Search,
    Ban,
    CheckCircle,
} from 'lucide-react';
import { HotelLayout } from '@/components/hotel/layout/HotelLayout';
import { PaginationBar } from '@/components/shared/ui/Pagination';
import { useHotelTeam } from './useHotelTeam';
import { HotelUserCard } from './HotelUserCard';
import { AddHotelUserModal } from './AddHotelUserModal';
import { EditHotelUserModal } from './EditHotelUserModal';
import { useToast } from '@/components/shared/ui/Toast';
import { GlassCard } from '@/components/shared/ui/GlassCard';
import type { HotelUser } from './types';

export function HotelTeamManager() {
    const { addToast } = useToast();
    const {
        team,
        roles,
        totalPages,
        currentPage,
        rowsPerPage,
        setCurrentPage,
        setRowsPerPage,
        isLoading,
        filters,
        setFilters,
        addMember,
        updateMember,
        deleteMember,
        toggleStatus,
    } = useHotelTeam();

    const [showAddModal, setShowAddModal] = useState(false);
    const [editingUser, setEditingUser] = useState<HotelUser | null>(null);

    const handleEditUser = (user: HotelUser) => {
        setEditingUser(user);
    };

    const handleDeleteUser = async (user: HotelUser) => {
        if (confirm(`Are you sure you want to remove ${user.full_name}? This action cannot be undone.`)) {
            await deleteMember(user.id);
        }
    };

    const handleToggleStatus = async (user: HotelUser) => {
         await toggleStatus(user);
    };

    if (isLoading) {
        return (
            <HotelLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
                </div>
            </HotelLayout>
        );
    }

    return (
        <HotelLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            Team & Users
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Manage hotel staff accounts and access.
                        </p>
                    </div>

                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 dark:shadow-none"
                    >
                        <UserPlus className="w-4 h-4" />
                        Invite Member
                    </button>
                </div>

                {/* Filters */}
                <GlassCard className="p-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                        <input
                            type="text"
                            value={filters.search || ''}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                            placeholder="Search name or email..."
                            className="pl-9 pr-4 py-2 bg-transparent border-none text-sm w-full focus:ring-0 placeholder:text-muted/70"
                        />
                    </div>
                </GlassCard>

                {/* User Grid */}
                {team.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {team.map((member) => (
                            <HotelUserCard
                                key={member.id}
                                user={member}
                                onEdit={handleEditUser}
                                onDelete={handleDeleteUser}
                                onToggleStatus={handleToggleStatus}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50">
                        <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-3">
                            <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white">No team members found</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 mb-4">
                            Try adjusting your filters or invite a new member.
                        </p>
                        <button
                             onClick={() => setShowAddModal(true)}
                             className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline text-sm"
                        >
                            Invite First Member
                        </button>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-4">
                        <PaginationBar
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={totalPages * rowsPerPage} // Approx
                            pageSize={rowsPerPage}
                            onPageChange={setCurrentPage}
                            onPageSizeChange={setRowsPerPage}
                            pageSizeOptions={[5, 10, 15, 25]}
                        />
                    </div>
                )}

                {/* Modals */}
                <AddHotelUserModal
                    isOpen={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    onSave={addMember}
                    roles={roles}
                />

                <EditHotelUserModal
                    isOpen={!!editingUser}
                    onClose={() => setEditingUser(null)}
                    user={editingUser}
                    onSave={updateMember}
                    roles={roles}
                />
            </div>
        </HotelLayout>
    );
}
