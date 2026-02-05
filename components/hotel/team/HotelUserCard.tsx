'use client';

/**
 * HotelUserCard Component
 * 
 * Card display for a single hotel team member.
 * Adapted from Admin UserCard for visual consistency.
 */

import {
    Mail,
    MoreVertical,
    Trash2,
    Edit2,
} from 'lucide-react';
import { GlassCard } from '@/components/shared/ui/GlassCard';
import { Dropdown, DropdownItem } from '@/components/shared/ui/Dropdown';
import type { HotelUser } from './types';

interface HotelUserCardProps {
    user: HotelUser;
    onEdit: (user: HotelUser) => void;
    onDelete: (user: HotelUser) => void;
    onToggleStatus: (user: HotelUser) => void;
}

export function HotelUserCard({
    user,
    onEdit,
    onDelete,
    onToggleStatus,
}: HotelUserCardProps) {
    return (
        <GlassCard className="p-4 h-full relative group hover:border-primary/50 transition-all duration-normal ease-smooth">
            <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 pr-4">
                    <p className="text-xs font-medium text-muted uppercase tracking-wide truncate">
                        {user.role}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                        <h3 className="text-lg font-bold text-primary truncate" title={user.full_name}>
                            {user.full_name}
                        </h3>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-muted truncate">
                        <Mail className="w-3 h-3" />
                        <span title={user.email}>{user.email}</span>
                    </div>
                </div>

                <div className="p-2 rounded-lg bg-primary/10 text-primary font-bold text-lg w-10 h-10 flex items-center justify-center shrink-0 transition-transform duration-fast group-hover:scale-105">
                    {user.full_name.charAt(0)}
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-glass pt-3">
                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${user.is_active
                    ? 'bg-success/10 text-success'
                    : 'bg-danger/10 text-danger'
                    }`}>
                    {user.is_active ? 'Active' : 'Suspended'}
                </span>

                <div className="flex items-center gap-2">
                    <div className="-mr-1">
                        <Dropdown
                            trigger={
                                <button className="p-1 glass-hover rounded-lg text-muted transition-all duration-fast">
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            }
                            align="right"
                        >
                            <DropdownItem onClick={() => onEdit(user)}>
                                <Edit2 className="w-4 h-4" /> Edit Role
                            </DropdownItem>
                            <DropdownItem onClick={() => onDelete(user)} className="text-danger">
                                <Trash2 className="w-4 h-4" /> Remove User
                            </DropdownItem>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
}
