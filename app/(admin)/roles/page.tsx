'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Plus,
    MoreHorizontal,
    Edit2,
    Trash2,
    Shield,
    ChevronRight,
} from 'lucide-react';
import { MOCK_ROLES, RoleDefinition } from '@/lib/admin/rbac-data';
import { Dropdown, DropdownItem } from '@/components/shared/ui/Dropdown';
import { ConfirmModal } from '@/components/admin/modals/ConfirmModal';
import { useToast } from '@/components/shared/ui/Toast';

// ATC Role Card Component
function ATCRoleCard({
    role,
    onEdit,
    onDelete
}: {
    role: RoleDefinition;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const isSuperAdmin = role.name === 'Super Admin';

    return (
        <div className="surface-glass-strong rounded-2xl p-5 hover:shadow-elevated transition-all duration-normal group">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 surface-glass-soft rounded-xl group-hover:bg-primary/10 transition-colors duration-fast">
                        <Shield className="w-5 h-5 text-secondary-text" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-primary">{role.name}</h3>
                        <p className="text-xs text-muted">{role.userCount} users</p>
                    </div>
                </div>
                <Dropdown
                    trigger={
                        <button className="p-1.5 glass-hover rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-fast">
                            <MoreHorizontal className="w-4 h-4 text-muted" />
                        </button>
                    }
                    align="right"
                >
                    <DropdownItem onClick={onEdit}>
                        <Edit2 className="w-4 h-4" />
                        Edit Permissions
                    </DropdownItem>
                    {!isSuperAdmin && (
                        <DropdownItem onClick={onDelete} variant="danger">
                            <Trash2 className="w-4 h-4" />
                            Delete Role
                        </DropdownItem>
                    )}
                </Dropdown>
            </div>
            <p className="text-sm text-secondary-text mb-4 line-clamp-2">
                {role.description}
            </p>
            <Link
                href={`/roles/${role.id}`}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
                View Permissions
                <ChevronRight className="w-4 h-4" />
            </Link>
        </div>
    );
}

export default function RolesPage() {
    const { addToast } = useToast();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState<RoleDefinition | null>(null);

    const handleDelete = () => {
        addToast('success', 'Role Deleted', `"${selectedRole?.name}" has been deleted.`);
        setShowDeleteModal(false);
        setSelectedRole(null);
    };

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
                <Link
                    href="/roles/new"
                    className="btn-primary"
                >
                    <Plus className="w-4 h-4" />
                    Add Role
                </Link>
            </div>

            {/* Section Header */}
            <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-muted" />
                <h2 className="text-lg font-semibold text-primary">ATC Admin Roles</h2>
                <span className="ml-2 badge-default">
                    {MOCK_ROLES.length} roles
                </span>
            </div>
            <p className="text-sm text-muted mb-6">
                Roles for ATC internal staff managing the super admin panel. Control access to hotels, fleet, finance, and system settings.
            </p>

            {/* Role Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {MOCK_ROLES.map((role) => (
                    <ATCRoleCard
                        key={role.id}
                        role={role}
                        onEdit={() => window.location.href = `/roles/${role.id}`}
                        onDelete={() => {
                            setSelectedRole(role);
                            setShowDeleteModal(true);
                        }}
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
                onConfirm={handleDelete}
                title="Delete Role"
                message={`Are you sure you want to delete "${selectedRole?.name}"? This will affect ${selectedRole?.userCount || 0} users.`}
                confirmText="Delete"
                variant="danger"
            />
        </div>
    );
}
