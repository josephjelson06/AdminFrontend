'use client';

/**
 * UserList Component
 * 
 * Main component for displaying the users grid.
 */

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Users, Plus, Search, UserX } from 'lucide-react';
import { Card } from '@/components/shared/ui/Card';
import { PaginationBar } from '@/components/shared/ui/Pagination';
import { useUsers } from './useUsers';
import { useUserActions } from './useUserActions';
import { UserCard } from './UserCard';
import { ConfirmModal } from '@/components/admin/modals/ConfirmModal';

const roleOptions = [
    { value: '', label: 'All Roles' },
    { value: 'Super Admin', label: 'Super Admin' },
    { value: 'L1 Support', label: 'Support' },
    { value: 'Finance Manager', label: 'Finance' },
];

export function UserList() {
    const {
        users,
        isLoading,
        error,
        filters,
        setFilter,
        clearFilters,
        refresh,
    } = useUsers();

    const actions = useUserActions(refresh);
    const hasActiveFilters = Boolean(filters.search || filters.role);

    // Pagination state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(9);

    // Paginated data
    const { paginatedUsers, totalPages } = useMemo(() => {
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        return {
            paginatedUsers: users.slice(start, end),
            totalPages: Math.ceil(users.length / pageSize)
        };
    }, [users, page, pageSize]);

    // Reset to page 1 when filters change
    useMemo(() => {
        setPage(1);
    }, [filters.search, filters.role]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
                        <Users className="w-6 h-6 text-primary" />
                        Team Management
                    </h1>
                    <p className="text-sm text-muted mt-1">
                        Manage internal staff access and security protocols.
                    </p>
                </div>
                <Link
                    href="/users/new"
                    className="btn-primary"
                >
                    <Plus className="w-4 h-4" />
                    Invite Member
                </Link>
            </div>

            {/* Filters */}
            <Card>
                <div className="flex flex-wrap items-center gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                        <input
                            type="text"
                            value={filters.search}
                            onChange={(e) => setFilter('search', e.target.value)}
                            placeholder="Search name or email..."
                            className="pl-10 pr-4 py-2 glass-input rounded-lg text-sm w-64"
                        />
                    </div>

                    <div className="h-8 w-px bg-glass hidden sm:block" />

                    {/* Role Filter */}
                    <div className="flex gap-1 surface-glass-soft p-1 rounded-lg">
                        {roleOptions.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => setFilter('role', opt.value)}
                                className={`px-3 py-1 rounded text-sm transition-all ${filters.role === opt.value
                                    ? 'surface-glass-strong text-primary'
                                    : 'text-muted hover:text-primary'
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Users Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : users.length === 0 ? (
                <div className="surface-glass-strong rounded-lg border border-glass p-12 text-center">
                    <UserX className="w-12 h-12 text-muted mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-primary mb-2">No Users Found</h3>
                    <p className="text-sm text-muted mb-4">
                        {hasActiveFilters 
                            ? 'No users match your current filters.'
                            : 'Get started by inviting your first team member.'}
                    </p>
                    {!hasActiveFilters && (
                        <Link href="/users/new" className="btn-primary inline-flex">
                            <Plus className="w-4 h-4" />
                            Invite Member
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {paginatedUsers.map((user) => (
                        <UserCard
                            key={user.id}
                            user={user}
                            onResetPassword={actions.resetPassword}
                            onSuspend={actions.suspendUser}
                            onActivate={actions.activateUser}
                            onDelete={actions.openDeleteModal}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {users.length > 0 && (
                <PaginationBar
                    currentPage={page}
                    totalPages={totalPages}
                    totalItems={users.length}
                    pageSize={pageSize}
                    onPageChange={setPage}
                    onPageSizeChange={setPageSize}
                    pageSizeOptions={[6, 9, 12, 18]}
                />
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={actions.showDeleteModal}
                onClose={actions.closeAllModals}
                onConfirm={() => {
                    if (actions.selectedUser) {
                        actions.deleteUser(actions.selectedUser.id);
                    }
                }}
                title="Remove Team Member"
                message={`Are you sure you want to remove ${actions.selectedUser?.name}? They will immediately lose access to all admin panels.`}
                confirmText="Remove User"
                variant="danger"
            />

            {/* Error display */}
            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                    {error.message}
                </div>
            )}
        </div>
    );
}
