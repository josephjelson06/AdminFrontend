'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Save, Loader2, Shield, Mail, User as UserIcon } from 'lucide-react';
import { userService, type AdminUser } from '@/lib/services/userService';
import { useToast } from '@/components/shared/ui/Toast';

const ROLES = [
    { value: 'SUPER_ADMIN', label: 'Super Admin' },
    { value: 'HOTEL_ADMIN', label: 'Hotel Admin' },
];

export default function UserEditPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { addToast } = useToast();
    const { id } = use(params);

    const [user, setUser] = useState<AdminUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('SUPER_ADMIN');
    const [newPassword, setNewPassword] = useState('');

    // Fetch user data on mount
    useEffect(() => {
        async function fetchUser() {
            setIsLoading(true);
            const result = await userService.get(id);
            if (result.success && result.data) {
                setUser(result.data);
                setFullName(result.data.name);
                setEmail(result.data.email);
                setRole(result.data.roleName.toUpperCase().replace(' ', '_'));
            } else {
                addToast('error', 'Error', 'User not found');
                router.push('/users');
            }
            setIsLoading(false);
        }
        fetchUser();
    }, [id, router, addToast]);

    const handleSave = async () => {
        if (!fullName.trim()) {
            addToast('error', 'Validation Error', 'Full name is required.');
            return;
        }

        setIsSaving(true);

        try {
            const updateData: { full_name?: string; email?: string; role?: string; password?: string } = {
                full_name: fullName,
                email: email,
                role: role,
            };

            if (newPassword) {
                updateData.password = newPassword;
            }

            const result = await userService.update(id, updateData);

            if (result.success) {
                addToast('success', 'User Updated', `${fullName} has been updated.`);
                router.push('/users');
            } else {
                addToast('error', 'Error', result.error || 'Failed to update user');
            }
        } catch {
            addToast('error', 'Error', 'An unexpected error occurred');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="p-4 sm:p-6 max-w-2xl animate-in fade-in duration-normal">
            {/* Header */}
            <div className="mb-6">
                <Link
                    href="/users"
                    className="inline-flex items-center gap-1 text-sm text-muted hover:text-secondary-text mb-2"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Users
                </Link>
                <h1 className="text-xl font-semibold text-primary">
                    Edit User
                </h1>
                <p className="text-sm text-muted">
                    Update user details and role assignment
                </p>
            </div>

            {/* Form */}
            <div className="space-y-6">
                {/* User Details */}
                <div className="surface-glass-strong rounded-lg border border-glass p-4 sm:p-6">
                    <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                        <UserIcon className="w-5 h-5" />
                        User Details
                    </h2>

                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-secondary-text mb-1.5">
                                Full Name <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="John Doe"
                                className="input-glass"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary-text mb-1.5">
                                <Mail className="w-4 h-4 inline mr-1" />
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="user@example.com"
                                className="input-glass"
                            />
                        </div>
                    </div>
                </div>

                {/* Role Assignment */}
                <div className="surface-glass-strong rounded-lg border border-glass p-4 sm:p-6">
                    <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Role Assignment
                    </h2>

                    <div>
                        <label className="block text-sm font-medium text-secondary-text mb-1.5">
                            User Role
                        </label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="input-glass"
                        >
                            {ROLES.map((r) => (
                                <option key={r.value} value={r.value}>
                                    {r.label}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-muted mt-2">
                            This determines what permissions the user has in the admin panel.
                        </p>
                    </div>
                </div>

                {/* Password Reset */}
                <div className="surface-glass-strong rounded-lg border border-glass p-4 sm:p-6">
                    <h2 className="text-lg font-semibold text-primary mb-4">
                        Reset Password
                    </h2>

                    <div>
                        <label className="block text-sm font-medium text-secondary-text mb-1.5">
                            New Password (leave blank to keep current)
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="••••••••"
                            className="input-glass"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3">
                    <Link href="/users" className="btn-ghost">
                        Cancel
                    </Link>
                    <button
                        onClick={handleSave}
                        className="btn-primary disabled:opacity-70"
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
