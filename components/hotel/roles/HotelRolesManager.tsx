'use client';

/**
 * HotelRolesManager Component
 * 
 * Main roles and access management component.
 */

import { Shield, Users, ChevronRight, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { HotelLayout } from '@/components/hotel/layout/HotelLayout';
import { EditRoleSlideOver } from '@/components/hotel/modals/EditRoleSlideOver';
import { useHotelRoles } from './useHotelRoles';
import { useToast } from '@/components/shared/ui/Toast';
import {
    ROLE_COLOR_CLASSES,
    ROLE_ICON_COLORS,
    type HotelRoleDefinition,
    type HotelPageAccess,
} from '@/lib/hotel/rbac-data';
import { StatCard } from '@/components/hotel/dashboard/StatCard';
import { PaginationBar } from '@/components/shared/ui/Pagination';
import { GlassCard } from '@/components/shared/ui/GlassCard';

// Role Card Component
function RoleCard({
    role,
    onEdit,
}: {
    role: HotelRoleDefinition;
    onEdit: () => void;
}) {
    const colorClasses = ROLE_COLOR_CLASSES[role.color];
    const iconColor = ROLE_ICON_COLORS[role.color];
    const enabledPages = role.pageAccess.filter(p => p.enabled);

    return (
        <GlassCard padding="lg" className="h-full flex flex-col group">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${iconColor} bg-opacity-20`}>
                        <Shield className={`w-5 h-5 ${colorClasses.text}`} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-primary">
                            {role.name}
                        </h3>
                        <p className="text-xs text-muted">
                            {role.userCount} {role.userCount === 1 ? 'user' : 'users'}
                        </p>
                    </div>
                </div>
                {role.isSystemRole && (
                    <span className="text-[10px] font-medium text-muted surface-glass-soft px-2 py-0.5 rounded-full uppercase tracking-wide">
                        System
                    </span>
                )}
            </div>

            <p className="text-sm text-secondary-text mb-6 min-h-[40px] line-clamp-2">
                {role.description}
            </p>

            {/* Permission Chips */}
            <div className="flex flex-wrap gap-1.5 mb-6 min-h-[56px]">
                {enabledPages.slice(0, 4).map(page => (
                    <span
                        key={page.id}
                        className={`text-xs font-medium px-2.5 py-1 rounded-lg surface-glass-soft text-secondary-text border border-glass`}
                    >
                        {page.name}
                    </span>
                ))}
                {enabledPages.length > 4 && (
                    <span className="text-xs font-medium text-muted px-2.5 py-1">
                        +{enabledPages.length - 4} more
                    </span>
                )}
            </div>

            <div className="mt-auto">
                {/* Edit Button */}
                <button
                    onClick={onEdit}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-800 bg-white hover:bg-white/90 rounded-xl transition-all hover:shadow-lg hover:shadow-white/20"
                >
                    Edit Access
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
            </div>
        </GlassCard>
    );
}

export function HotelRolesManager() {
    const { addToast } = useToast();
    const {
        filteredRoles,
        totalRoles,
        totalUsers,
        searchQuery,
        setSearchQuery,
        editingRole,
        setEditingRole,
        updateRolePermissions,
        isLoading,
    } = useHotelRoles();

    const handleSave = async (roleId: string, newAccess: HotelPageAccess[]) => {
        const success = await updateRolePermissions(roleId, newAccess);
        if (success) {
            addToast('success', 'Role Updated', 'Permission changes saved successfully.');
        }
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(6);

    const totalPages = Math.ceil(filteredRoles.length / rowsPerPage);
    const paginatedRoles = filteredRoles.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

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
            <div className="max-w-6xl mx-auto">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Roles & Access
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Manage staff roles and page permissions
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search roles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>

                        {/* Add Role Button */}
                        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-indigo-500/25">
                            <Plus className="w-4 h-4" />
                            <span className="hidden sm:inline">Add Role</span>
                        </button>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <StatCard
                        title="Active Roles"
                        value={totalRoles}
                        icon={Shield}
                        iconBg="bg-indigo-500/10"
                        iconColor="text-indigo-500"
                    />
                    <StatCard
                        title="Team Members"
                        value={totalUsers}
                        icon={Users}
                        iconBg="bg-emerald-500/10"
                        iconColor="text-emerald-500"
                    />
                </div>

                {/* Roles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paginatedRoles.map(role => (
                        <RoleCard
                            key={role.id}
                            role={role}
                            onEdit={() => setEditingRole(role)}
                        />
                    ))}
                </div>

                {/* Pagination */}
                {filteredRoles.length > 0 && (
                    <div className="mt-6">
                        <PaginationBar
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={filteredRoles.length}
                            pageSize={rowsPerPage}
                            onPageChange={setCurrentPage}
                            onPageSizeChange={setRowsPerPage}
                            pageSizeOptions={[6, 9, 12, 24]}
                        />
                    </div>
                )}

                {/* Empty State */}
                {filteredRoles.length === 0 && (
                    <div className="text-center py-12">
                        <Shield className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">
                            No roles found
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Try adjusting your search query
                        </p>
                    </div>
                )}

                {/* Edit Modal */}
                <EditRoleSlideOver
                    isOpen={!!editingRole}
                    onClose={() => setEditingRole(null)}
                    role={editingRole}
                    onSave={handleSave}
                />
            </div>
        </HotelLayout>
    );
}
