'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Save,
    Shield,
    AlertCircle,
    Users,
    Loader2
} from 'lucide-react';
import { GlassCard } from '@/components/shared/ui/GlassCard';
import { PermissionMatrix } from '@/components/admin/roles/PermissionMatrix';
import { useToast } from '@/components/shared/ui/Toast';
import { rolesService } from '@/lib/services/rolesService';
import { type Action } from '@/lib/admin/permission-data';

interface RoleFormData {
    name: string;
    description: string;
    permissions: Record<string, Action[]>;
    userCount?: number;
    isSystemRole?: boolean;
}

// Convert API permissions format to form format
function apiToFormPermissions(apiPerms: Record<string, Record<string, boolean>>): Record<string, Action[]> {
    const result: Record<string, Action[]> = {};
    for (const [module, perms] of Object.entries(apiPerms)) {
        const actions: Action[] = [];
        if (perms.view) actions.push('view');
        if (perms.create) actions.push('create');
        if (perms.edit) actions.push('edit');
        if (perms.delete) actions.push('delete');
        if (perms.export) actions.push('export');
        result[module] = actions;
    }
    return result;
}

// Convert form permissions format to API format
function formToApiPermissions(formPerms: Record<string, Action[]>): Record<string, Record<string, boolean>> {
    const result: Record<string, Record<string, boolean>> = {};
    for (const [module, actions] of Object.entries(formPerms)) {
        result[module] = {
            view: actions.includes('view'),
            create: actions.includes('create'),
            edit: actions.includes('edit'),
            delete: actions.includes('delete'),
            export: actions.includes('export'),
        };
    }
    return result;
}

export default function RoleEditorPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { addToast } = useToast();

    // Unwrap params in Next.js 15
    const { id } = use(params);
    const isNew = id === 'new';

    const [formData, setFormData] = useState<RoleFormData>({
        name: '',
        description: '',
        permissions: {}
    });
    const [isLoading, setIsLoading] = useState(!isNew);
    const [isSaving, setIsSaving] = useState(false);

    // Fetch role data on mount
    useEffect(() => {
        if (!isNew) {
            setIsLoading(true);
            rolesService.get(id).then(role => {
                if (role) {
                    // Convert permissions from API format
                    const permissions = typeof role.permissions === 'object' 
                        ? apiToFormPermissions(role.permissions as unknown as Record<string, Record<string, boolean>>)
                        : {};
                    
                    setFormData({
                        name: role.name,
                        description: role.description,
                        permissions,
                        userCount: role.userCount,
                    });
                }
                setIsLoading(false);
            });
        }
    }, [id, isNew]);

    const handleSave = async () => {
        if (!formData.name.trim()) {
            addToast('error', 'Validation Error', 'Role name is required.');
            return;
        }

        setIsSaving(true);

        try {
            // Convert permissions to API format
            const apiPermissions = formToApiPermissions(formData.permissions);

            if (isNew) {
                const result = await rolesService.create({
                    name: formData.name,
                    description: formData.description,
                    permissions: apiPermissions as unknown as Record<string, { view: boolean; add: boolean; edit: boolean; delete: boolean }>,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                });
                if (result.success) {
                    addToast('success', 'Role Created', `${formData.name} has been created.`);
                    router.push('/roles');
                } else {
                    addToast('error', 'Error', result.error || 'Failed to create role');
                }
            } else {
                const result = await rolesService.update(id, {
                    name: formData.name,
                    description: formData.description,
                    permissions: apiPermissions as unknown as Record<string, { view: boolean; add: boolean; edit: boolean; delete: boolean }>,
                });
                if (result.success) {
                    addToast('success', 'Role Updated', `${formData.name} permissions saved.`);
                    router.push('/roles');
                } else {
                    addToast('error', 'Error', result.error || 'Failed to update role');
                }
            }
        } catch {
            addToast('error', 'Error', 'An unexpected error occurred');
        } finally {
            setIsSaving(false);
        }
    };

    // Quick Select Presets
    const applyPreset = (type: 'readonly' | 'admin') => {
        if (type === 'readonly') {
            setFormData(prev => ({
                ...prev,
                permissions: {
                    hotels: ['view'],
                    fleet: ['view'],
                    finance: ['view'],
                    users: ['view'],
                    settings: ['view']
                }
            }));
        } else if (type === 'admin') {
            setFormData(prev => ({
                ...prev,
                permissions: {
                    hotels: ['view', 'create', 'edit', 'delete', 'export'],
                    fleet: ['view', 'create', 'edit', 'delete'],
                    finance: ['view', 'create', 'edit', 'export'],
                    users: ['view', 'create', 'edit', 'delete'],
                    settings: ['view', 'edit']
                }
            }));
        }
    };

    if (isLoading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-normal">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 glass-hover rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-muted" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-primary">
                            {isNew ? 'Create New Role' : 'Edit Role'}
                        </h1>
                        <p className="text-sm text-muted">
                            Define access levels and functional permissions.
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => router.back()}
                        className="btn-ghost"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="btn-primary disabled:opacity-70"
                    >
                        {isSaving ? 'Saving...' : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Role
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Meta Data */}
                <div className="space-y-6">
                    <GlassCard className="p-5 space-y-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                            <Shield className="w-4 h-4 text-success" />
                            Role Details
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-muted mb-1">Role Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Support Specialist"
                                className="input-glass"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-muted mb-1">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe the purpose of this role..."
                                rows={4}
                                className="input-glass resize-none"
                            />
                        </div>
                    </GlassCard>

                    <GlassCard className="p-5">
                        <div className="flex items-center gap-2 text-sm font-semibold text-primary mb-4">
                            <Users className="w-4 h-4 text-info" />
                            Quick Templates
                        </div>
                        <div className="space-y-2">
                            <button
                                onClick={() => applyPreset('readonly')}
                                className="w-full text-left px-3 py-2 text-sm rounded-lg glass-hover transition-colors border border-transparent hover:border-glass"
                            >
                                <span className="block font-medium text-secondary-text">Read Only</span>
                                <span className="text-xs text-muted">View access to all modules</span>
                            </button>
                            <button
                                onClick={() => applyPreset('admin')}
                                className="w-full text-left px-3 py-2 text-sm rounded-lg glass-hover transition-colors border border-transparent hover:border-glass"
                            >
                                <span className="block font-medium text-secondary-text">Full Admin</span>
                                <span className="text-xs text-muted">Full access to everything</span>
                            </button>
                        </div>
                    </GlassCard>

                    {!isNew && formData.userCount && formData.userCount > 0 && (
                        <div className="p-4 bg-warning/10 border border-warning/30 rounded-xl flex gap-3">
                            <AlertCircle className="w-5 h-5 text-warning flex-shrink-0" />
                            <div className="text-xs text-warning">
                                <span className="font-bold block mb-1">Impact Warning</span>
                                Updating this role will immediately affect <strong>{formData.userCount} users</strong> currently assigned to it.
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Permission Matrix */}
                <div className="lg:col-span-2">
                    <PermissionMatrix
                        value={formData.permissions}
                        onChange={(perms) => setFormData({ ...formData, permissions: perms })}
                    />
                </div>
            </div>
        </div>
    );
}
