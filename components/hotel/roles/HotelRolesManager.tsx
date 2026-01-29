'use client';

/**
 * HotelRolesManager Component
 * 
 * Main roles and access management component.
 */

import { Shield, Users, ChevronRight, Plus, Search } from 'lucide-react';
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
        <div className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-900 transition-all duration-200">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${iconColor}`}>
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                            {role.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {role.description}
                        </p>
                    </div>
                </div>
                {role.isSystemRole && (
                    <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                        System
                    </span>
                )}
            </div>

            {/* User Count */}
            <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-600 dark:text-slate-300">
                    {role.userCount} {role.userCount === 1 ? 'user' : 'users'}
                </span>
            </div>

            {/* Permission Chips */}
            <div className="flex flex-wrap gap-1.5 mb-4 min-h-[56px]">
                {enabledPages.slice(0, 4).map(page => (
                    <span
                        key={page.id}
                        className={`text-xs font-medium px-2.5 py-1 rounded-lg ${colorClasses.bg} ${colorClasses.text}`}
                    >
                        {page.name}
                    </span>
                ))}
                {enabledPages.length > 4 && (
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 px-2.5 py-1">
                        +{enabledPages.length - 4} more
                    </span>
                )}
            </div>

            {/* Edit Button */}
            <button
                onClick={onEdit}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-xl transition-colors group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40"
            >
                Edit Access
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
        </div>
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
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
                            <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalRoles}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Active Roles</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                            <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalUsers}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Team Members</p>
                        </div>
                    </div>
                </div>

                {/* Roles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredRoles.map(role => (
                        <RoleCard
                            key={role.id}
                            role={role}
                            onEdit={() => setEditingRole(role)}
                        />
                    ))}
                </div>

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
