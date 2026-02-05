'use client';

import { Shield, MoreVertical, Edit2, Trash2, Users, Clock } from 'lucide-react';
import { GlassCard } from '@/components/shared/ui/GlassCard';
import { Dropdown, DropdownItem } from '@/components/shared/ui/Dropdown';
import type { HotelRole } from './types';

interface HotelRoleCardProps {
    role: HotelRole;
    onEdit: (role: HotelRole) => void;
    onDelete: (role: HotelRole) => void;
}

export function HotelRoleCard({ role, onEdit, onDelete }: HotelRoleCardProps) {
    const isSystem = role.is_system_role;

    return (
        <GlassCard className="p-4 h-full relative group hover:border-primary/50 transition-all duration-normal ease-smooth flex flex-col">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                        <div className={`p-2 rounded-lg ${isSystem ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white truncate" title={role.name}>
                                {role.name}
                            </h3>
                            {isSystem && (
                                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                                    System Role
                                </span>
                            )}
                        </div>
                    </div>
                    <p className="text-sm text-slate-400 line-clamp-2 min-h-[2.5em]">
                        {role.description || 'No description provided'}
                    </p>
                </div>

                <div className="-mr-2 -mt-2">
                    <Dropdown
                        trigger={
                            <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
                                <MoreVertical className="w-4 h-4" />
                            </button>
                        }
                        align="right"
                    >
                        <DropdownItem onClick={() => onEdit(role)}>
                            <Edit2 className="w-4 h-4" />
                            {isSystem ? 'View Permissions' : 'Edit Role'}
                        </DropdownItem>
                        {!isSystem && (
                            <DropdownItem onClick={() => onDelete(role)} className="text-red-400 hover:text-red-300">
                                <Trash2 className="w-4 h-4" />
                                Delete Role
                            </DropdownItem>
                        )}
                    </Dropdown>
                </div>
            </div>

            <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5" title="Users with this role">
                    <Users className="w-3.5 h-3.5" />
                    <span>{role.user_count} Users</span>
                </div>
                {role.updated_at && (
                    <div className="flex items-center gap-1.5" title="Last updated">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(role.updated_at).toLocaleDateString()}</span>
                    </div>
                )}
            </div>
        </GlassCard>
    );
}
