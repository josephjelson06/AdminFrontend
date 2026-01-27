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
import { VerticalCutReveal } from '@/components/ui/vertical-cut-reveal';
import { motion, AnimatePresence } from 'framer-motion';

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

// Animation Variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

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
        <div className="p-4 sm:p-6 space-y-6 animate-in fade-in duration-normal">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
                        <CreditCard className="w-6 h-6 text-primary" />
                        <VerticalCutReveal
                            splitBy="words"
                            staggerDuration={0.15}
                            staggerFrom="first"
                            reverse={true}
                            transition={{
                                type: "spring",
                                stiffness: 250,
                                damping: 40,
                            }}
                        >
                            Subscription Plans
                        </VerticalCutReveal>
                    </h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-sm text-muted mt-1"
                    >
                        Manage pricing tiers, entitlements, and features.
                    </motion.p>
                </div>
                {canEdit && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        onClick={() => { setEditingPlan(null); setIsEditorOpen(true); }}
                        className="btn-primary"
                    >
                        <Plus className="w-4 h-4" />
                        Create New Plan
                    </motion.button>
                )}
            </div>

            {/* Plans Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {plans.map((plan) => (
                    <motion.div key={plan.id} variants={itemVariants} className="h-full">
                        <GlassCard
                            className={`relative p-0 flex flex-col h-full ${plan.status === 'archived' ? 'opacity-60 grayscale' : ''}`}
                        >
                            {/* Popular Badge */}
                            {plan.popular && plan.status === 'active' && (
                                <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl shadow-sm z-10">
                                    POPULAR
                                </div>
                            )}

                            {/* Card Header */}
                            <div className="p-6 border-b border-glass">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-primary">{plan.name}</h3>
                                        <div className="mt-2 flex items-baseline gap-1">
                                            <span className="text-3xl font-bold text-primary">
                                                {plan.currency === 'INR' ? '₹' : '$'}{plan.price.toLocaleString()}
                                            </span>
                                            <span className="text-sm text-muted">/{plan.billingCycle}</span>
                                        </div>
                                    </div>
                                    {canEdit && (
                                        <Dropdown
                                            trigger={
                                                <button className="p-1.5 glass-hover rounded-lg transition-all duration-fast">
                                                    <MoreHorizontal className="w-5 h-5 text-muted" />
                                                </button>
                                            }
                                            align="right"
                                        >
                                            <DropdownItem onClick={() => handleEdit(plan)}>
                                                <Edit2 className="w-4 h-4" />
                                                Edit Plan
                                            </DropdownItem>
                                            <DropdownItem onClick={() => handleArchive(plan.id)} className="text-danger">
                                                <Archive className="w-4 h-4" />
                                                Archive
                                            </DropdownItem>
                                        </Dropdown>
                                    )}
                                </div>
                                <p className="text-sm text-muted leading-relaxed">
                                    {plan.description}
                                </p>
                            </div>

                            {/* Limits Grid */}
                            <div className="grid grid-cols-3 divide-x divide-glass border-b border-glass surface-glass-soft">
                                <div className="p-3 text-center">
                                    <Monitor className="w-4 h-4 mx-auto text-muted mb-1" />
                                    <div className="text-sm font-bold text-secondary-text">{plan.limits.kiosks}</div>
                                    <div className="text-[10px] text-muted uppercase tracking-wide">Kiosks</div>
                                </div>
                                <div className="p-3 text-center">
                                    <Users className="w-4 h-4 mx-auto text-muted mb-1" />
                                    <div className="text-sm font-bold text-secondary-text">{plan.limits.users}</div>
                                    <div className="text-[10px] text-muted uppercase tracking-wide">Users</div>
                                </div>
                                <div className="p-3 text-center">
                                    <HardDrive className="w-4 h-4 mx-auto text-muted mb-1" />
                                    <div className="text-sm font-bold text-secondary-text">{plan.limits.storage}</div>
                                    <div className="text-[10px] text-muted uppercase tracking-wide">Storage</div>
                                </div>
                            </div>

                            {/* Features List */}
                            <div className="p-6 flex-1">
                                <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-4">Included Features</h4>
                                <ul className="space-y-3">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-secondary-text">
                                            <div className="mt-0.5 p-0.5 rounded-full bg-success/10 text-success flex-shrink-0">
                                                <Check className="w-3 h-3" />
                                            </div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </GlassCard>
                    </motion.div>
                ))}
            </motion.div>

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
