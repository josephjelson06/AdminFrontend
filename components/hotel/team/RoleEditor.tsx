'use client';

import { useState, useEffect } from 'react';
import { Save, Check, ShieldAlert } from 'lucide-react';
import { SlideOver } from '@/components/shared/ui/SlideOver';
import { RoleConfig, HOTEL_MODULES } from '@/lib/hotel/rbac-data';

interface RoleEditorProps {
    isOpen: boolean;
    onClose: () => void;
    role: RoleConfig | null;
    onSave: (roleId: string, newAccess: string[]) => void;
}

export function RoleEditor({ isOpen, onClose, role, onSave }: RoleEditorProps) {
    const [selectedModules, setSelectedModules] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    // Reset state when opening a new role
    useEffect(() => {
        if (role) {
            setSelectedModules(role.access);
        }
    }, [role]);

    const handleToggle = (moduleId: string) => {
        setSelectedModules(prev =>
            prev.includes(moduleId)
                ? prev.filter(id => id !== moduleId)
                : [...prev, moduleId]
        );
    };

    const handleSave = async () => {
        if (!role) return;
        setIsSaving(true);
        // Simulate network delay for realism
        await new Promise(resolve => setTimeout(resolve, 600));
        onSave(role.id, selectedModules);
        setIsSaving(false);
        onClose();
    };

    if (!role) return null;

    return (
        <SlideOver
            isOpen={isOpen}
            onClose={onClose}
            title={`Edit Permissions: ${role.name}`}
            description="Toggle the features this role can access."
            size="md"
        >
            <div className="space-y-6 pb-20">
                {/* Warning Banner */}
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-lg flex gap-3">
                    <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                        Changes will apply to all <strong>{role.userCount} users</strong> assigned to this role immediately.
                    </p>
                </div>

                {/* Toggles Grid */}
                <div className="space-y-3">
                    {HOTEL_MODULES.map((module) => {
                        const isEnabled = selectedModules.includes(module.id);
                        return (
                            <div 
                                key={module.id}
                                onClick={() => handleToggle(module.id)}
                                className={`
                                    flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer select-none
                                    ${isEnabled 
                                        ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800' 
                                        : 'bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700 hover:border-indigo-300'
                                    }
                                `}
                            >
                                <div className={`
                                    w-5 h-5 mt-0.5 rounded border flex items-center justify-center transition-colors
                                    ${isEnabled
                                        ? 'bg-indigo-600 border-indigo-600'
                                        : 'bg-white border-slate-300 dark:bg-slate-700 dark:border-slate-500'
                                    }
                                `}>
                                    {isEnabled && <Check className="w-3.5 h-3.5 text-white" />}
                                </div>
                                <div>
                                    <h4 className={`text-sm font-semibold ${isEnabled ? 'text-indigo-900 dark:text-indigo-300' : 'text-slate-900 dark:text-white'}`}>
                                        {module.label}
                                    </h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        {module.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Footer Action */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSaving ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Saving Changes...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Save Permissions
                        </>
                    )}
                </button>
            </div>
        </SlideOver>
    );
}