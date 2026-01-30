'use client';

/**
 * UserFilters Component
 * 
 * Filter controls for the users list using unified Toolbar.
 */

import { Plus } from 'lucide-react';
import {
    Toolbar,
    ToolbarSearch,
    ToolbarFilterTabs,
} from '@/components/shared/ui/Toolbar';

interface UserFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    role: string;
    onRoleChange: (value: string) => void;
    onInvite: () => void;
}

const roleOptions = [
    { id: '', label: 'All Roles' },
    { id: 'Super Admin', label: 'Super Admin' },
    { id: 'L1 Support', label: 'Support' },
    { id: 'Finance Manager', label: 'Finance' },
];

export function UserFiltersBar({
    search,
    onSearchChange,
    role,
    onRoleChange,
    onInvite,
}: UserFiltersProps) {
    return (
        <Toolbar
            search={
                <ToolbarSearch
                    value={search}
                    onChange={onSearchChange}
                    placeholder="Search name or email..."
                />
            }
            filters={
                <ToolbarFilterTabs
                    tabs={roleOptions}
                    activeTab={role}
                    onTabChange={onRoleChange}
                />
            }
            actions={
                <button onClick={onInvite} className="btn-primary">
                    <Plus className="w-4 h-4" />
                    Invite Member
                </button>
            }
        />
    );
}
