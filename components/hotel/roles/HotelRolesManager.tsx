'use client';

import { useState } from 'react';
import { Plus, Search, Shield, Loader2 } from 'lucide-react';
import { useHotelRoles } from './useHotelRoles';
import { HotelRoleCard } from './HotelRoleCard';
import { AddRoleModal } from './AddRoleModal';
import { EditRoleModal } from './EditRoleModal';
import { PaginationBar } from '@/components/shared/ui/Pagination';
import type { HotelRole } from './types';

export function HotelRolesManager() {
    const {
        roles,
        totalItems,
        totalPages,
        currentPage,
        setCurrentPage,
        rowsPerPage,
        setRowsPerPage,
        filters,
        setFilters,
        isLoading,
        addRole,
        updateRole,
        deleteRole
    } = useHotelRoles();

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<HotelRole | null>(null);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({ ...filters, search: e.target.value });
        setCurrentPage(1);
    };

    const handleEdit = (role: HotelRole) => {
        setEditingRole(role);
    };

    const handleDelete = async (role: HotelRole) => {
        if (confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
            await deleteRole(role.id);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
             {/* Header */}
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Shield className="w-6 h-6 text-blue-400" />
                        Roles & Permissions
                    </h1>
                    <p className="text-slate-400 mt-1">Manage access control for your hotel team</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-lg shadow-blue-500/20"
                >
                    <Plus className="w-5 h-5" />
                    Create New Role
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search roles..."
                        value={filters.search || ''}
                        onChange={handleSearch}
                        className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 transition-colors"
                    />
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
            ) : roles.length === 0 ? (
                <div className="text-center py-20 bg-white/5 border border-white/5 rounded-xl">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-8 h-8 text-slate-500" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">No roles found</h3>
                    <p className="text-slate-400 max-w-sm mx-auto mb-6">
                        Get started by creating a new role for your hotel staff.
                    </p>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                    >
                        Create Your First Role
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {roles.map(role => (
                        <HotelRoleCard
                            key={role.id}
                            role={role}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {!isLoading && roles.length > 0 && (
                <PaginationBar
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    pageSize={rowsPerPage}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={setRowsPerPage}
                />
            )}

            {/* Modals */}
            <AddRoleModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={addRole}
            />

            <EditRoleModal
                isOpen={!!editingRole}
                role={editingRole}
                onClose={() => setEditingRole(null)}
                onSave={updateRole}
            />
        </div>
    );
}
