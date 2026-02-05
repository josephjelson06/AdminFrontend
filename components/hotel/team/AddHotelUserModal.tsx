'use client';

import { useState, useEffect } from 'react';
import { X, Save, User, Mail, Shield, Key, Loader2, AlertCircle } from 'lucide-react';
import { createPortal } from 'react-dom';
import type { HotelRole } from './types';

interface AddHotelUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => Promise<boolean>;
    roles: HotelRole[];
}

export function AddHotelUserModal({ isOpen, onClose, onSave, roles }: AddHotelUserModalProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role_id: '',
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setFormData({
                full_name: '',
                email: '',
                password: '',
                confirmPassword: '',
                role_id: roles.length > 0 ? roles[0].id.toString() : '',
            });
            setError('');
        }
    }, [isOpen, roles]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        const selectedRole = roles.find(r => r.id === parseInt(formData.role_id));
        
        setIsSaving(true);
        const success = await onSave({
            full_name: formData.full_name,
            email: formData.email,
            password: formData.password,
            role_id: parseInt(formData.role_id),
            role: selectedRole?.name || 'Manager', // Fallback, though role_id is primary
        });
        setIsSaving(false);
        if (success) onClose();
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-[#0F172A] border border-white/10 rounded-xl shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-4 border-b border-white/5">
                    <h2 className="text-lg font-semibold text-white">Invite Team Member</h2>
                    <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-sm text-red-400">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-2.5 w-4 h-4 text-white/40" />
                            <input
                                type="text"
                                required
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                placeholder="John Doe"
                                className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 w-4 h-4 text-white/40" />
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="john@hotel.com"
                                className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-1">Role</label>
                        <div className="relative">
                            <Shield className="absolute left-3 top-2.5 w-4 h-4 text-white/40" />
                            <select
                                required
                                value={formData.role_id}
                                onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
                                className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white appearance-none focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                            >
                                <option value="" disabled>Select a role...</option>
                                {roles.map((role) => (
                                    <option key={role.id} value={role.id}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-1">Password</label>
                            <div className="relative">
                                <Key className="absolute left-3 top-2.5 w-4 h-4 text-white/40" />
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-1">Confirm</label>
                            <div className="relative">
                                <Key className="absolute left-3 top-2.5 w-4 h-4 text-white/40" />
                                <input
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Send Invite
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
