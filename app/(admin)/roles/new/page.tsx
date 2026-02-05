'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Save, X, Loader2 } from 'lucide-react';
import {
    PERMISSION_CATEGORIES,
    createEmptyPermissions,
    ModulePermission,
} from '@/lib/admin/rbac-data';
import { PermissionGrid } from '@/components/shared/ui/PermissionGrid';
import { ConfirmModal } from '@/components/admin/modals/ConfirmModal';
import { useToast } from '@/components/shared/ui/Toast';
import { rolesService } from '@/lib/services/rolesService';

export default function CreateRolePage() {
    const router = useRouter();
    const { addToast } = useToast();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [permissions, setPermissions] = useState<Record<string, ModulePermission>>(
        createEmptyPermissions()
    );
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handlePermissionChange = (moduleId: string, permission: keyof ModulePermission, value: boolean) => {
        setPermissions(prev => ({
            ...prev,
            [moduleId]: {
                ...prev[moduleId],
                [permission]: value,
            },
        }));
        setHasUnsavedChanges(true);
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
        setHasUnsavedChanges(true);
    };

    const handleSave = async () => {
        if (!name.trim()) {
            addToast('error', 'Validation Error', 'Role name is required.');
            return;
        }

        setIsSaving(true);

        try {
            // Convert permissions to API format (add -> create mapping)
            const apiPermissions: Record<string, { view: boolean; add: boolean; edit: boolean; delete: boolean }> = {};
            for (const [moduleId, perms] of Object.entries(permissions)) {
                apiPermissions[moduleId] = {
                    view: perms.view,
                    add: perms.add, // 'add' in UI maps to 'create' concept
                    edit: perms.edit,
                    delete: perms.delete,
                };
            }

            const result = await rolesService.create({
                name,
                description,
                permissions: apiPermissions,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });

            if (result.success) {
                addToast('success', 'Role Created', `"${name}" has been created successfully.`);
                router.push('/roles');
            } else {
                addToast('error', 'Error', result.error || 'Failed to create role');
            }
        } catch {
            addToast('error', 'Error', 'An unexpected error occurred');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (hasUnsavedChanges) {
            setShowConfirmModal(true);
        } else {
            router.push('/roles');
        }
    };

    return (
        <div className="p-4 sm:p-6 max-w-4xl animate-in fade-in duration-normal">
            {/* Header */}
            <div className="mb-6">
                <Link
                    href="/roles"
                    className="inline-flex items-center gap-1 text-sm text-muted hover:text-secondary-text mb-2"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Roles
                </Link>
                <h1 className="text-xl font-semibold text-primary">
                    Create New Role
                </h1>
                <p className="text-sm text-muted">
                    Define role details and set permissions
                </p>
            </div>

            {/* Form */}
            <div className="space-y-6">
                {/* Role Details */}
                <div className="surface-glass-strong rounded-lg border border-glass p-4 sm:p-6">
                    <h2 className="text-lg font-semibold text-primary mb-4">
                        Role Details
                    </h2>

                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-secondary-text mb-1.5">
                                Role Name <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => { setName(e.target.value); setHasUnsavedChanges(true); }}
                                placeholder="e.g., Operations Manager"
                                className="input-glass"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary-text mb-1.5">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => { setDescription(e.target.value); setHasUnsavedChanges(true); }}
                                placeholder="Brief description of this role's purpose..."
                                rows={2}
                                className="input-glass resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Permissions */}
                <div className="surface-glass-strong rounded-lg border border-glass p-4 sm:p-6">
                    <h2 className="text-lg font-semibold text-primary mb-2">
                        Page Permissions
                    </h2>
                    <p className="text-sm text-muted mb-4">
                        Configure access levels for each module. &quot;Select All&quot; toggles all permissions for that row.
                    </p>

                    <PermissionGrid
                        categories={PERMISSION_CATEGORIES}
                        permissions={permissions}
                        onChange={handlePermissionChange}
                        onSelectAll={handleSelectAll}
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3">
                    <button
                        onClick={handleCancel}
                        className="btn-ghost"
                        disabled={isSaving}
                    >
                        <X className="w-4 h-4" />
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="btn-primary disabled:opacity-70"
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Role
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Unsaved Changes Modal */}
            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={() => router.push('/roles')}
                title="Discard Changes"
                message="You have unsaved changes. Are you sure you want to leave?"
                confirmText="Discard"
                variant="warning"
            />
        </div>
    );
}
