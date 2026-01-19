'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Plus,
    MoreHorizontal,
    Edit2,
    Trash2,
    Users,
    Shield,
    Building2,
    Monitor,
    ChevronRight,
} from 'lucide-react';
import { MOCK_ROLES, MOCK_HOTEL_ROLES, RoleDefinition, HotelRoleDefinition } from '@/lib/rbac-data';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { useToast } from '@/components/ui/Toast';

// Color mapping for hotel roles
const ROLE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-700 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-800' },
    blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
    amber: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' },
    emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
};

// ATC Role Card Component
function ATCRoleCard({
    role,
    onEdit,
    onDelete
}: {
    role: RoleDefinition;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const isSuperAdmin = role.name === 'Super Admin';

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-lg transition-all group">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-100 dark:bg-slate-700 rounded-xl group-hover:bg-slate-200 dark:group-hover:bg-slate-600 transition-colors">
                        <Shield className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">{role.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{role.userCount} users</p>
                    </div>
                </div>
                <Dropdown
                    trigger={
                        <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="w-4 h-4 text-slate-500" />
                        </button>
                    }
                    align="right"
                >
                    <DropdownItem onClick={onEdit}>
                        <Edit2 className="w-4 h-4" />
                        Edit Permissions
                    </DropdownItem>
                    {!isSuperAdmin && (
                        <DropdownItem onClick={onDelete} variant="danger">
                            <Trash2 className="w-4 h-4" />
                            Delete Role
                        </DropdownItem>
                    )}
                </Dropdown>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                {role.description}
            </p>
            <Link
                href={`/roles/${role.id}`}
                className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
            >
                View Permissions
                <ChevronRight className="w-4 h-4" />
            </Link>
        </div>
    );
}

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
                        <p className="text-xs text-slate-500 dark:text-slate-400">{role.userCount} users across hotels</p>
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

export default function RolesPage() {
    const { addToast } = useToast();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState<RoleDefinition | null>(null);
    const [activeTab, setActiveTab] = useState<'atc' | 'hotel'>('atc');

    const handleDelete = () => {
        addToast('success', 'Role Deleted', `"${selectedRole?.name}" has been deleted.`);
        setShowDeleteModal(false);
        setSelectedRole(null);
    };

    const handleEditHotelRole = (role: HotelRoleDefinition) => {
        window.location.href = `/roles/hotel/${role.id}`;
    };

    return (
        <div className="p-4 sm:p-6 max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Roles & Access</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Manage system roles and page permissions
                    </p>
                </div>
                <Link
                    href="/roles/new"
                    className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none transition-all"
                >
                    <Plus className="w-4 h-4" />
                    Add Role
                </Link>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab('atc')}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'atc'
                            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                >
                    <Monitor className="w-4 h-4" />
                    ATC Admin Roles
                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-slate-200 dark:bg-slate-600 rounded-full">
                        {MOCK_ROLES.length}
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab('hotel')}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'hotel'
                            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                >
                    <Building2 className="w-4 h-4" />
                    Hotel Roles
                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-slate-200 dark:bg-slate-600 rounded-full">
                        {MOCK_HOTEL_ROLES.length}
                    </span>
                </button>
            </div>

            {/* ATC Roles Section */}
            {activeTab === 'atc' && (
                <div className="animate-in fade-in duration-200">
                    <div className="flex items-center gap-2 mb-4">
                        <Shield className="w-5 h-5 text-slate-400" />
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">ATC Admin Roles</h2>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                        Roles for ATC internal staff managing the super admin panel. Control access to hotels, fleet, finance, and system settings.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {MOCK_ROLES.map((role) => (
                            <ATCRoleCard
                                key={role.id}
                                role={role}
                                onEdit={() => window.location.href = `/roles/${role.id}`}
                                onDelete={() => {
                                    setSelectedRole(role);
                                    setShowDeleteModal(true);
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Hotel Roles Section */}
            {activeTab === 'hotel' && (
                <div className="animate-in fade-in duration-200">
                    <div className="flex items-center gap-2 mb-4">
                        <Building2 className="w-5 h-5 text-slate-400" />
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Hotel Roles</h2>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                        Default roles for hotel staff. Configure which pages each role can access in the Hotel Panel.
                    </p>

                    {/* Info Banner */}
                    <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl">
                        <p className="text-sm text-indigo-700 dark:text-indigo-300">
                            <strong>Note:</strong> These are system-defined roles used across all hotels. Page access changes will apply to all hotels.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {MOCK_HOTEL_ROLES.map((role) => (
                            <HotelRoleCard
                                key={role.id}
                                role={role}
                                onEdit={() => handleEditHotelRole(role)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedRole(null);
                }}
                onConfirm={handleDelete}
                title="Delete Role"
                message={`Are you sure you want to delete "${selectedRole?.name}"? This will affect ${selectedRole?.userCount || 0} users.`}
                confirmText="Delete"
                variant="danger"
            />
        </div>
    );
}
