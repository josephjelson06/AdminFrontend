'use client';

import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { type ReactNode } from 'react';

// ============================================
// Animation Presets - Super Smooth (stiffness: 300)
// ============================================

export const springTransition = {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
};

export const smoothTransition = {
    type: 'spring' as const,
    stiffness: 300,
    damping: 35,
};

export const gentleTransition = {
    type: 'spring' as const,
    stiffness: 200,
    damping: 25,
};

// ============================================
// Animation Variants
// ============================================

export const fadeInUp: Variants = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
};

export const fadeInScale: Variants = {
    initial: { opacity: 0, scale: 0.95, y: 8 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.97, y: -4 },
};

export const slideInRight: Variants = {
    initial: { opacity: 0, x: 24 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 12 },
};

export const slideInLeft: Variants = {
    initial: { opacity: 0, x: -24 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -12 },
};

export const dropdownVariants: Variants = {
    initial: { opacity: 0, y: -8, scale: 0.96 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -4, scale: 0.98 },
};

export const modalVariants: Variants = {
    initial: { opacity: 0, scale: 0.94, y: 12 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.97, y: -6 },
};

export const overlayVariants: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

export const slideOverVariants: Variants = {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' },
};

export const toastVariants: Variants = {
    initial: { opacity: 0, x: 50, scale: 0.95 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: 80, scale: 0.9 },
};

// ============================================
// Motion Components
// ============================================

interface MotionCardProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export function MotionCard({ children, className = '', delay = 0 }: MotionCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...smoothTransition, delay }}
            whileHover={{
                y: -2,
                boxShadow: 'var(--glass-shadow-elevated)',
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

interface MotionListItemProps {
    children: ReactNode;
    className?: string;
    index?: number;
}

export function MotionListItem({ children, className = '', index = 0 }: MotionListItemProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...smoothTransition, delay: index * 0.05 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

interface MotionPageProps {
    children: ReactNode;
    className?: string;
}

export function MotionPage({ children, className = '' }: MotionPageProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// ============================================
// Hover Effects
// ============================================

export const hoverLift = {
    whileHover: { y: -2 },
    whileTap: { scale: 0.98 },
    transition: smoothTransition,
};

export const hoverScale = {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: smoothTransition,
};

export const hoverGlow = {
    whileHover: {
        boxShadow: '0 0 24px rgba(99, 102, 241, 0.3)',
    },
    transition: smoothTransition,
};

// ============================================
// Re-exports for convenience
// ============================================

export { motion, AnimatePresence };
export type { Variants };
