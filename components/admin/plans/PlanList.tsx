'use client';

/**
 * PlanList Component
 * 
 * Main component for managing subscription plans.
 */

import { CreditCard, Plus } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { usePlans } from './usePlans';
import { PlanCard } from './PlanCard';
import { PlanEditorSlideOver } from '@/components/admin/plans/PlanEditorSlideOver';
import { VerticalCutReveal } from '@/components/ui/vertical-cut-reveal';
import { motion } from 'framer-motion';

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
            ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number]
        }
    }
};

export function PlanList() {
    const { hasPermission } = useAuth();
    const {
        plans,
        isLoading,
        editingPlan,
        isEditorOpen,
        openEditor,
        closeEditor,
        savePlan,
        archivePlan,
        unarchivePlan,
        deletePlan,
    } = usePlans();

    const canEdit = hasPermission('finance', 'edit');

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
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
                        onClick={() => openEditor()}
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
                        <PlanCard
                            plan={plan}
                            canEdit={canEdit}
                            onEdit={openEditor}
                            onArchive={archivePlan}
                            onUnarchive={unarchivePlan}
                            onDelete={deletePlan}
                        />
                    </motion.div>
                ))}
            </motion.div>

            {/* Editor SlideOver */}
            <PlanEditorSlideOver
                isOpen={isEditorOpen}
                onClose={closeEditor}
                plan={editingPlan}
                onSave={savePlan}
            />
        </div>
    );
}
