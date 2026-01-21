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
    X,
} from 'lucide-react';
import { MOCK_PLANS, formatPlanPrice } from '@/lib/admin/plans-data';
import type { Plan, PlanStatus, PricingModel } from '@/types/finance';
import { Modal } from '@/components/shared/ui/Modal';
import { ConfirmModal } from '@/components/admin/modals/ConfirmModal';
import { useToast } from '@/components/shared/ui/Toast';

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

// Create Plan Modal Component
function CreatePlanModal({ isOpen, onClose, onSubmit }: { isOpen: boolean; onClose: () => void; onSubmit: (data: any) => void }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [pricingModel, setPricingModel] = useState<PricingModel>('flat');
    const [basePrice, setBasePrice] = useState('');
    const [includedKiosks, setIncludedKiosks] = useState('2');
    const [billingFrequency, setBillingFrequency] = useState<string[]>(['monthly']);
    const [features, setFeatures] = useState<string[]>([]);
    const [newFeature, setNewFeature] = useState('');
    const [status, setStatus] = useState<PlanStatus>('active');

    const handleBillingToggle = (freq: string) => {
        setBillingFrequency(prev =>
            prev.includes(freq) ? prev.filter(f => f !== freq) : [...prev, freq]
        );
    };

    const handleAddFeature = () => {
        if (newFeature.trim()) {
            setFeatures(prev => [...prev, newFeature.trim()]);
            setNewFeature('');
        }
    };

    const handleRemoveFeature = (index: number) => {
        setFeatures(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            name,
            description,
            pricingModel,
            basePrice: parseFloat(basePrice),
            includedKiosks: parseInt(includedKiosks),
            billingFrequency,
            features,
            status,
        });
        // Reset form
        setName('');
        setDescription('');
        setPricingModel('flat');
        setBasePrice('');
        setIncludedKiosks('2');
        setBillingFrequency(['monthly']);
        setFeatures([]);
        setStatus('active');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-lg shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between flex-shrink-0">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Create New Plan</h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-500" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Plan Name */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Plan Name *
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    placeholder="e.g., Standard, Advanced, Enterprise"
                                    className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                                />
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={2}
                                    placeholder="Brief description of this plan..."
                                    className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white resize-none"
                                />
                            </div>

                            {/* Pricing Model */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Pricing Model *
                                </label>
                                <select
                                    value={pricingModel}
                                    onChange={(e) => setPricingModel(e.target.value as PricingModel)}
                                    className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                                >
                                    <option value="flat">Flat Rate</option>
                                    <option value="tiered">Tiered</option>
                                    <option value="per-unit">Per Unit</option>
                                </select>
                            </div>

                            {/* Base Price */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Base Price (₹/month) *
                                </label>
                                <input
                                    type="number"
                                    value={basePrice}
                                    onChange={(e) => setBasePrice(e.target.value)}
                                    required
                                    min="0"
                                    placeholder="15000"
                                    className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                                />
                            </div>

                            {/* Included Kiosks */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Included Kiosks *
                                </label>
                                <select
                                    value={includedKiosks}
                                    onChange={(e) => setIncludedKiosks(e.target.value)}
                                    className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                                >
                                    <option value="1">1 Kiosk</option>
                                    <option value="2">2 Kiosks</option>
                                    <option value="3">3 Kiosks</option>
                                    <option value="5">5 Kiosks</option>
                                    <option value="10">10 Kiosks</option>
                                    <option value="20">20 Kiosks</option>
                                    <option value="50">50 Kiosks (Unlimited)</option>
                                </select>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Status
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as PlanStatus)}
                                    className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                                >
                                    <option value="active">Active</option>
                                    <option value="deprecated">Draft (Deprecated)</option>
                                </select>
                            </div>

                            {/* Billing Options */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Billing Options *
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {['monthly', 'quarterly', 'annual'].map(freq => (
                                        <label key={freq} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={billingFrequency.includes(freq)}
                                                onChange={() => handleBillingToggle(freq)}
                                                className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-slate-900 dark:focus:ring-white"
                                            />
                                            <span className="text-sm text-slate-700 dark:text-slate-300 capitalize">{freq}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Features */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Features
                                </label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={newFeature}
                                        onChange={(e) => setNewFeature(e.target.value)}
                                        placeholder="Add a feature..."
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                                        className="flex-1 px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddFeature}
                                        className="px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                {features.length > 0 && (
                                    <div className="space-y-1">
                                        {features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-2 py-1.5 px-2 bg-slate-50 dark:bg-slate-700/50 rounded">
                                                <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                                                <span className="text-sm text-slate-700 dark:text-slate-300 flex-1">{feature}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveFeature(idx)}
                                                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors"
                                                >
                                                    <X className="w-3.5 h-3.5 text-slate-400" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex gap-3 flex-shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!name || !basePrice || billingFrequency.length === 0}
                            className="flex-1 px-4 py-2 bg-slate-900 dark:bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-slate-800 dark:hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Create Plan
                        </button>
                    </div>
                </div>
            </div>
        </div>
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

    const handleCreatePlan = (data: any) => {
        addToast('success', 'Plan Created', `New plan "${data.name}" has been created.`);
    };

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

            {/* Plan Comparison (Primary - Strategic View) */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 mb-6">
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

            {/* Plans Table (Secondary - Operational View) */}
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

            {/* Create Plan Modal */}
            <CreatePlanModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreatePlan}
            />

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
