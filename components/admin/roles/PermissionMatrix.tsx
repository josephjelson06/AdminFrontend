'use client';

import { Check, X } from 'lucide-react';
import { ADMIN_MODULES, type Action } from '@/lib/admin/permission-data';

interface PermissionMatrixProps {
    value: Record<string, Action[]>;
    onChange: (newValue: Record<string, Action[]>) => void;
    readOnly?: boolean;
}

export function PermissionMatrix({ value, onChange, readOnly = false }: PermissionMatrixProps) {
    const togglePermission = (moduleId: string, action: Action) => {
        if (readOnly) return;

        const currentModulePerms = value[moduleId] || [];
        const hasPermission = currentModulePerms.includes(action);

        let newModulePerms: Action[];

        if (hasPermission) {
            // Remove permission
            newModulePerms = currentModulePerms.filter(p => p !== action);

            // Logic: If you remove 'view', you usually lose everything else
            if (action === 'view') {
                newModulePerms = [];
            }
        } else {
            // Add permission
            newModulePerms = [...currentModulePerms, action];

            // Logic: If you add 'edit', you must have 'view'
            if (action !== 'view' && !currentModulePerms.includes('view')) {
                newModulePerms.push('view');
            }
        }

        onChange({
            ...value,
            [moduleId]: newModulePerms
        });
    };

    const columns: Action[] = ['view', 'create', 'edit', 'delete', 'export'];

    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                            <th className="px-6 py-4 font-medium">Module</th>
                            {columns.map(col => (
                                <th key={col} className="px-6 py-4 font-medium text-center">{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {ADMIN_MODULES.map((module) => (
                            <tr key={module.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-900 dark:text-white">{module.name}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{module.description}</div>
                                </td>
                                {columns.map((action) => {
                                    const isAvailable = module.actions.includes(action);
                                    const isChecked = (value[module.id] || []).includes(action);

                                    if (!isAvailable) {
                                        return (
                                            <td key={action} className="px-6 py-4 text-center">
                                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700" />
                                            </td>
                                        );
                                    }

                                    return (
                                        <td key={action} className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => togglePermission(module.id, action)}
                                                disabled={readOnly}
                                                className={`
                                                    w-6 h-6 rounded-md flex items-center justify-center transition-all mx-auto
                                                    ${isChecked
                                                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-300 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600'
                                                    }
                                                    ${readOnly ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                                                `}
                                            >
                                                {isChecked && <Check className="w-3.5 h-3.5" />}
                                            </button>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
