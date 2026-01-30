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
    Shield,
    Edit2,
    Lock,
} from 'lucide-react';
import { HotelLayout } from '@/components/hotel/layout/HotelLayout';
import { PaginationBar } from '@/components/shared/ui/Pagination';
import { useHotelTeam } from './useHotelTeam';
import { RoleEditor } from './RoleEditor';
import { useToast } from '@/components/shared/ui/Toast';
import { HOTEL_ROLE_LABELS } from '@/lib/hotel/hotel-data';

export function HotelTeamManager() {
    const { addToast } = useToast();
    const {
        team,
        roles,
        paginatedTeam,
        totalPages,
        currentPage,
        rowsPerPage,
        setCurrentPage,
        setRowsPerPage,
        updateRoleAccess,
        isLoading,
        editingRole,
        setEditingRole,
    } = useHotelTeam();

    const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
    const [showAddModal, setShowAddModal] = useState(false);

    const handleSaveRole = async (roleId: string, access: string[]) => {
        const success = await updateRoleAccess(roleId, access);
        if (success) {
            addToast('success', 'Permissions Updated', 'Role access levels have been modified.');
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
            {/* Header with Tabs */}
            <div className="flex flex-col gap-6 mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Team & Access</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Manage staff accounts and role permissions
                        </p>
                    </div>

                    {/* Primary Action Button */}
                    {activeTab === 'users' ? (
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 dark:shadow-none"
                        >
                            <UserPlus className="w-4 h-4" />
                            Add Team Member
                        </button>
                    ) : (
                        <button
                            onClick={() => addToast('info', 'Enterprise Feature', 'Custom roles are available on the Enterprise plan.')}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            <Lock className="w-4 h-4" />
                            Create Custom Role
                        </button>
                    )}
                </div>

                {/* Tab Switcher */}
                <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`
                            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                            ${activeTab === 'users'
                                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}
                        `}
                    >
                        <Users className="w-4 h-4" />
                        Team Members
                    </button>
                    <button
                        onClick={() => setActiveTab('roles')}
                        className={`
                            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                            ${activeTab === 'roles'
                                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}
                        `}
                    >
                        <Shield className="w-4 h-4" />
                        Roles & Permissions
                    </button>
                </div>
            </div>

            {/* TAB CONTENT: USERS */}
            {activeTab === 'users' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {/* User Table */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:table-cell">
                                        Email
                                    </th>
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {paginatedTeam.map((member) => (
                                    <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <td className="px-5 py-4">
                                            <span className="text-sm font-medium text-slate-900 dark:text-white">
                                                {member.name}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 hidden sm:table-cell">
                                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                                {member.email}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400">
                                                {HOTEL_ROLE_LABELS[member.role] || member.role}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 hidden md:table-cell">
                                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${member.status === 'active'
                                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400'
                                                : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                                                }`}>
                                                {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
            )}

            {/* TAB CONTENT: ROLES */}
            {activeTab === 'roles' && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {roles.map((role) => (
                        <div
                            key={role.id}
                            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex flex-col hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                        {role.name}
                                        {role.isSystem && (
                                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 uppercase tracking-wide">
                                                System
                                            </span>
                                        )}
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 min-h-[40px]">
                                        {role.description}
                                    </p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                                    {role.userCount}
                                </div>
                            </div>

                            {/* Access Tags */}
                            <div className="flex-1">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                    Access ({role.access.length})
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {role.access.slice(0, 5).map(moduleId => (
                                        <span key={moduleId} className="inline-flex items-center px-2 py-1 rounded-md bg-slate-50 dark:bg-slate-700/50 text-xs text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700">
                                            {moduleId.charAt(0).toUpperCase() + moduleId.slice(1)}
                                        </span>
                                    ))}
                                    {role.access.length > 5 && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-50 dark:bg-slate-700/50 text-xs text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700">
                                            +{role.access.length - 5} more
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Action Footer */}
                            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                                <button
                                    onClick={() => setEditingRole(role)}
                                    className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1.5"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Configure Access
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Editor SlideOver */}
            <RoleEditor
                isOpen={!!editingRole}
                onClose={() => setEditingRole(null)}
                role={editingRole}
                onSave={handleSaveRole}
            />
        </HotelLayout>
    );
}
