'use client';

import { useState } from 'react';
import { User, Mail, Lock, Phone, Send } from 'lucide-react';
import { SlideOver } from '@/components/ui/SlideOver';
import { MOCK_ROLES } from '@/lib/rbac-data';
import { useToast } from '@/components/ui/Toast';

interface AddUserSlideOverProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddUserSlideOver({ isOpen, onClose }: AddUserSlideOverProps) {
    const { addToast } = useToast();

    // Form state
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [roleId, setRoleId] = useState('');
    const [sendInvite, setSendInvite] = useState(true);

    const resetForm = () => {
        setUsername('');
        setEmail('');
        setPassword('');
        setPhone('');
        setRoleId('');
        setSendInvite(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate
        if (!username || !email || !roleId) {
            addToast('error', 'Validation Error', 'Please fill in all required fields.');
            return;
        }

        if (!sendInvite && !password) {
            addToast('error', 'Validation Error', 'Password is required if not sending an invite.');
            return;
        }

        // Success
        addToast('success', 'User Created', sendInvite ? `Invitation sent to ${email}` : `User "${username}" created.`);
        onClose();
        resetForm();
    };

    return (
        <SlideOver
            isOpen={isOpen}
            onClose={onClose}
            title="Add New User"
            description="Create a new user account"
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Username */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Username <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="John Doe"
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400"
                            required
                        />
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="user@example.com"
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400"
                            required
                        />
                    </div>
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Phone Number <span className="text-slate-400">(Optional)</span>
                    </label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+91 98765 43210"
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400"
                        />
                    </div>
                </div>

                {/* Role */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Role <span className="text-rose-500">*</span>
                    </label>
                    <select
                        value={roleId}
                        onChange={(e) => setRoleId(e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400"
                        required
                    >
                        <option value="">Select a role...</option>
                        {MOCK_ROLES.map((role) => (
                            <option key={role.id} value={role.id}>
                                {role.name}
                            </option>
                        ))}
                    </select>
                    {roleId && (
                        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                            {MOCK_ROLES.find(r => r.id === roleId)?.description}
                        </p>
                    )}
                </div>

                {/* Send Invite Toggle */}
                <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <input
                        type="checkbox"
                        checked={sendInvite}
                        onChange={(e) => setSendInvite(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Send invitation email
                        </span>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            User will create their own password
                        </p>
                    </div>
                </label>

                {/* Password (only if not sending invite) */}
                {!sendInvite && (
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Password <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400"
                            />
                        </div>
                    </div>
                )}

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-medium rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
                    >
                        <Send className="w-4 h-4" />
                        {sendInvite ? 'Send Invitation' : 'Create User'}
                    </button>
                </div>
            </form>
        </SlideOver>
    );
}
