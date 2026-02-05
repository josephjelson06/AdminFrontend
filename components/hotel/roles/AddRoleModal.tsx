'use client';

import { useState } from 'react';
import { X, Save, Shield, Loader2, AlertCircle } from 'lucide-react';
import { createPortal } from 'react-dom';
import { PermissionMatrix } from './PermissionMatrix';
import { DEFAULT_PERMISSIONS, type Action } from '@/lib/hotel/permission-data';

interface AddRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => Promise<boolean>;
}

export function AddRoleModal({ isOpen, onClose, onSave }: AddRoleModalProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [permissions, setPermissions] = useState(DEFAULT_PERMISSIONS);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            setError("Role name is required");
            return;
        }

        setIsSaving(true);
        const success = await onSave({
            name,
            description,
            permissions
        });
        setIsSaving(false);
        
        if (success) {
            setName('');
            setDescription('');
            setPermissions(DEFAULT_PERMISSIONS);
            onClose();
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-4xl bg-[#0F172A] border border-white/10 rounded-xl shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/5 shrink-0">
                    <h2 className="text-lg font-semibold text-white">Create Role</h2>
                    <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    <form id="add-role-form" onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-sm text-red-400">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-1">Role Name</label>
                                <div className="relative">
                                    <Shield className="absolute left-3 top-2.5 w-4 h-4 text-white/40" />
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. Shift Manager"
                                        className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-1">Description</label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Brief description of the role"
                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-3">Permissions</label>
                            <PermissionMatrix 
                                value={permissions} 
                                onChange={setPermissions} 
                            />
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-4 border-t border-white/5 shrink-0 bg-[#0F172A]">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="add-role-form"
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
                                Create Role
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
