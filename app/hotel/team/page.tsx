'use client';

import { useState } from 'react';
import { HotelLayout } from '@/components/hotel/layout/HotelLayout';
import {
    UserPlus,
    MoreHorizontal,
    Edit2,
    Trash2,
    Mail,
    Phone,
    Clock,
    X,
    Check,
    Shield,
    User,
} from 'lucide-react';
import {
    MOCK_HOTEL_TEAM,
    HOTEL_ROLE_LABELS,
    HotelUserRole,
    HotelUser,
} from '@/lib/hotel/hotel-data';
import { Dropdown, DropdownItem } from '@/components/shared/ui/Dropdown';
import { useToast } from '@/components/shared/ui/Toast';
import { ConfirmModal } from '@/components/shared/ui/ConfirmModal';

const ROLE_OPTIONS: { value: HotelUserRole; label: string; description: string; color: string }[] = [
    { value: 'hotel_manager', label: 'Hotel Manager', description: 'Full access to all features', color: 'bg-indigo-500' },
    { value: 'front_desk', label: 'Front Desk', description: 'Dashboard, Guests, Rooms', color: 'bg-blue-500' },
    { value: 'housekeeping', label: 'Housekeeping', description: 'Room status only', color: 'bg-amber-500' },
    { value: 'hotel_finance', label: 'Finance', description: 'Dashboard, Billing', color: 'bg-emerald-500' },
];

