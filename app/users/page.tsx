'use client';

import { useState } from 'react';
import { Users, UserPlus, Mail, Calendar, MoreVertical } from 'lucide-react';
import { AddUserModal } from '@/components/modals/AddUserModal';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';
import { useToast } from '@/components/ui/Toast';

// Mock ATC staff data
const MOCK_USERS = [
    {
        id: 'u-001',
        name: 'Rahul Sharma',
        email: 'rahul@atc.in',
        role: 'Super Admin',
        status: 'active',
        lastLogin: '2026-01-19T10:30:00Z',
    },
    {
        id: 'u-002',
        name: 'Priya Menon',
        email: 'priya@atc.in',
        role: 'Operations',
        status: 'active',
        lastLogin: '2026-01-19T09:15:00Z',
    },
    {
        id: 'u-003',
        name: 'Amit Patel',
        email: 'amit@atc.in',
        role: 'Finance',
        status: 'active',
        lastLogin: '2026-01-18T16:45:00Z',
    },
    {
        id: 'u-004',
        name: 'Sneha Reddy',
        email: 'sneha@atc.in',
        role: 'Support',
        status: 'inactive',
        lastLogin: '2026-01-10T11:00:00Z',
    },
];

function RoleBadge({ role }: { role: string }) {
    const styles: Record<string, string> = {
        'Super Admin': 'bg-purple-100 text-purple-700 border-purple-200',
        'Operations': 'bg-blue-100 text-blue-700 border-blue-200',
        'Finance': 'bg-emerald-100 text-emerald-700 border-emerald-200',
        'Support': 'bg-amber-100 text-amber-700 border-amber-200',
    };

    return (
        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${styles[role] || 'bg-slate-100 text-slate-600'}`}>
            {role}
        </span>
    );
}

export default function UsersPage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        userId: string;
        userName: string;
    }>({ isOpen: false, userId: '', userName: '' });

    const { addToast } = useToast();
    const activeUsers = MOCK_USERS.filter((u) => u.status === 'active').length;

    const handleDeactivate = () => {
        addToast('success', 'User Deactivated', `${confirmModal.userName} has been deactivated.`);
        setConfirmModal({ isOpen: false, userId: '', userName: '' });
    };

    const handleResetPassword = (userName: string) => {
        addToast('info', 'Password Reset', `Password reset email sent to ${userName}.`);
    };

    return (
        <div className="p-6">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900">User Access</h1>
                    <p className="text-sm text-slate-500">Manage ATC staff accounts and permissions</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-sm text-slate-500">
                        <span className="font-medium text-slate-900">{activeUsers}</span> active users
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800 transition-colors"
                    >
                        <UserPlus className="w-4 h-4" />
                        Add User
                    </button>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                User
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                Role
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                Status
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                Last Login
                            </th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {MOCK_USERS.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center">
                                            <span className="text-sm font-medium text-slate-600">
                                                {user.name.split(' ').map(n => n[0]).join('')}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-slate-900">{user.name}</div>
                                            <div className="text-xs text-slate-500 flex items-center gap-1">
                                                <Mail className="w-3 h-3" />
                                                {user.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <RoleBadge role={user.role} />
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`inline-flex items-center gap-1.5 text-sm ${user.status === 'active' ? 'text-emerald-600' : 'text-slate-400'
                                        }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'
                                            }`} />
                                        {user.status === 'active' ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                        {new Date(user.lastLogin).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <Dropdown
                                        trigger={
                                            <button className="p-1.5 hover:bg-slate-100 rounded-md transition-colors">
                                                <MoreVertical className="w-4 h-4 text-slate-400" />
                                            </button>
                                        }
                                        align="right"
                                    >
                                        <DropdownItem onClick={() => addToast('info', 'Edit User', 'Opening edit form...')}>
                                            Edit User
                                        </DropdownItem>
                                        <DropdownItem onClick={() => handleResetPassword(user.name)}>
                                            Reset Password
                                        </DropdownItem>
                                        <DropdownItem
                                            variant="danger"
                                            onClick={() => setConfirmModal({
                                                isOpen: true,
                                                userId: user.id,
                                                userName: user.name,
                                            })}
                                        >
                                            Deactivate
                                        </DropdownItem>
                                    </Dropdown>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add User Modal */}
            <AddUserModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />

            {/* Confirm Deactivate Modal */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, userId: '', userName: '' })}
                onConfirm={handleDeactivate}
                title="Deactivate User"
                message={`Are you sure you want to deactivate ${confirmModal.userName}? They will no longer be able to access the admin panel.`}
                confirmLabel="Deactivate"
                variant="danger"
            />
        </div>
    );
}
