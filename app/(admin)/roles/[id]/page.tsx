'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Save,
    Shield,
    AlertCircle,
    Users
} from 'lucide-react';
import { GlassCard } from '@/components/shared/ui/GlassCard';
import { PermissionMatrix } from '@/components/admin/roles/PermissionMatrix';
import { useToast } from '@/components/shared/ui/Toast';
import { type RoleFormData } from '@/lib/admin/permission-data';

// Mock existing data fetch
const getMockRole = (id: string): RoleFormData | null => {
    if (id === 'new') return null;
    return {
        name: 'Operations Manager',
        description: 'Oversees daily hotel operations and kiosk status.',
        permissions: {
            hotels: ['view', 'create', 'edit'],
            fleet: ['view', 'edit'], // Can view and edit (reboot), but not delete
            finance: ['view'], // Read only
            users: [], // No access
            settings: [] // No access
        }
    };
};

export default function RoleEditorPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { addToast } = useToast();

    // Unwrap params in Next.js 15
    const { id } = use(params);
    const isNew = id === 'new';

    const initialData = getMockRole(id) || {
        name: '',
        description: '',
        permissions: {}
    };

    const [formData, setFormData] = useState<RoleFormData>(initialData);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        if (!formData.name.trim()) {
            addToast('error', 'Validation Error', 'Role name is required.');
            return;
        }

        setIsSaving(true);

        // Simulate API
        setTimeout(() => {
            setIsSaving(false);
            addToast('success', isNew ? 'Role Created' : 'Role Updated', `${formData.name} permissions saved.`);
            router.push('/roles');
        }, 800);
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

                    {!isNew && (
                        <div className="p-4 bg-warning/10 border border-warning/30 rounded-xl flex gap-3">
                            <AlertCircle className="w-5 h-5 text-warning flex-shrink-0" />
                            <div className="text-xs text-warning">
                                <span className="font-bold block mb-1">Impact Warning</span>
                                Updating this role will immediately affect <strong>12 users</strong> currently assigned to it.
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
