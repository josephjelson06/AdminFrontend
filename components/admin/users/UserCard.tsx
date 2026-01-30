'use client';

/**
 * UserCard Component
 * 
 * Card display for a single admin user using BaseCard system.
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
import {
    BaseCard,
    CardInfoRow,
} from '@/components/shared/ui/BaseCard';
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
        <BaseCard
            variant="entity"
            header={{
                icon: (
                    <span className="text-lg font-bold text-secondary-text">
                        {user.name.charAt(0)}
                    </span>
                ),
                iconGradient: "from-slate-600 to-slate-700",
                title: user.name,
                subtitle: user.email,
                actionsMenu: (
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
                ),
            }}
            body={
                <div className="space-y-3">
                    <CardInfoRow
                        label="Role Access"
                        value={
                            <span className="font-medium text-primary surface-glass-soft px-2 py-1 rounded text-xs">
                                {user.roleName}
                            </span>
                        }
                    />
                    <CardInfoRow
                        label="Department"
                        value={user.department}
                    />
                </div>
            }
            footer={
                <div className="px-6 pb-6 pt-4 border-t border-glass flex items-center justify-between">
                    <UserStatusBadge status={user.status} />
                    <div className="flex items-center gap-1.5 text-xs text-muted" title="Last Active">
                        <Clock className="w-3 h-3" />
                        {user.lastActive}
                    </div>
                </div>
            }
            accentGradient="from-slate-500 via-gray-500 to-zinc-500"
        >
            {/* MFA Indicator */}
            {user.mfaEnabled && (
                <div className="absolute top-0 right-0 p-2">
                    <div className="bg-success/10 text-success p-1 rounded-full" title="MFA Enabled">
                        <Shield className="w-3 h-3" />
                    </div>
                </div>
            )}
        </BaseCard>
    );
}
