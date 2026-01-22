'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Save, X, Trash2, Users } from 'lucide-react';
import {
    PERMISSION_CATEGORIES,
    MOCK_ROLES,
    ModulePermission,
} from '@/lib/admin/rbac-data';
import { PermissionGrid } from '@/components/shared/ui/PermissionGrid';
import { ConfirmModal } from '@/components/admin/modals/ConfirmModal';
import { useToast } from '@/components/shared/ui/Toast';

interface EditRolePageProps {
    params: Promise<{ id: string }>;
}

export default function EditRolePage({ params }: EditRolePageProps) {
    const { id } = use(params);
    const router = useRouter();
    const { addToast } = useToast();

    // Find the role
    const role = MOCK_ROLES.find(r => r.id === id);

    const [name, setName] = useState(role?.name || '');
    const [description, setDescription] = useState(role?.description || '');
    const [permissions, setPermissions] = useState<Record<string, ModulePermission>>(
        role?.permissions || {}
    );
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    if (!role) {
        return (
            <div className="p-6 text-center">
                <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Role not found</h1>
                <Link href="/roles" className="text-sm text-slate-500 hover:text-slate-700 mt-2 inline-block">
                    ← Back to Roles
                </Link>
            </div>
        );
    }

    const handlePermissionChange = (moduleId: string, permission: keyof ModulePermission, value: boolean) => {
        setPermissions(prev => ({
            ...prev,
            [moduleId]: {
                ...prev[moduleId],
                [permission]: value,
            },
        }));
        setHasChanges(true);
    };

    const handleSelectAll = (moduleId: string, value: boolean) => {
        setPermissions(prev => ({
            ...prev,
            [moduleId]: {
                view: value,
                add: value,
                edit: value,
                delete: value,
            },
        }));
        setHasChanges(true);
    };

    const handleSave = () => {
        if (!name.trim()) {
            addToast('error', 'Validation Error', 'Role name is required.');
            return;
        }
        setShowSaveModal(true);
    };

    const confirmSave = () => {
        addToast('success', 'Role Updated', `"${name}" has been updated successfully.`);
        setShowSaveModal(false);
        setHasChanges(false);
    };

    const handleDelete = () => {
        addToast('success', 'Role Deleted', `"${role.name}" has been deleted.`);
        router.push('/roles');
    };

    const isSuperAdmin = role.id === 'role-001'; // Super Admin role

    return (
        <div className="p-4 sm:p-6 max-w-4xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div>
                    <Link
                        href="/roles"
                        className="inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 mb-2"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Roles
                    </Link>
                    <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
                        Edit Role
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                            {role.userCount} users assigned
                        </span>
                    </div>
                </div>

                {!isSuperAdmin && (
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete Role
                    </button>
                )}
            </div>

            {/* Super Admin Warning */}
            {isSuperAdmin && (
                <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <p className="text-sm text-amber-800 dark:text-amber-300">
                        ⚠️ Super Admin has full system access. Permissions cannot be modified for this role.
                    </p>
                </div>
            )}

            {/* Form */}
            <div className="space-y-6">
                {/* Role Details */}
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 sm:p-6">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                        Role Details
                    </h2>

                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Role Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => { setName(e.target.value); setHasChanges(true); }}
                                disabled={isSuperAdmin}
                                className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => { setDescription(e.target.value); setHasChanges(true); }}
                                disabled={isSuperAdmin}
                                rows={2}
                                className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>

                {/* Permissions */}
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 sm:p-6">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        Page Permissions
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        Configure access levels for each module. "Select All" toggles all permissions for that row.
                    </p>

                    <PermissionGrid
                        categories={PERMISSION_CATEGORIES}
                        permissions={permissions}
                        onChange={handlePermissionChange}
                        onSelectAll={handleSelectAll}
                        disabled={isSuperAdmin}
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3">
                    <Link
                        href="/roles"
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4" />
                        Cancel
                    </Link>
                    <button
                        onClick={handleSave}
                        disabled={!hasChanges || isSuperAdmin}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-medium rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Save className="w-4 h-4" />
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Save Confirmation Modal */}
            <ConfirmModal
                isOpen={showSaveModal}
                onClose={() => setShowSaveModal(false)}
                onConfirm={confirmSave}
                title="Save Changes"
                message={`This will update permissions for ${role.userCount} users assigned to "${name}". Continue?`}
                confirmText="Save Changes"
                variant="warning"
            />

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Delete Role"
                message={`Are you sure you want to delete "${role.name}"? ${role.userCount} users will be affected.`}
                confirmText="Delete"
                variant="danger"
            />
        </div>
    );
}
