'use client';

import { useState } from 'react';
import {
    UserPlus,
    MoreHorizontal,
    Edit2,
    Key,
    Trash2,
    Clock,
    Mail,
    Search,
} from 'lucide-react';
import { MOCK_USERS, MOCK_ROLES, getRoleName, SystemUser } from '@/lib/admin/rbac-data';
import { DataTable, Column, TableBadge } from '@/components/shared/ui/DataTable';
import { Dropdown, DropdownItem } from '@/components/shared/ui/Dropdown';
import { AddUserSlideOver } from '@/components/admin/modals/AddUserSlideOver';
import { ConfirmModal } from '@/components/admin/modals/ConfirmModal';
import { useToast } from '@/components/shared/ui/Toast';

function StatusBadge({ status }: { status: string }) {
    const variant = status === 'active' ? 'success' : status === 'invited' ? 'warning' : 'default';
    return <TableBadge variant={variant}>{status}</TableBadge>;
}

export default function UsersPage() {
    const { addToast } = useToast();
    const [showAddUser, setShowAddUser] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);

    const handleDelete = () => {
        addToast('success', 'User Deleted', `"${selectedUser?.username}" has been removed.`);
        setShowDeleteModal(false);
        setSelectedUser(null);
    };

    const handleExport = (format: 'pdf' | 'excel') => {
        addToast('info', 'Export Started', `Exporting users to ${format.toUpperCase()}...`);
    };

    // Define columns for DataTable
    const columns: Column<SystemUser>[] = [
        {
            id: 'index',
            header: '#',
            accessor: (row) => {
                const index = MOCK_USERS.findIndex((u) => u.id === row.id);
                return <span className="text-sm text-slate-500 dark:text-slate-400">{index + 1}</span>;
            },
            className: 'w-12',
        },
        {
            id: 'user',
            header: 'User',
            accessor: (user) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                            {user.username.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">
                            {user.username}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 md:hidden flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            id: 'email',
            header: 'Email',
            accessor: (user) => (
                <span className="text-sm text-slate-600 dark:text-slate-400">
                    {user.email}
                </span>
            ),
            hideOnMobile: true,
        },
        {
            id: 'role',
            header: 'Role',
            accessor: (user) => (
                <TableBadge>{getRoleName(user.roleId)}</TableBadge>
            ),
        },
        {
            id: 'status',
            header: 'Status',
            accessor: (user) => <StatusBadge status={user.status} />,
            hideOnMobile: true,
        },
        {
            id: 'lastLogin',
            header: 'Last Login',
            accessor: (user) => (
                <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {user.lastLogin || 'Never'}
                </span>
            ),
            hideOnMobile: true,
        },
        {
            id: 'actions',
            header: 'Actions',
            accessor: (user) => (
                <div className="flex justify-end">
                    <Dropdown
                        trigger={
                            <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md">
                                <MoreHorizontal className="w-4 h-4 text-slate-500" />
                            </button>
                        }
                        align="right"
                    >
                        <DropdownItem onClick={() => addToast('info', 'Edit User', 'Edit feature coming soon')}>
                            <Edit2 className="w-4 h-4" />
                            Edit User
                        </DropdownItem>
                        <DropdownItem onClick={() => addToast('info', 'Reset Password', 'Password reset email sent')}>
                            <Key className="w-4 h-4" />
                            Reset Password
                        </DropdownItem>
                        <DropdownItem
                            onClick={() => {
                                setSelectedUser(user);
                                setShowDeleteModal(true);
                            }}
                            className="text-rose-600 dark:text-rose-400"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete User
                        </DropdownItem>
                    </Dropdown>
                </div>
            ),
            className: 'w-24 text-right',
        },
    ];

    return (
        <div className="p-4 sm:p-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Team & Users</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Manage user accounts and access
                    </p>
                </div>
                <button
                    onClick={() => setShowAddUser(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-medium rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
                >
                    <UserPlus className="w-4 h-4" />
                    Add User
                </button>
            </div>

            {/* Data Table */}
            <DataTable
                data={MOCK_USERS}
                columns={columns}
                searchPlaceholder="Search by name or email..."
                searchKeys={['username', 'email'] as (keyof SystemUser)[]}
                showExport={true}
                onExport={handleExport}
                getRowKey={(user) => user.id}
                emptyIcon={<Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />}
                emptyTitle="No users found"
                emptyDescription="Try adjusting your search or filters"
            />

            {/* Add User SlideOver */}
            <AddUserSlideOver
                isOpen={showAddUser}
                onClose={() => setShowAddUser(false)}
            />

            {/* Delete Confirmation */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedUser(null);
                }}
                onConfirm={handleDelete}
                title="Delete User"
                message={`Are you sure you want to delete "${selectedUser?.username}"? This action cannot be undone.`}
                confirmText="Delete"
                variant="danger"
            />
        </div>
    );
}
