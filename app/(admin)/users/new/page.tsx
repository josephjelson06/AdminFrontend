'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Save, Loader2, Shield, Mail, User as UserIcon, Lock, Building2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/components/shared/ui/Toast';

interface Role {
    id: number;
    name: string;
    role_type: 'platform' | 'hotel';
    description?: string;
}

interface Hotel {
    id: number;
    name: string;
}

export default function NewUserPage() {
    const router = useRouter();
    const { addToast } = useToast();

    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Data from API
    const [roles, setRoles] = useState<Role[]>([]);
    const [hotels, setHotels] = useState<Hotel[]>([]);

    // Form state
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [roleId, setRoleId] = useState<number | ''>('');
    const [hotelId, setHotelId] = useState<number | ''>('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Derived state
    const selectedRole = roles.find(r => r.id === roleId);
    const isHotelRole = selectedRole?.role_type === 'hotel';

    // Fetch roles and hotels on mount
    useEffect(() => {
        async function fetchData() {
            try {
                const [rolesRes, hotelsRes] = await Promise.all([
                    api.roles.list(),
                    api.hotels.list(),
                ]);

                if (rolesRes.success && Array.isArray(rolesRes.data)) {
                    setRoles(rolesRes.data);
                }
                if (hotelsRes.success && Array.isArray(hotelsRes.data)) {
                    setHotels(hotelsRes.data);
                }
            } catch (err) {
                console.error('Failed to load form data:', err);
                addToast('error', 'Error', 'Failed to load roles and hotels');
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [addToast]);

    // Reset hotel when role type changes
    useEffect(() => {
        if (!isHotelRole) {
            setHotelId('');
        }
    }, [isHotelRole]);

    const handleSave = async () => {
        // Validation
        if (!fullName.trim()) {
            addToast('error', 'Validation Error', 'Full name is required.');
            return;
        }
        if (!email.trim()) {
            addToast('error', 'Validation Error', 'Email is required.');
            return;
        }
        if (!roleId) {
            addToast('error', 'Validation Error', 'Please select a role.');
            return;
        }
        if (isHotelRole && !hotelId) {
            addToast('error', 'Validation Error', 'Please select a hotel for this role.');
            return;
        }
        if (!password) {
            addToast('error', 'Validation Error', 'Password is required.');
            return;
        }
        if (password !== confirmPassword) {
            addToast('error', 'Validation Error', 'Passwords do not match.');
            return;
        }
        if (password.length < 8) {
            addToast('error', 'Validation Error', 'Password must be at least 8 characters.');
            return;
        }

        setIsSaving(true);

        try {
            // Build payload
            const payload = {
                email,
                password,
                full_name: fullName,
                role: selectedRole?.name || 'SuperAdmin', // Legacy field
                role_id: roleId as number,
                hotel_id: isHotelRole ? (hotelId as number) : undefined,
                is_platform_user: !isHotelRole,
                is_active: true,
            };

            const result = await api.users.create(payload);

            if (result.success) {
                addToast('success', 'User Created', `${fullName} has been added.`);
                router.push('/users');
            } else {
                addToast('error', 'Error', 'Failed to create user');
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'An unexpected error occurred';
            addToast('error', 'Error', message);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
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
                    Add New User
                </h1>
                <p className="text-sm text-muted">
                    Create a new team member with role assignment
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
                                Email <span className="text-danger">*</span>
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

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-secondary-text mb-1.5">
                                User Role <span className="text-danger">*</span>
                            </label>
                            <select
                                value={roleId}
                                onChange={(e) => setRoleId(e.target.value ? Number(e.target.value) : '')}
                                className="input-glass"
                            >
                                <option value="">Select a role...</option>
                                <optgroup label="Platform Roles">
                                    {roles.filter(r => r.role_type === 'platform').map((r) => (
                                        <option key={r.id} value={r.id}>
                                            {r.name}
                                        </option>
                                    ))}
                                </optgroup>
                                <optgroup label="Hotel Roles">
                                    {roles.filter(r => r.role_type === 'hotel').map((r) => (
                                        <option key={r.id} value={r.id}>
                                            {r.name}
                                        </option>
                                    ))}
                                </optgroup>
                            </select>
                            {selectedRole?.description && (
                                <p className="text-xs text-muted mt-2">
                                    {selectedRole.description}
                                </p>
                            )}
                        </div>

                        {/* Hotel Selection - only for hotel roles */}
                        {isHotelRole && (
                            <div className="animate-in fade-in duration-200">
                                <label className="block text-sm font-medium text-secondary-text mb-1.5">
                                    <Building2 className="w-4 h-4 inline mr-1" />
                                    Assign to Hotel <span className="text-danger">*</span>
                                </label>
                                <select
                                    value={hotelId}
                                    onChange={(e) => setHotelId(e.target.value ? Number(e.target.value) : '')}
                                    className="input-glass"
                                >
                                    <option value="">Select a hotel...</option>
                                    {hotels.map((h) => (
                                        <option key={h.id} value={h.id}>
                                            {h.name}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-muted mt-2">
                                    This user will only have access to the selected hotel&apos;s data.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Password */}
                <div className="surface-glass-strong rounded-lg border border-glass p-4 sm:p-6">
                    <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                        <Lock className="w-5 h-5" />
                        Password
                    </h2>

                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-secondary-text mb-1.5">
                                Password <span className="text-danger">*</span>
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="input-glass"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary-text mb-1.5">
                                Confirm Password <span className="text-danger">*</span>
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="input-glass"
                            />
                        </div>
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
                                Creating...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Create User
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
