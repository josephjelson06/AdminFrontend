'use client';

import { useState, useEffect } from 'react';
import { SlideOver } from '@/components/shared/ui/SlideOver';
import { CreditCard, Check, X, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/components/shared/ui/Toast';

// Define the shape of a Plan
export interface Plan {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    billingCycle: 'monthly' | 'yearly';
    limits: {
        kiosks: number;
        users: number;
        storage: string;
    };
    features: string[];
    status: 'active' | 'archived';
    popular?: boolean;
}

interface PlanEditorProps {
    isOpen: boolean;
    onClose: () => void;
    plan?: Plan | null; // If null, we are creating a new plan
    onSave: (plan: Plan) => void;
}

export function PlanEditorSlideOver({ isOpen, onClose, plan, onSave }: PlanEditorProps) {
    const { addToast } = useToast();
    const [formData, setFormData] = useState<Partial<Plan>>({
        currency: 'INR',
        billingCycle: 'monthly',
        features: ['Basic Reporting', 'Email Support'],
        limits: { kiosks: 5, users: 2, storage: '10GB' },
        status: 'active'
    });
    const [newFeature, setNewFeature] = useState('');

    // Load plan data when editing
    useEffect(() => {
        if (plan) {
            setFormData(JSON.parse(JSON.stringify(plan)));
        } else {
            // Reset for new plan
            setFormData({
                currency: 'INR',
                billingCycle: 'monthly',
                features: ['Basic Reporting', 'Email Support'],
                limits: { kiosks: 5, users: 2, storage: '10GB' },
                status: 'active',
                popular: false
            });
        }
    }, [plan, isOpen]);

    const handleAddFeature = () => {
        if (!newFeature.trim()) return;
        setFormData(prev => ({
            ...prev,
            features: [...(prev.features || []), newFeature.trim()]
        }));
        setNewFeature('');
    };

    const removeFeature = (index: number) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features?.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name || !formData.price) {
            addToast('error', 'Missing Info', 'Please enter a plan name and price.');
            return;
        }

        // Simulate ID generation
        const payload = {
            ...formData,
            id: plan?.id || `plan-${Date.now()}`,
        } as Plan;

        onSave(payload);
        addToast('success', plan ? 'Plan Updated' : 'Plan Created', `${payload.name} has been saved.`);
        onClose();
    };

    return (
        <SlideOver
            isOpen={isOpen}
            onClose={onClose}
            title={plan ? 'Edit Subscription Plan' : 'Create New Plan'}
            description="Configure pricing tiers and entitlements."
        >
            <form onSubmit={handleSubmit} className="space-y-6 pb-20">
                {/* Basic Info */}
                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-emerald-500" />
                        Plan Details
                    </h3>

                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Plan Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name || ''}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Enterprise Gold"
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Description</label>
                            <textarea
                                value={formData.description || ''}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Short description of the plan..."
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 h-20 resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Pricing */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Price</label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={formData.price || ''}
                                onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Currency</label>
                            <select
                                value={formData.currency}
                                onChange={e => setFormData({ ...formData, currency: e.target.value })}
                                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="INR">INR (₹)</option>
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="billing"
                                checked={formData.billingCycle === 'monthly'}
                                onChange={() => setFormData({ ...formData, billingCycle: 'monthly' })}
                                className="text-emerald-500 focus:ring-emerald-500"
                            />
                            <span className="text-sm text-slate-700 dark:text-slate-300">Monthly</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="billing"
                                checked={formData.billingCycle === 'yearly'}
                                onChange={() => setFormData({ ...formData, billingCycle: 'yearly' })}
                                className="text-emerald-500 focus:ring-emerald-500"
                            />
                            <span className="text-sm text-slate-700 dark:text-slate-300">Yearly</span>
                        </label>
                    </div>
                </div>

                {/* Limits */}
                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-slate-900 dark:text-white">Plan Limits</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Max Kiosks</label>
                            <input
                                type="number"
                                value={formData.limits?.kiosks}
                                onChange={e => setFormData({ ...formData, limits: { ...formData.limits!, kiosks: Number(e.target.value) } })}
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Max Users</label>
                            <input
                                type="number"
                                value={formData.limits?.users}
                                onChange={e => setFormData({ ...formData, limits: { ...formData.limits!, users: Number(e.target.value) } })}
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Storage</label>
                            <input
                                type="text"
                                value={formData.limits?.storage}
                                onChange={e => setFormData({ ...formData, limits: { ...formData.limits!, storage: e.target.value } })}
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Features */}
                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-slate-900 dark:text-white">Features List</h3>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newFeature}
                            onChange={e => setNewFeature(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                            placeholder="Add a feature (e.g. '24/7 Support')"
                            className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <button
                            type="button"
                            onClick={handleAddFeature}
                            className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="space-y-2">
                        {formData.features?.map((feature, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg text-sm">
                                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                                    {feature}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => removeFeature(index)}
                                    className="text-slate-400 hover:text-rose-500 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Status Toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">Active Plan</div>
                        <div className="text-xs text-slate-500">Visible to customers during checkout</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={formData.status === 'active'}
                            onChange={e => setFormData({ ...formData, status: e.target.checked ? 'active' : 'archived' })}
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                </div>

                {/* Footer Buttons */}
                <div className="fixed bottom-0 right-0 w-full md:max-w-md p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-3 z-10">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-lg shadow-emerald-500/20 transition-all"
                    >
                        Save Plan
                    </button>
                </div>
            </form>
        </SlideOver>
    );
}
