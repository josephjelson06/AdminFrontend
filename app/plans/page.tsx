'use client';

import { useState } from 'react';
import {
    CreditCard,
    Plus,
    Edit3,
    Archive,
    Check,
    Layers,
    Cpu,
    TrendingUp,
    Calendar,
} from 'lucide-react';
import { MOCK_PLANS, formatPlanPrice } from '@/lib/plans-data';
import type { Plan, PlanStatus, PricingModel } from '@/types/finance';
import { Modal } from '@/components/ui/Modal';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { useToast } from '@/components/ui/Toast';

function StatusBadge({ status }: { status: PlanStatus }) {
    const styles: Record<PlanStatus, string> = {
        active: 'bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
        deprecated: 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:border-slate-600',
    };

    return (
        <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${styles[status]}`}>
            {status}
        </span>
    );
}

function PricingModelBadge({ model }: { model: PricingModel }) {
    const labels: Record<PricingModel, string> = {
        flat: 'Flat Rate',
        'per-unit': 'Per Unit',
        tiered: 'Tiered',
    };

    return (
        <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded text-xs font-medium">
            {labels[model]}
        </span>
    );
}

export default function PlansPage() {
    const { addToast } = useToast();
    const [plans, setPlans] = useState<Plan[]>(MOCK_PLANS);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editPlan, setEditPlan] = useState<Plan | null>(null);
    const [deprecatePlan, setDeprecatePlan] = useState<Plan | null>(null);

    const activePlans = plans.filter(p => p.status === 'active');
    const deprecatedPlans = plans.filter(p => p.status === 'deprecated');

    const handleDeprecate = () => {
        if (deprecatePlan) {
            setPlans(prev => prev.map(p =>
                p.id === deprecatePlan.id ? { ...p, status: 'deprecated' as PlanStatus } : p
            ));
            addToast('warning', 'Plan Deprecated', `${deprecatePlan.name} has been deprecated. Existing subscribers will continue until renewal.`);
            setDeprecatePlan(null);
        }
    };

    return (
        <div className="p-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Subscription Plans</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Define commercial offerings • {activePlans.length} active plans
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-slate-800 dark:hover:bg-emerald-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Create Plan
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                            <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">{activePlans.length}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">Active Plans</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                            <Archive className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">{deprecatedPlans.length}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">Deprecated</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                {formatPlanPrice(Math.min(...activePlans.map(p => p.basePrice)))}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">Starting Price</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <Cpu className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                {Math.max(...activePlans.map(p => p.includedKiosks))}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">Max Kiosks Included</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Plans Table */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-sm font-semibold text-slate-900 dark:text-white">All Plans</h2>
                </div>
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Plan</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Pricing Model</th>
                            <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Base Price</th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Included Kiosks</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Billing Options</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Status</th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {plans.map((plan) => (
                            <tr key={plan.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                {/* Plan Info */}
                                <td className="px-4 py-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center flex-shrink-0">
                                            <CreditCard className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-slate-900 dark:text-white">{plan.name}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-[200px] truncate">
                                                {plan.description}
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                {/* Pricing Model */}
                                <td className="px-4 py-4">
                                    <PricingModelBadge model={plan.pricingModel} />
                                </td>

                                {/* Base Price */}
                                <td className="px-4 py-4 text-right">
                                    <div className="text-sm font-semibold text-slate-900 dark:text-white">
                                        {formatPlanPrice(plan.basePrice)}
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">/month</div>
                                </td>

                                {/* Included Kiosks */}
                                <td className="px-4 py-4 text-center">
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
                                        <Cpu className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                                        <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
                                            {plan.includedKiosks}
                                        </span>
                                    </div>
                                </td>

                                {/* Billing Options */}
                                <td className="px-4 py-4">
                                    <div className="flex flex-wrap gap-1">
                                        {plan.billingFrequency.map(freq => (
                                            <span
                                                key={freq}
                                                className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded text-xs capitalize"
                                            >
                                                {freq}
                                            </span>
                                        ))}
                                    </div>
                                </td>

                                {/* Status */}
                                <td className="px-4 py-4">
                                    <StatusBadge status={plan.status} />
                                </td>

                                {/* Actions */}
                                <td className="px-4 py-4 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                        <button
                                            onClick={() => setEditPlan(plan)}
                                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
                                            title="Edit Plan"
                                        >
                                            <Edit3 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                        </button>
                                        {plan.status === 'active' && (
                                            <button
                                                onClick={() => setDeprecatePlan(plan)}
                                                className="p-1.5 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-md transition-colors"
                                                title="Deprecate Plan"
                                            >
                                                <Archive className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Features Section */}
            <div className="mt-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Plan Comparison</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {activePlans.map((plan) => (
                        <div key={plan.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{plan.name}</h4>
                                <StatusBadge status={plan.status} />
                            </div>
                            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-3">
                                {formatPlanPrice(plan.basePrice)}
                                <span className="text-sm font-normal text-slate-500">/month</span>
                            </div>
                            <ul className="space-y-2">
                                {plan.features.slice(0, 5).map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                        {feature}
                                    </li>
                                ))}
                                {plan.features.length > 5 && (
                                    <li className="text-xs text-slate-400 dark:text-slate-500">
                                        +{plan.features.length - 5} more features
                                    </li>
                                )}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Create Plan Modal (stub) */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Create New Plan"
                size="lg"
            >
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <CreditCard className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                    <p>Plan creation form would go here.</p>
                    <p className="text-sm mt-2">This is a configuration-only module.</p>
                </div>
            </Modal>

            {/* Edit Plan Modal (stub) */}
            <Modal
                isOpen={!!editPlan}
                onClose={() => setEditPlan(null)}
                title={`Edit Plan: ${editPlan?.name}`}
                size="lg"
            >
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <Edit3 className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                    <p>Plan editing is forward-only.</p>
                    <p className="text-sm mt-2">Changes will apply to future subscriptions only.</p>
                </div>
            </Modal>

            {/* Deprecate Confirm */}
            <ConfirmModal
                isOpen={!!deprecatePlan}
                onClose={() => setDeprecatePlan(null)}
                onConfirm={handleDeprecate}
                title="Deprecate Plan"
                message={`Are you sure you want to deprecate "${deprecatePlan?.name}"? New customers will not be able to select this plan. Existing subscribers will continue until their next renewal.`}
                confirmLabel="Deprecate Plan"
                variant="warning"
            />
        </div>
    );
}
