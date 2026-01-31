'use client';

/**
 * RolesList Component
 * 
 * Main roles management component.
 */

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Shield } from 'lucide-react';
import { useRoles } from './useRoles';
import { RoleCard } from './RoleCard';
import { ConfirmModal } from '@/components/admin/modals/ConfirmModal';
import { useToast } from '@/components/shared/ui/Toast';
import type { RoleDefinition } from '@/lib/admin/rbac-data';

export function RolesList() {
    const { addToast } = useToast();
    const { roles, isLoading, deleteRole } = useRoles();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState<RoleDefinition | null>(null);

    const handleDeleteClick = (role: RoleDefinition) => {
        setSelectedRole(role);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedRole) {
            const success = await deleteRole(selectedRole.id);
            if (success) {
                addToast('success', 'Role Deleted', `"${selectedRole.name}" has been deleted.`);
            }
        }
        setShowDeleteModal(false);
        setSelectedRole(null);
    };

    if (isLoading) {
        return (
            <div className="p-4 sm:p-6 flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 max-w-6xl mx-auto animate-in fade-in duration-normal">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-primary">Roles & Access</h1>
                    <p className="text-sm text-muted mt-1">
                        Manage ATC admin roles and permissions
                    </p>
                </div>
                <Link href="/roles/new" className="btn-primary">
                    <Plus className="w-4 h-4" />
                    Add Role
                </Link>
            </div>

            {/* Section Header */}
            <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-muted" />
                <h2 className="text-lg font-semibold text-primary">ATC Admin Roles</h2>
                <span className="ml-2 badge-default">{roles.length} roles</span>
            </div>
            <p className="text-sm text-muted mb-6">
                Roles for ATC internal staff managing the super admin panel. Control access to hotels, fleet, finance, and system settings.
            </p>

            {/* Role Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roles.map((role) => (
                    <RoleCard
                        key={role.id}
                        role={role}
                        onEdit={() => window.location.href = `/roles/${role.id}`}
                        onDelete={() => handleDeleteClick(role)}
                    />
                ))}
            </div>

            {/* Delete Confirmation */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedRole(null);
                }}
                onConfirm={handleConfirmDelete}
                title="Delete Role"
                message={`Are you sure you want to delete "${selectedRole?.name}"? This will affect ${selectedRole?.userCount || 0} users.`}
                confirmText="Delete"
                variant="danger"
            />
        </div>
    );
}
