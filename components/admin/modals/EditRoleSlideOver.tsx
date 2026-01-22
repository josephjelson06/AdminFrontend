'use client';

import { useState, useEffect } from 'react';
import { Save, Shield } from 'lucide-react';
import { SlideOver } from '@/components/shared/ui/SlideOver';
import { HotelRoleDefinition, HotelPageAccess, HOTEL_PAGES } from '@/lib/admin/rbac-data';
import { useToast } from '@/components/shared/ui/Toast';

interface EditRoleSlideOverProps {
    isOpen: boolean;
    onClose: () => void;
    role: HotelRoleDefinition | null;
    onSave: (roleId: string, pageAccess: HotelPageAccess[]) => void;
}

export function EditRoleSlideOver({ isOpen, onClose, role, onSave }: EditRoleSlideOverProps) {
    const { addToast } = useToast();
    const [pageAccess, setPageAccess] = useState<HotelPageAccess[]>([]);

    // Initialize page access when role changes
    useEffect(() => {
        if (role) {
            setPageAccess(role.pageAccess.map(p => ({ ...p })));
        }
    }, [role]);

    const handleToggle = (pageId: string) => {
        setPageAccess(prev =>
            prev.map(page =>
                page.id === pageId
                    ? { ...page, enabled: !page.enabled }
                    : page
            )
        );
    };

    const handleSave = () => {
        if (!role) return;

        onSave(role.id, pageAccess);
        addToast('success', 'Role Updated', `Page access for "${role.name}" has been saved.`);
        onClose();
    };

    const enabledCount = pageAccess.filter(p => p.enabled).length;

    if (!role) return null;

    return (
        <SlideOver
            isOpen={isOpen}
            onClose={onClose}
            title={`Edit ${role.name}`}
            description="Configure which pages this role can access"
            size="md"
        >
            <div className="space-y-6">
                {/* Role Info */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        <span className="font-semibold text-slate-900 dark:text-white">{role.name}</span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{role.description}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                        {enabledCount} of {HOTEL_PAGES.length} pages enabled
                    </p>
                </div>

                {/* Page Access List */}
                <div>
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                        Page Access
                    </h3>
                    <div className="space-y-2">
                        {pageAccess.map((page) => (
                            <label
                                key={page.id}
                                className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 cursor-pointer transition-colors"
                            >
                                <div className="flex-1">
                                    <span className="block text-sm font-medium text-slate-900 dark:text-white">
                                        {page.name}
                                    </span>
                                    <span className="block text-xs text-slate-500 dark:text-slate-400">
                                        {page.description}
                                    </span>
                                </div>
                                <div className="relative ml-3">
                                    <input
                                        type="checkbox"
                                        checked={page.enabled}
                                        onChange={() => handleToggle(page.id)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* System Role Warning */}
                {role.isSystemRole && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                        <p className="text-xs text-amber-700 dark:text-amber-400">
                            <strong>Note:</strong> This is a system role. Changes will apply to all hotels using this role.
                        </p>
                    </div>
                )}

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <Save className="w-4 h-4" />
                        Save Changes
                    </button>
                </div>
            </div>
        </SlideOver>
    );
}

