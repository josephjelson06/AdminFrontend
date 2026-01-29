'use client';

/**
 * PlanCard Component
 * 
 * Individual plan card with details and actions.
 */

import { Check, MoreHorizontal, Edit2, Archive, Users, HardDrive, Monitor } from 'lucide-react';
import { GlassCard } from '@/components/shared/ui/GlassCard';
import { Dropdown, DropdownItem } from '@/components/shared/ui/Dropdown';
import type { Plan } from '@/lib/services/planService';

interface PlanCardProps {
    plan: Plan;
    canEdit: boolean;
    onEdit: (plan: Plan) => void;
    onArchive: (id: string) => void;
}

export function PlanCard({ plan, canEdit, onEdit, onArchive }: PlanCardProps) {
    return (
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
                            <DropdownItem onClick={() => onEdit(plan)}>
                                <Edit2 className="w-4 h-4" />
                                Edit Plan
                            </DropdownItem>
                            <DropdownItem onClick={() => onArchive(plan.id)} className="text-danger">
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
    );
}
