'use client';

/**
 * UserCard Component
 * 
 * Card display for a single admin user.
 */

import {
    Mail,
    Clock,
    Shield,
    MoreVertical,
    RotateCcw,
    Lock,
    Unlock,
    Trash2,
} from 'lucide-react';
import { Card } from '@/components/shared/ui/Card';
import { Dropdown, DropdownItem } from '@/components/shared/ui/Dropdown';
import { UserStatusBadge } from './UserStatusBadge';
import type { AdminUser } from '@/lib/admin/users-data';

interface UserCardProps {
    user: AdminUser;
    onEditRole?: (user: AdminUser) => void;
    onResetPassword: (user: AdminUser) => void;
    onSuspend: (user: AdminUser) => void;
    onActivate: (user: AdminUser) => void;
    onDelete: (user: AdminUser) => void;
}

export function UserCard({
    user,
    onEditRole,
    onResetPassword,
    onSuspend,
    onActivate,
    onDelete,
}: UserCardProps) {
    return (
        <Card padding="none" className="flex flex-col group hover:border-primary/30 transition-all duration-normal relative">
            {/* Header */}
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
                    <DropdownItem onClick={() => onEditRole?.(user)}>Edit Role</DropdownItem>
                    <DropdownItem onClick={() => onResetPassword(user)}>
                        <RotateCcw className="w-4 h-4" /> Reset Password
                    </DropdownItem>
                    <div className="my-1 border-t border-glass" />
                    {user.status === 'active' ? (
                        <DropdownItem onClick={() => onSuspend(user)} className="text-warning">
                            <Lock className="w-4 h-4" /> Suspend User
                        </DropdownItem>
                    ) : (
                        <DropdownItem onClick={() => onActivate(user)} className="text-success">
                            <Unlock className="w-4 h-4" /> Activate User
                        </DropdownItem>
                    )}
                    <DropdownItem onClick={() => onDelete(user)} className="text-danger">
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
        </Card>
    );
}
