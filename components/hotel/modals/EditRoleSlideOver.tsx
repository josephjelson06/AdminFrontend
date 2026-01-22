'use client';

import { useState, useEffect } from 'react';
import { Save, Shield, Check } from 'lucide-react';
import { SlideOver } from '@/components/shared/ui/SlideOver';
import { HotelRoleDefinition, HotelPageAccess, ROLE_ICON_COLORS } from '@/lib/hotel/rbac-data';

interface EditRoleSlideOverProps {
    isOpen: boolean;
    onClose: () => void;
    role: HotelRoleDefinition | null;
    onSave: (roleId: string, pageAccess: HotelPageAccess[]) => void;
}

export function EditRoleSlideOver({ isOpen, onClose, role, onSave }: EditRoleSlideOverProps) {
    const [pageAccess, setPageAccess] = useState<HotelPageAccess[]>([]);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        if (role) {
            setPageAccess(role.pageAccess.map(p => ({ ...p })));
            setHasChanges(false);
        }
    }, [role]);

    const handleToggle = (pageId: string) => {
        setPageAccess(prev =>
            prev.map(page =>
                page.id === pageId ? { ...page, enabled: !page.enabled } : page
            )
        );
        setHasChanges(true);
    };

    const handleSave = () => {
        if (role) {
            onSave(role.id, pageAccess);
        }
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
            <div className="flex flex-col h-full">
                {/* Role Info Header */}
                <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl mb-4">
                    <div className={`p-2.5 rounded-xl ${ROLE_ICON_COLORS[role.color]}`}>
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">{role.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {enabledCount} of {pageAccess.length} pages enabled
                        </p>
                    </div>
                </div>

                {/* Permission Toggles */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                    {pageAccess.map((page) => (
                        <label
                            key={page.id}
                            className={`flex items-center justify-between p-3.5 border rounded-xl cursor-pointer transition-all ${page.enabled
                                    ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800'
                                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                }`}
                        >
                            <div className="flex-1 mr-3">
                                <span className={`block text-sm font-medium ${page.enabled
                                        ? 'text-indigo-900 dark:text-indigo-200'
                                        : 'text-slate-900 dark:text-white'
                                    }`}>
                                    {page.name}
                                </span>
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                    {page.description}
                                </span>
                            </div>

                            {/* Custom Toggle Switch */}
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={page.enabled}
                                    onChange={() => handleToggle(page.id)}
                                    className="sr-only peer"
                                />
                                <div className={`w-11 h-6 rounded-full transition-colors ${page.enabled
                                        ? 'bg-indigo-600'
                                        : 'bg-slate-300 dark:bg-slate-600'
                                    }`}>
                                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform flex items-center justify-center ${page.enabled ? 'translate-x-5' : 'translate-x-0'
                                        }`}>
                                        {page.enabled && (
                                            <Check className="w-3 h-3 text-indigo-600" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </label>
                    ))}
                </div>

                {/* Footer Actions */}
                <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!hasChanges}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all ${hasChanges
                                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25'
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                                }`}
                        >
                            <Save className="w-4 h-4" />
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </SlideOver>
    );
}
