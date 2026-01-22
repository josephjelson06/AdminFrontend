'use client';

import { useState } from 'react';
import { HotelLayout } from '@/components/hotel/layout/HotelLayout';
import { RoleEditor } from '@/components/hotel/team/RoleEditor'; // Update path if needed
import { INITIAL_ROLES, RoleConfig } from '@/lib/hotel/rbac-data';
import {
    UserPlus,
    Users,
    Shield,
    Edit2,
    Check,
    Lock
} from 'lucide-react';

// ... (Keep your existing Imports, RoleBadge, AddMemberModal helper functions here) ...
// NOTE: I am omitting the repeating helpers (AddMemberModal, etc) to save space. 
// KEEP THEM in your file. I will focus on the main TeamPage component logic below.

import { 
  MOCK_HOTEL_TEAM, 
  HotelUser, 
  HotelUserRole,
  HOTEL_ROLE_LABELS 
} from '@/lib/hotel/hotel-data';
import { useToast } from '@/components/shared/ui/Toast';
import { Dropdown, DropdownItem } from '@/components/shared/ui/Dropdown'; // Assuming this exists

export default function TeamPage() {
    const { addToast } = useToast();
    
    // --- State ---
    const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
    
    // Users State
    const [team, setTeam] = useState(MOCK_HOTEL_TEAM);
    const [showAddModal, setShowAddModal] = useState(false);

    // Roles State
    const [roles, setRoles] = useState<RoleConfig[]>(INITIAL_ROLES);
    const [editingRole, setEditingRole] = useState<RoleConfig | null>(null);

    // --- Handlers ---
    const handleSaveRole = (roleId: string, newAccess: string[]) => {
        setRoles(prev => prev.map(r => 
            r.id === roleId ? { ...r, access: newAccess } : r
        ));
        addToast('success', 'Permissions Updated', 'Role access levels have been modified.');
    };

    return (
        <HotelLayout>
            {/* Header with Tabs */}
            <div className="flex flex-col gap-6 mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Team & Access</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Manage staff accounts and role permissions
                        </p>
                    </div>
                    
                    {/* Primary Action Button (Changes based on Tab) */}
                    {activeTab === 'users' ? (
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 dark:shadow-none"
                        >
                            <UserPlus className="w-4 h-4" />
                            Add Team Member
                        </button>
                    ) : (
                        <button
                            onClick={() => addToast('info', 'Enterprise Feature', 'Custom roles are available on the Enterprise plan.')}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            <Lock className="w-4 h-4" />
                            Create Custom Role
                        </button>
                    )}
                </div>

                {/* Tab Switcher */}
                <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`
                            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                            ${activeTab === 'users' 
                                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}
                        `}
                    >
                        <Users className="w-4 h-4" />
                        Team Members
                    </button>
                    <button
                        onClick={() => setActiveTab('roles')}
                        className={`
                            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                            ${activeTab === 'roles' 
                                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}
                        `}
                    >
                        <Shield className="w-4 h-4" />
                        Roles & Permissions
                    </button>
                </div>
            </div>

            {/* TAB CONTENT: USERS */}
            {activeTab === 'users' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                   {/* ... [INSERT YOUR EXISTING TABLE CODE HERE] ... */}
                   {/* For brevity, I am not pasting the entire table code again. 
                       Just paste your existing <div className="hidden sm:block...">...</div> 
                       and Mobile Card code here. */}
                   
                   {/* Placeholder to indicate where code goes */}
                   <div className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-400">
                        <Users className="w-8 h-8 mb-2 opacity-50" />
                        <span>(Existing User Table Component Goes Here)</span>
                   </div>
                </div>
            )}

            {/* TAB CONTENT: ROLES */}
            {activeTab === 'roles' && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {roles.map((role) => (
                        <div 
                            key={role.id} 
                            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex flex-col hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                        {role.name}
                                        {role.isSystem && (
                                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 uppercase tracking-wide">
                                                System
                                            </span>
                                        )}
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 min-h-[40px]">
                                        {role.description}
                                    </p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                                    {role.userCount}
                                </div>
                            </div>

                            {/* Access Tags */}
                            <div className="flex-1">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                    Access ({role.access.length})
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {role.access.slice(0, 5).map(moduleId => (
                                        <span key={moduleId} className="inline-flex items-center px-2 py-1 rounded-md bg-slate-50 dark:bg-slate-700/50 text-xs text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700">
                                            {moduleId.charAt(0).toUpperCase() + moduleId.slice(1)}
                                        </span>
                                    ))}
                                    {role.access.length > 5 && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-50 dark:bg-slate-700/50 text-xs text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700">
                                            +{role.access.length - 5} more
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Action Footer */}
                            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                                <button 
                                    onClick={() => setEditingRole(role)}
                                    className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1.5"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Configure Access
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Editor SlideOver */}
            <RoleEditor 
                isOpen={!!editingRole}
                onClose={() => setEditingRole(null)}
                role={editingRole}
                onSave={handleSaveRole}
            />

            {/* Add Member Modal (Keep existing) */}
            {/* <AddMemberModal ... /> */}
        </HotelLayout>
    );
}