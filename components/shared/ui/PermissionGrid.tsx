'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Check, Minus } from 'lucide-react';
import { PermissionCategory, ModulePermission } from '@/lib/admin/rbac-data';

interface PermissionGridProps {
    categories: PermissionCategory[];
    permissions: Record<string, ModulePermission>;
    onChange: (moduleId: string, permission: keyof ModulePermission, value: boolean) => void;
    onSelectAll: (moduleId: string, value: boolean) => void;
    disabled?: boolean;
}

export function PermissionGrid({
    categories,
    permissions,
    onChange,
    onSelectAll,
    disabled,
}: PermissionGridProps) {
    const [expandedCategories, setExpandedCategories] = useState<string[]>(
        categories.map(c => c.id)
    );

    const toggleCategory = (categoryId: string) => {
        setExpandedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const isAllSelected = (moduleId: string): boolean => {
        const perm = permissions[moduleId];
        if (!perm) return false;
        return perm.view && perm.add && perm.edit && perm.delete;
    };

    const isPartialSelected = (moduleId: string): boolean => {
        const perm = permissions[moduleId];
        if (!perm) return false;
        const values = [perm.view, perm.add, perm.edit, perm.delete];
        const trueCount = values.filter(Boolean).length;
        return trueCount > 0 && trueCount < 4;
    };

    return (
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
            {categories.map((category) => {
                const isExpanded = expandedCategories.includes(category.id);

                return (
                    <div key={category.id} className="border-b border-slate-200 dark:border-slate-700 last:border-b-0">
                        {/* Category Header */}
                        <button
                            type="button"
                            onClick={() => toggleCategory(category.id)}
                            className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                {isExpanded ? (
                                    <ChevronDown className="w-4 h-4 text-slate-500" />
                                ) : (
                                    <ChevronRight className="w-4 h-4 text-slate-500" />
                                )}
                                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                    {category.name}
                                </span>
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                    ({category.modules.length} modules)
                                </span>
                            </div>
                        </button>

                        {/* Category Content */}
                        {isExpanded && (
                            <div>
                                {/* Column Headers */}
                                <div className="grid grid-cols-6 gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                                    <div className="col-span-2">Module</div>
                                    <div className="text-center">Select All</div>
                                    <div className="text-center">View</div>
                                    <div className="text-center">Add</div>
                                    <div className="text-center">Edit</div>
                                </div>

                                {/* Module Rows */}
                                {category.modules.map((module) => {
                                    const perm = permissions[module.id] || { view: false, add: false, edit: false, delete: false };
                                    const allSelected = isAllSelected(module.id);
                                    const partialSelected = isPartialSelected(module.id);

                                    return (
                                        <div
                                            key={module.id}
                                            className="grid grid-cols-6 gap-2 px-4 py-3 border-t border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                        >
                                            {/* Module Info */}
                                            <div className="col-span-2">
                                                <div className="text-sm font-medium text-slate-900 dark:text-white">
                                                    {module.name}
                                                </div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                                    {module.description}
                                                </div>
                                            </div>

                                            {/* Select All */}
                                            <div className="flex items-center justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => onSelectAll(module.id, !allSelected)}
                                                    disabled={disabled}
                                                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${allSelected
                                                            ? 'bg-slate-900 dark:bg-slate-100 border-slate-900 dark:border-slate-100'
                                                            : partialSelected
                                                                ? 'bg-slate-400 border-slate-400'
                                                                : 'border-slate-300 dark:border-slate-600 hover:border-slate-400'
                                                        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    {allSelected && <Check className="w-3 h-3 text-white dark:text-slate-900" />}
                                                    {partialSelected && !allSelected && <Minus className="w-3 h-3 text-white" />}
                                                </button>
                                            </div>

                                            {/* View */}
                                            <div className="flex items-center justify-center">
                                                <input
                                                    type="checkbox"
                                                    checked={perm.view}
                                                    onChange={(e) => onChange(module.id, 'view', e.target.checked)}
                                                    disabled={disabled}
                                                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 bg-white dark:bg-slate-700 disabled:opacity-50"
                                                />
                                            </div>

                                            {/* Add */}
                                            <div className="flex items-center justify-center">
                                                <input
                                                    type="checkbox"
                                                    checked={perm.add}
                                                    onChange={(e) => onChange(module.id, 'add', e.target.checked)}
                                                    disabled={disabled}
                                                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-emerald-600 focus:ring-emerald-500 bg-white dark:bg-slate-700 disabled:opacity-50"
                                                />
                                            </div>

                                            {/* Edit */}
                                            <div className="flex items-center justify-center">
                                                <input
                                                    type="checkbox"
                                                    checked={perm.edit}
                                                    onChange={(e) => onChange(module.id, 'edit', e.target.checked)}
                                                    disabled={disabled}
                                                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-amber-600 focus:ring-amber-500 bg-white dark:bg-slate-700 disabled:opacity-50"
                                                />
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Delete column in separate row for mobile */}
                                <div className="hidden sm:grid grid-cols-6 gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400">
                                    <div className="col-span-5"></div>
                                    <div className="text-center uppercase">Delete</div>
                                </div>
                                {category.modules.map((module) => {
                                    const perm = permissions[module.id] || { view: false, add: false, edit: false, delete: false };
                                    return (
                                        <div key={`${module.id}-delete`} className="hidden sm:grid grid-cols-6 gap-2 px-4 py-2 border-t border-slate-100 dark:border-slate-700">
                                            <div className="col-span-5 text-sm text-slate-500 dark:text-slate-400">
                                                {module.name} - Delete Permission
                                            </div>
                                            <div className="flex items-center justify-center">
                                                <input
                                                    type="checkbox"
                                                    checked={perm.delete}
                                                    onChange={(e) => onChange(module.id, 'delete', e.target.checked)}
                                                    disabled={disabled}
                                                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-rose-600 focus:ring-rose-500 bg-white dark:bg-slate-700 disabled:opacity-50"
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
