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
} from 'lucide-react';
import { HotelLayout } from '@/components/hotel/layout/HotelLayout';
import { PaginationBar } from '@/components/shared/ui/Pagination';
import { useHotelTeam } from './useHotelTeam';
import { HotelUserCard } from './HotelUserCard';
import { useToast } from '@/components/shared/ui/Toast';
import { GlassCard } from '@/components/shared/ui/GlassCard';

export function HotelTeamManager() {
    const { addToast } = useToast();
    const {
        team,
        paginatedTeam,
        totalPages,
        currentPage,
        rowsPerPage,
        setCurrentPage,
        setRowsPerPage,
        isLoading,
    } = useHotelTeam();

    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Filter team based on search (simple client-side filter for demo)
    const filteredPaginatedTeam = paginatedTeam.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDeleteUser = (user: any) => {
        addToast('info', 'Demo Action', `Delete user ${user.name} feature coming soon.`);
    };

    const handleEditUser = (user: any) => {
        addToast('info', 'Demo Action', `Edit role for ${user.name} feature coming soon.`);
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
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search name or email..."
                            className="pl-9 pr-4 py-2 bg-transparent border-none text-sm w-full focus:ring-0 placeholder:text-muted/70"
                        />
                    </div>
                </GlassCard>

                {/* User Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {filteredPaginatedTeam.map((member) => (
                        <HotelUserCard
                            key={member.id}
                            user={member}
                            onEdit={handleEditUser}
                            onDelete={handleDeleteUser}
                        />
                    ))}
                </div>

                {/* Pagination */}
                {team.length > 0 && (
                    <div className="mt-4">
                        <PaginationBar
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={team.length}
                            pageSize={rowsPerPage}
                            onPageChange={setCurrentPage}
                            onPageSizeChange={setRowsPerPage}
                            pageSizeOptions={[5, 10, 15, 25]}
                        />
                    </div>
                )}
            </div>
        </HotelLayout>
    );
}
