'use client';

/**
 * UserList Component
 * 
 * Main component for displaying the users grid.
 */

import { useState, useMemo } from 'react';
import { Users } from 'lucide-react';
import { PaginationBar } from '@/components/shared/ui/Pagination';
import { useUsers } from './useUsers';
import { useUserActions } from './useUserActions';
import { UserCard } from './UserCard';
import { UserFiltersBar } from './UserFilters';
import { ConfirmModal } from '@/components/admin/modals/ConfirmModal';

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
        <div className="space-y-4">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
                    <Users className="w-6 h-6 text-primary" />
                    Team Management
                </h1>
                <p className="text-sm text-muted mt-1">
                    Manage internal staff access and security protocols.
                </p>
            </div>

            {/* Filters Toolbar */}
            <UserFiltersBar
                search={filters.search}
                onSearchChange={(value) => setFilter('search', value)}
                role={filters.role}
                onRoleChange={(value) => setFilter('role', value)}
                onInvite={actions.openInviteModal}
            />

            {/* Users Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
