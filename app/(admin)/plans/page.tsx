'use client';

import { useState } from 'react';
import {
    CreditCard,
    Plus,
    Check,
    MoreHorizontal,
    Edit2,
    Archive,
    Users,
    HardDrive,
    Monitor
} from 'lucide-react';
import { GlassCard } from '@/components/shared/ui/GlassCard';
import { Dropdown, DropdownItem } from '@/components/shared/ui/Dropdown';
import { PlanEditorSlideOver, type Plan } from '@/components/admin/plans/PlanEditorSlideOver';
import { useAuth } from '@/lib/shared/auth';

// Initial Mock Data
const INITIAL_PLANS: Plan[] = [
    {
        id: 'plan-001',
        name: 'Starter',
        description: 'Perfect for small boutique hotels starting with automation.',
        price: 4999,
        currency: 'INR',
        billingCycle: 'monthly',
        limits: { kiosks: 2, users: 3, storage: '10GB' },
        features: ['Basic Kiosk Mode', 'Email Support', '7-Day Data Retention'],
        status: 'active'
    },
    {
        id: 'plan-002',
        name: 'Professional',
        description: 'Advanced features for scaling hotel chains.',
        price: 12999,
        currency: 'INR',
        billingCycle: 'monthly',
        limits: { kiosks: 10, users: 15, storage: '100GB' },
        features: ['Voice AI Enabled', 'Priority 24/7 Support', '90-Day Data Retention', 'Custom Branding'],
        status: 'active',
        popular: true
    },
    {
        id: 'plan-003',
        name: 'Enterprise',
        description: 'Full-scale solution for luxury properties.',
        price: 24999,
        currency: 'INR',
        billingCycle: 'monthly',
        limits: { kiosks: 50, users: 999, storage: 'Unlimited' },
        features: ['Dedicated Account Manager', 'SLA Guarantee', 'Unlimited History', 'API Access', 'On-premise Deployment'],
        status: 'active'
    }
];

export default function PlansPage() {
    const { hasPermission } = useAuth();
    const [plans, setPlans] = useState<Plan[]>(INITIAL_PLANS);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

    const handleSavePlan = (savedPlan: Plan) => {
        if (editingPlan) {
            // Update existing
            setPlans(plans.map(p => p.id === savedPlan.id ? savedPlan : p));
        } else {
            // Create new
            setPlans([...plans, savedPlan]);
        }
        setIsEditorOpen(false);
        setEditingPlan(null);
    };

    const handleEdit = (plan: Plan) => {
        setEditingPlan(plan);
        setIsEditorOpen(true);
    };

    const handleArchive = (id: string) => {
        setPlans(plans.map(p => p.id === id ? { ...p, status: 'archived' } : p));
    };

    const canEdit = hasPermission('finance');

    return (
        <div className="p-4 sm:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <CreditCard className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        Subscription Plans
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Manage pricing tiers, entitlements, and features.
                    </p>
                </div>
                {canEdit && (
                    <button
                        onClick={() => { setEditingPlan(null); setIsEditorOpen(true); }}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-slate-800 dark:hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                    >
                        <Plus className="w-4 h-4" />
                        Create New Plan
                    </button>
                )}
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <GlassCard
                        key={plan.id}
                        className={`relative p-0 flex flex-col h-full ${plan.status === 'archived' ? 'opacity-60 grayscale' : ''}`}
                    >
                        {/* Popular Badge */}
                        {plan.popular && plan.status === 'active' && (
                            <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl shadow-sm z-10">
                                POPULAR
                            </div>
                        )}

                        {/* Card Header */}
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700/50">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                                    <div className="mt-2 flex items-baseline gap-1">
                                        <span className="text-3xl font-bold text-slate-900 dark:text-white">
                                            {plan.currency === 'INR' ? '₹' : '$'}{plan.price.toLocaleString()}
                                        </span>
                                        <span className="text-sm text-slate-500 dark:text-slate-400">/{plan.billingCycle}</span>
                                    </div>
                                </div>
                                {canEdit && (
                                    <Dropdown
                                        trigger={
                                            <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg transition-colors">
                                                <MoreHorizontal className="w-5 h-5 text-slate-400" />
                                            </button>
                                        }
                                        align="right"
                                    >
                                        <DropdownItem onClick={() => handleEdit(plan)}>
                                            <Edit2 className="w-4 h-4" />
                                            Edit Plan
                                        </DropdownItem>
                                        <DropdownItem onClick={() => handleArchive(plan.id)} className="text-rose-600">
                                            <Archive className="w-4 h-4" />
                                            Archive
                                        </DropdownItem>
                                    </Dropdown>
                                )}
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                {plan.description}
                            </p>
                        </div>

                        {/* Limits Grid */}
                        <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-slate-700/50 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/30">
                            <div className="p-3 text-center">
                                <Monitor className="w-4 h-4 mx-auto text-slate-400 mb-1" />
                                <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{plan.limits.kiosks}</div>
                                <div className="text-[10px] text-slate-500 uppercase tracking-wide">Kiosks</div>
                            </div>
                            <div className="p-3 text-center">
                                <Users className="w-4 h-4 mx-auto text-slate-400 mb-1" />
                                <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{plan.limits.users}</div>
                                <div className="text-[10px] text-slate-500 uppercase tracking-wide">Users</div>
                            </div>
                            <div className="p-3 text-center">
                                <HardDrive className="w-4 h-4 mx-auto text-slate-400 mb-1" />
                                <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{plan.limits.storage}</div>
                                <div className="text-[10px] text-slate-500 uppercase tracking-wide">Storage</div>
                            </div>
                        </div>

                        {/* Features List */}
                        <div className="p-6 flex-1">
                            <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Included Features</h4>
                            <ul className="space-y-3">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                                        <div className="mt-0.5 p-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                                            <Check className="w-3 h-3" />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </GlassCard>
                ))}
            </div>

            {/* Editor SlideOver */}
            <PlanEditorSlideOver
                isOpen={isEditorOpen}
                onClose={() => setIsEditorOpen(false)}
                plan={editingPlan}
                onSave={handleSavePlan}
            />
        </div>
    );
}