function RoleBadge({ role }: { role: HotelUserRole }) {
    const colors: Record<HotelUserRole, string> = {
        hotel_manager: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
        front_desk: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        housekeeping: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        hotel_finance: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        maintenance_staff: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    };

    return (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${colors[role]}`}>
            {HOTEL_ROLE_LABELS[role]}
        </span>
    );
}

// Add Team Member Modal
function AddMemberModal({
    isOpen,
    onClose,
    onAdd,
}: {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (member: Partial<HotelUser>) => void;
}) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState<HotelUserRole>('front_desk');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        onAdd({ name, email, phone, role, status: 'active' });
        setIsSubmitting(false);
        setName('');
        setEmail('');
        setPhone('');
        setRole('front_desk');
        onClose();
    };

    const isValid = name.length > 0 && email.includes('@');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
                            <UserPlus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Add Team Member</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Invite staff to your hotel</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Full Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Rahul Sharma"
                            className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Email Address <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="e.g., rahul@hotel.in"
                            className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="e.g., +91 98765 43210"
                            className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                        />
                    </div>

                    {/* Role Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Role <span className="text-rose-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {ROLE_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setRole(option.value)}
                                    className={`p-3 rounded-xl border-2 text-left transition-all ${role === option.value
                                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                                        : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                                        }`}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className={`w-2 h-2 rounded-full ${option.color}`} />
                                        <span className="text-sm font-medium text-slate-900 dark:text-white">{option.label}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{option.description}</p>
                                    {role === option.value && (
                                        <div className="absolute top-2 right-2 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                                            <Check className="w-3 h-3 text-white" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600">
                        <div className="flex items-start gap-2">
                            <Shield className="w-4 h-4 text-slate-400 mt-0.5" />
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                An invitation email will be sent to the team member. They'll need to set their password on first login.
                            </p>
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="p-5 border-t border-slate-200 dark:border-slate-700 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!isValid || isSubmitting}
                        className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <UserPlus className="w-4 h-4" />
                                Send Invite
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function TeamPage() {
    const { addToast } = useToast();
    const [team, setTeam] = useState(MOCK_HOTEL_TEAM);
    const [showAddModal, setShowAddModal] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<HotelUser | null>(null);

    const handleAddMember = (member: Partial<HotelUser>) => {
        const newMember: HotelUser = {
            id: `hu-${Date.now()}`,
            name: member.name || '',
            email: member.email || '',
            role: member.role || 'front_desk',
            hotelId: 'hotel-001',
            phone: member.phone,
            status: 'active',
            lastLogin: 'Never',
        };
        setTeam(prev => [...prev, newMember]);
        addToast('success', 'Invite Sent', `Invitation sent to ${member.email}`);
    };

    const handleDelete = (member: HotelUser) => {
        setTeam(prev => prev.filter(m => m.id !== member.id));
        addToast('success', 'User Removed', `${member.name} has been removed from the team`);
        setDeleteConfirm(null);
    };

    return (
        <HotelLayout>

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Team Access</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Manage staff accounts and permissions
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none transition-all hover:scale-105 active:scale-95"
                >
                    <UserPlus className="w-4 h-4" />
                    Add Team Member
                </button>
            </div>

            {/* Team Cards (Mobile-friendly) */}
            <div className="space-y-3 sm:hidden">
                {team.map((member, index) => (
                    <div
                        key={member.id}
                        className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 animate-in fade-in slide-in-from-bottom-2"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center">
                                    <span className="text-sm font-semibold text-white">
                                        {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">{member.name}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{member.email}</p>
                                </div>
                            </div>
                            <Dropdown
                                trigger={
                                    <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                                        <MoreHorizontal className="w-4 h-4 text-slate-500" />
                                    </button>
                                }
                                align="right"
                            >
                                <DropdownItem onClick={() => addToast('info', 'Edit', 'Edit feature coming soon')}>
                                    <Edit2 className="w-4 h-4" />
                                    Edit
                                </DropdownItem>
                                <DropdownItem onClick={() => setDeleteConfirm(member)} variant="danger">
                                    <Trash2 className="w-4 h-4" />
                                    Remove
                                </DropdownItem>
                            </Dropdown>
                        </div>
                        <div className="flex items-center justify-between">
                            <RoleBadge role={member.role} />
                            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {member.lastLogin || 'Never'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Team Table (Desktop) */}
            <div className="hidden sm:block bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Team Member
                                </th>
                                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Contact
                                </th>
                                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Last Login
                                </th>
                                <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {team.map((member, index) => (
                                <tr
                                    key={member.id}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors animate-in fade-in"
                                    style={{ animationDelay: `${index * 30}ms` }}
                                >
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center">
                                                <span className="text-sm font-semibold text-white">
                                                    {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                    {member.name}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    {member.status === 'active' ? '● Active' : '○ Inactive'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="space-y-1">
                                            <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                                                <Mail className="w-3.5 h-3.5 text-slate-400" />
                                                {member.email}
                                            </p>
                                            {member.phone && (
                                                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                                                    {member.phone}
                                                </p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <RoleBadge role={member.role} />
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                                            {member.lastLogin || 'Never'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <Dropdown
                                            trigger={
                                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                                    <MoreHorizontal className="w-4 h-4 text-slate-500" />
                                                </button>
                                            }
                                            align="right"
                                        >
                                            <DropdownItem onClick={() => addToast('info', 'Edit', 'Edit feature coming soon')}>
                                                <Edit2 className="w-4 h-4" />
                                                Edit
                                            </DropdownItem>
                                            <DropdownItem onClick={() => setDeleteConfirm(member)} variant="danger">
                                                <Trash2 className="w-4 h-4" />
                                                Remove
                                            </DropdownItem>
                                        </Dropdown>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Role Legend */}
            <div className="mt-6 p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-slate-400" />
                    Role Permissions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {ROLE_OPTIONS.map((role) => (
                        <div key={role.value} className="flex items-start gap-3">
                            <div className={`w-3 h-3 rounded-full ${role.color} mt-1`} />
                            <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">{role.label}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{role.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            {/* Add Member Modal */}
            <AddMemberModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAdd={handleAddMember}
            />

            {/* Delete Confirmation */}
            <ConfirmModal
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
                title="Remove Team Member"
                message={`Are you sure you want to remove ${deleteConfirm?.name}? They will lose access to the hotel panel immediately.`}
                confirmLabel="Remove"
                variant="danger"
            />
        </HotelLayout>
    );
}



