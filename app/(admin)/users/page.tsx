'use client';

import { useState } from 'react';
import {
    Users,
    Plus,
    Search,
    MoreVertical,
    Mail,
    Shield,
    Clock,
    Lock,
    Unlock,
    RotateCcw,
    Trash2,
    CheckCircle2
} from 'lucide-react';
import { GlassCard } from '@/components/shared/ui/GlassCard';
import { SearchFilter, FilterChips } from '@/components/shared/ui/Filters';
import { Dropdown, DropdownItem } from '@/components/shared/ui/Dropdown';
import { MOCK_ADMIN_USERS, type AdminUser } from '@/lib/admin/users-data';
import { useToast } from '@/components/shared/ui/Toast';
import { ConfirmModal } from '@/components/admin/modals/ConfirmModal';
// Assuming you reuse the AddUserSlideOver, or we can build a simple one
// import { AddUserSlideOver } from '@/components/admin/modals/AddUserSlideOver';

function UserStatusBadge({ status }: { status: AdminUser['status'] }) {
    const styles = {
        active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        invited: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        suspended: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    };

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-current'}`} />
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}

export default function UsersPage() {
    const { addToast } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<string[]>([]);
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false); // Placeholder for SlideOver

    // Filter Logic
    const filteredUsers = MOCK_ADMIN_USERS.filter(user => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter.length === 0 || roleFilter.includes(user.roleName);
        return matchesSearch && matchesRole;
    });

    const handleAction = (action: string, user: AdminUser) => {
        if (action === 'delete') {
            setSelectedUser(user);
            setShowDeleteModal(true);
            return;
        }

        if (action === 'reset_pwd') {
            addToast('success', 'Email Sent', `Password reset link sent to ${user.email}`);
        } else if (action === 'suspend') {
            addToast('warning', 'User Suspended', `${user.name} has been suspended.`);
        }
    };

    return (
        <div className="p-4 sm:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        Team Management
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Manage internal staff access and security protocols.
                    </p>
                </div>
                <button
                    onClick={() => setShowInviteModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-slate-800 dark:hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                >
                    <Plus className="w-4 h-4" />
                    Invite Member
                </button>
            </div>

            {/* Filters */}
            <GlassCard className="p-4">
                <div className="flex flex-wrap items-center gap-4">
                    <SearchFilter
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search name or email..."
                    />
                    <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
                    <FilterChips
                        label="Role"
                        options={[
                            { value: 'Super Admin', label: 'Super Admin' },
                            { value: 'L1 Support', label: 'Support' },
                            { value: 'Finance Manager', label: 'Finance' },
                        ]}
                        selected={roleFilter}
                        onChange={setRoleFilter}
                    />
                </div>
            </GlassCard>

            {/* Users Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredUsers.map((user) => (
                    <GlassCard key={user.id} className="p-0 flex flex-col group hover:border-emerald-500/30 transition-all">
                        <div className="p-6 flex items-start justify-between">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-lg font-bold text-slate-600 dark:text-slate-300">
                                    {user.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">{user.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Mail className="w-3 h-3 text-slate-400" />
                                        <span className="text-xs text-slate-500 dark:text-slate-400">{user.email}</span>
                                    </div>
                                </div>
                            </div>
                            <Dropdown
                                trigger={
                                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                }
                                align="right"
                            >
                                <DropdownItem onClick={() => handleAction('edit', user)}>Edit Role</DropdownItem>
                                <DropdownItem onClick={() => handleAction('reset_pwd', user)}>
                                    <RotateCcw className="w-4 h-4" /> Reset Password
                                </DropdownItem>
                                <div className="my-1 border-t border-slate-100 dark:border-slate-700" />
                                {user.status === 'active' ? (
                                    <DropdownItem onClick={() => handleAction('suspend', user)} className="text-amber-600">
                                        <Lock className="w-4 h-4" /> Suspend User
                                    </DropdownItem>
                                ) : (
                                    <DropdownItem onClick={() => addToast('success', 'Re-activated', 'User access restored.')} className="text-emerald-600">
                                        <Unlock className="w-4 h-4" /> Activate User
                                    </DropdownItem>
                                )}
                                <DropdownItem onClick={() => handleAction('delete', user)} className="text-rose-600">
                                    <Trash2 className="w-4 h-4" /> Remove User
                                </DropdownItem>
                            </Dropdown>
                        </div>

                        {/* Meta Info */}
                        <div className="px-6 pb-6 space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500 dark:text-slate-400">Role Access</span>
                                <span className="font-medium text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs">
                                    {user.roleName}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500 dark:text-slate-400">Department</span>
                                <span className="text-slate-700 dark:text-slate-300">{user.department}</span>
                            </div>
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                                <UserStatusBadge status={user.status} />
                                <div className="flex items-center gap-1.5 text-xs text-slate-400" title="Last Active">
                                    <Clock className="w-3 h-3" />
                                    {user.lastActive}
                                </div>
                            </div>
                        </div>

                        {/* MFA Indicator */}
                        {user.mfaEnabled && (
                            <div className="absolute top-0 right-0 p-2">
                                <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-1 rounded-full" title="MFA Enabled">
                                    <Shield className="w-3 h-3" />
                                </div>
                            </div>
                        )}
                    </GlassCard>
                ))}
            </div>

            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={() => {
                    addToast('success', 'User Removed', `${selectedUser?.name} has been removed.`);
                    setShowDeleteModal(false);
                }}
                title="Remove Team Member"
                message={`Are you sure you want to remove ${selectedUser?.name}? They will immediately lose access to all admin panels.`}
                confirmText="Remove User"
                variant="danger"
            />
        </div>
    );
}
