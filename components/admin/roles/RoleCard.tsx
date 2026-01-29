'use client';

/**
 * RoleCard Component
 * 
 * Individual role card with actions.
 */

import Link from 'next/link';
import { MoreHorizontal, Edit2, Trash2, Shield, ChevronRight } from 'lucide-react';
import { Dropdown, DropdownItem } from '@/components/shared/ui/Dropdown';
import type { RoleDefinition } from '@/lib/admin/rbac-data';

interface RoleCardProps {
    role: RoleDefinition;
    onEdit: () => void;
    onDelete: () => void;
}

export function RoleCard({ role, onEdit, onDelete }: RoleCardProps) {
    const isSuperAdmin = role.name === 'Super Admin';

    return (
        <div className="surface-glass-strong rounded-2xl p-5 hover:shadow-elevated transition-all duration-normal group">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 surface-glass-soft rounded-xl group-hover:bg-primary/10 transition-colors duration-fast">
                        <Shield className="w-5 h-5 text-secondary-text" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-primary">{role.name}</h3>
                        <p className="text-xs text-muted">{role.userCount} users</p>
                    </div>
                </div>
                <Dropdown
                    trigger={
                        <button className="p-1.5 glass-hover rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-fast">
                            <MoreHorizontal className="w-4 h-4 text-muted" />
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
            <p className="text-sm text-secondary-text mb-4 line-clamp-2">
                {role.description}
            </p>
            <Link
                href={`/roles/${role.id}`}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
                View Permissions
                <ChevronRight className="w-4 h-4" />
            </Link>
        </div>
    );
}
