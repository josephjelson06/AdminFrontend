'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Save, X } from 'lucide-react';
import {
    PERMISSION_CATEGORIES,
    createEmptyPermissions,
    ModulePermission,
} from '@/lib/rbac-data';
import { PermissionGrid } from '@/components/ui/PermissionGrid';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { useToast } from '@/components/ui/Toast';

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

    const handleSave = () => {
        if (!name.trim()) {
            addToast('error', 'Validation Error', 'Role name is required.');
            return;
        }

        // Simulate save
        addToast('success', 'Role Created', `"${name}" has been created successfully.`);
        router.push('/roles');
    };

    const handleCancel = () => {
        if (hasUnsavedChanges) {
            setShowConfirmModal(true);
        } else {
            router.push('/roles');
        }
    };

    return (
        <div className="p-4 sm:p-6 max-w-4xl">
            {/* Header */}
            <div className="mb-6">
                <Link
                    href="/roles"
                    className="inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 mb-2"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Roles
                </Link>
                <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Create New Role
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Define role details and set permissions
                </p>
            </div>

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
                                onChange={(e) => { setName(e.target.value); setHasUnsavedChanges(true); }}
                                placeholder="e.g., Operations Manager"
                                className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => { setDescription(e.target.value); setHasUnsavedChanges(true); }}
                                placeholder="Brief description of this role's purpose..."
                                rows={2}
                                className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 resize-none"
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
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3">
                    <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4" />
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-medium rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
                    >
                        <Save className="w-4 h-4" />
                        Save Role
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
