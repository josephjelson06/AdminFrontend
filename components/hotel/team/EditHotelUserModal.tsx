'use client';

import { useState, useEffect } from 'react';
import { X, Save, User, Mail, Shield, Key, Loader2, AlertCircle } from 'lucide-react';
import { createPortal } from 'react-dom';
import type { HotelUser, HotelRole } from './types';

interface EditHotelUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: HotelUser | null;
    onSave: (id: number, data: any) => Promise<boolean>;
    roles: HotelRole[];
}

export function EditHotelUserModal({ isOpen, onClose, user, onSave, roles }: EditHotelUserModalProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        role_id: '',
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.full_name,
                email: user.email,
                password: '',
                role_id: user.role_id?.toString() || user.role || '', // Handle varied API responses
            });
             
             // If role_id is missing but role name exists, try to find ID
             if (!user.role_id && user.role) {
                 const foundRole = roles.find(r => r.name === user.role);
                 if (foundRole) {
                     setFormData(prev => ({ ...prev, role_id: foundRole.id.toString() }));
                 }
             }

            setError('');
        }
    }, [user, roles]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        
        setError('');

        if (formData.password && formData.password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        const selectedRole = roles.find(r => r.id === parseInt(formData.role_id));
        
        setIsSaving(true);
        const updateData: any = {
            full_name: formData.full_name,
            email: formData.email,
            role_id: parseInt(formData.role_id),
            role: selectedRole?.name,
        };
        
        if (formData.password) {
            updateData.password = formData.password;
        }

        const success = await onSave(user.id, updateData);
        setIsSaving(false);
        if (success) onClose();
    };

    if (!isOpen || !user) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-[#0F172A] border border-white/10 rounded-xl shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-4 border-b border-white/5">
                    <h2 className="text-lg font-semibold text-white">Edit Team Member</h2>
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

                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-1">
                            New Password <span className="text-white/30 font-normal">(Optional)</span>
                        </label>
                        <div className="relative">
                            <Key className="absolute left-3 top-2.5 w-4 h-4 text-white/40" />
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Leave blank to keep current"
                                className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                            />
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
                                    Save Changes
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
