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
} from 'lucide-react';
import { MOCK_ROLES, RoleDefinition } from '@/lib/rbac-data';
import { DataTable, Column, TableBadge } from '@/components/ui/DataTable';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { useToast } from '@/components/ui/Toast';

export default function RolesPage() {
    const { addToast } = useToast();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState<RoleDefinition | null>(null);

    const handleDelete = () => {
        addToast('success', 'Role Deleted', `"${selectedRole?.name}" has been deleted.`);
        setShowDeleteModal(false);
        setSelectedRole(null);
    };

    const handleExport = (format: 'pdf' | 'excel') => {
        addToast('info', 'Export Started', `Exporting roles to ${format.toUpperCase()}...`);
    };

    // Define columns for DataTable
    const columns: Column<RoleDefinition>[] = [
        {
            id: 'index',
            header: '#',
            accessor: (_, index) => (
                <span className="text-sm text-slate-500 dark:text-slate-400">{index !== undefined ? index + 1 : ''}</span>
            ),
            className: 'w-12',
        },
        {
            id: 'name',
            header: 'Role Name',
            accessor: (role) => (
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-slate-100 dark:bg-slate-700 rounded">
                        <Shield className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {role.name}
                    </span>
                </div>
            ),
        },
        {
            id: 'description',
            header: 'Description',
            accessor: (role) => (
                <span className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
                    {role.description}
                </span>
            ),
            hideOnMobile: true,
        },
        {
            id: 'users',
            header: 'Users',
            accessor: (role) => (
                <div className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                    <Users className="w-3.5 h-3.5" />
                    {role.userCount}
                </div>
            ),
            className: 'text-center w-24',
        },
        {
            id: 'actions',
            header: 'Actions',
            accessor: (role) => (
                <div className="flex justify-end">
                    <Dropdown
                        trigger={
                            <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md">
                                <MoreHorizontal className="w-4 h-4 text-slate-500" />
                            </button>
                        }
                        align="right"
                    >
                        <DropdownItem onClick={() => window.location.href = `/roles/${role.id}`}>
                            <Edit2 className="w-4 h-4" />
                            Edit Role
                        </DropdownItem>
                        <DropdownItem
                            onClick={() => {
                                setSelectedRole(role);
                                setShowDeleteModal(true);
                            }}
                            className="text-rose-600 dark:text-rose-400"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete Role
                        </DropdownItem>
                    </Dropdown>
                </div>
            ),
            className: 'w-24 text-right',
        },
    ];

    // Custom accessor with index
    const columnsWithIndex: Column<RoleDefinition>[] = columns.map((col) => {
        if (col.id === 'index') {
            return {
                ...col,
                accessor: (row: RoleDefinition) => {
                    const index = MOCK_ROLES.findIndex((r) => r.id === row.id);
                    return <span className="text-sm text-slate-500 dark:text-slate-400">{index + 1}</span>;
                },
            };
        }
        return col;
    });

    return (
        <div className="p-4 sm:p-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Roles & Access</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Manage roles and their permissions
                    </p>
                </div>
                <Link
                    href="/roles/new"
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-medium rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Role
                </Link>
            </div>

            {/* Data Table */}
            <DataTable
                data={MOCK_ROLES}
                columns={columnsWithIndex}
                searchPlaceholder="Search roles..."
                searchKeys={['name', 'description'] as (keyof RoleDefinition)[]}
                showExport={true}
                onExport={handleExport}
                getRowKey={(role) => role.id}
                emptyIcon={<Shield className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />}
                emptyTitle="No roles found"
                emptyDescription="Try adjusting your search"
            />

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
