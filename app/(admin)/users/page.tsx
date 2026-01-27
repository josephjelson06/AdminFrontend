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
        active: 'badge-success',
        invited: 'badge-warning',
        suspended: 'badge-danger',
    };

    return (
        <span className={`inline-flex items-center gap-1.5 ${styles[status]}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-success animate-pulse' : 'bg-current'}`} />
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
        <div className="p-4 sm:p-6 space-y-6 animate-in fade-in duration-normal">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
                        <Users className="w-6 h-6 text-primary" />
                        Team Management
                    </h1>
                    <p className="text-sm text-muted mt-1">
                        Manage internal staff access and security protocols.
                    </p>
                </div>
                <button
                    onClick={() => setShowInviteModal(true)}
                    className="btn-primary"
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
                    <div className="h-8 w-px bg-glass hidden sm:block" />
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
                    <GlassCard key={user.id} className="p-0 flex flex-col group hover:border-primary/30 transition-all duration-normal">
                        <div className="p-6 flex items-start justify-between">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-2xl surface-glass-soft flex items-center justify-center text-lg font-bold text-secondary-text">
                                    {user.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-primary">{user.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Mail className="w-3 h-3 text-muted" />
                                        <span className="text-xs text-muted">{user.email}</span>
                                    </div>
                                </div>
                            </div>
                            <Dropdown
                                trigger={
                                    <button className="p-2 glass-hover rounded-lg text-muted transition-all duration-fast">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                }
                                align="right"
                            >
                                <DropdownItem onClick={() => handleAction('edit', user)}>Edit Role</DropdownItem>
                                <DropdownItem onClick={() => handleAction('reset_pwd', user)}>
                                    <RotateCcw className="w-4 h-4" /> Reset Password
                                </DropdownItem>
                                <div className="my-1 border-t border-glass" />
                                {user.status === 'active' ? (
                                    <DropdownItem onClick={() => handleAction('suspend', user)} className="text-warning">
                                        <Lock className="w-4 h-4" /> Suspend User
                                    </DropdownItem>
                                ) : (
                                    <DropdownItem onClick={() => addToast('success', 'Re-activated', 'User access restored.')} className="text-success">
                                        <Unlock className="w-4 h-4" /> Activate User
                                    </DropdownItem>
                                )}
                                <DropdownItem onClick={() => handleAction('delete', user)} className="text-danger">
                                    <Trash2 className="w-4 h-4" /> Remove User
                                </DropdownItem>
                            </Dropdown>
                        </div>

                        {/* Meta Info */}
                        <div className="px-6 pb-6 space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted">Role Access</span>
                                <span className="font-medium text-primary surface-glass-soft px-2 py-1 rounded text-xs">
                                    {user.roleName}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted">Department</span>
                                <span className="text-secondary-text">{user.department}</span>
                            </div>
                            <div className="pt-4 border-t border-glass flex items-center justify-between">
                                <UserStatusBadge status={user.status} />
                                <div className="flex items-center gap-1.5 text-xs text-muted" title="Last Active">
                                    <Clock className="w-3 h-3" />
                                    {user.lastActive}
                                </div>
                            </div>
                        </div>

                        {/* MFA Indicator */}
                        {user.mfaEnabled && (
                            <div className="absolute top-0 right-0 p-2">
                                <div className="bg-success/10 text-success p-1 rounded-full" title="MFA Enabled">
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
