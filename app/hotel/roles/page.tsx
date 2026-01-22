'use client';

import { useState } from 'react';
import {
    Plus,
    Edit2,
    Building2,
    ChevronRight,
    Shield,
} from 'lucide-react';
import { HotelLayout } from '@/components/hotel/layout/HotelLayout';
import { Breadcrumbs } from '@/components/shared/ui/Breadcrumbs';
import { MOCK_HOTEL_ROLES, HotelRoleDefinition, HotelPageAccess } from '@/lib/admin/rbac-data';
import { useToast } from '@/components/shared/ui/Toast';
import { EditRoleSlideOver } from '@/components/admin/modals/EditRoleSlideOver';

// Color mapping for hotel roles (including orange for Maintenance Staff)
const ROLE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-700 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-800' },
    blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
    amber: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' },
    emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
    orange: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800' },
};

// Hotel Role Card Component
function HotelRoleCard({
    role,
    onEdit,
}: {
    role: HotelRoleDefinition;
    onEdit: () => void;
}) {
    const colors = ROLE_COLORS[role.color] || ROLE_COLORS.indigo;
    const enabledPages = role.pageAccess.filter(p => p.enabled);

    return (
        <div className={`bg-white dark:bg-slate-800 rounded-xl border ${colors.border} p-5 hover:shadow-lg transition-all group`}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${colors.bg}`}>
                        <Building2 className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">{role.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{role.userCount} users</p>
                    </div>
                </div>
                <button
                    onClick={onEdit}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <Edit2 className="w-4 h-4 text-slate-500" />
                </button>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                {role.description}
            </p>

            {/* Page Access Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
                {enabledPages.slice(0, 4).map(page => (
                    <span
                        key={page.id}
                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${colors.bg} ${colors.text}`}
                    >
                        {page.name}
                    </span>
                ))}
                {enabledPages.length > 4 && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                        +{enabledPages.length - 4} more
                    </span>
                )}
            </div>

            <button
                onClick={onEdit}
                className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
            >
                Edit Page Access
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}

export default function HotelRolesPage() {
    const { addToast } = useToast();

    // State for roles (local copy for editing)
    const [roles, setRoles] = useState<HotelRoleDefinition[]>(MOCK_HOTEL_ROLES);

    // State for edit modal
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<HotelRoleDefinition | null>(null);

    const handleEditRole = (role: HotelRoleDefinition) => {
        setSelectedRole(role);
        setEditModalOpen(true);
    };

    const handleSaveRole = (roleId: string, pageAccess: HotelPageAccess[]) => {
        setRoles(prev =>
            prev.map(role =>
                role.id === roleId
                    ? { ...role, pageAccess, updatedAt: new Date().toISOString().split('T')[0] }
                    : role
            )
        );
    };

    return (
        <HotelLayout>
            <div className="max-w-6xl mx-auto">
                {/* Breadcrumbs */}
                <Breadcrumbs
                    items={[
                        { label: 'Home', href: '/hotel' },
                        { label: 'Roles & Access' },
                    ]}
                />

                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Roles & Access</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Manage staff roles and page permissions for your hotel
                        </p>
                    </div>
                    <button
                        onClick={() => addToast('info', 'Add Role', 'Create new role functionality coming soon.')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        Add Role
                    </button>
                </div>

                {/* Section Header */}
                <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-5 h-5 text-slate-400" />
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Hotel Roles</h2>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                    Define which pages each staff role can access in the Hotel Panel.
                </p>

                {/* Roles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {roles.map((role) => (
                        <HotelRoleCard
                            key={role.id}
                            role={role}
                            onEdit={() => handleEditRole(role)}
                        />
                    ))}
                </div>
            </div>

            {/* Edit Role SlideOver */}
            <EditRoleSlideOver
                isOpen={editModalOpen}
                onClose={() => {
                    setEditModalOpen(false);
                    setSelectedRole(null);
                }}
                role={selectedRole}
                onSave={handleSaveRole}
            />
        </HotelLayout>
    );
}



