'use client';

import React from 'react';
import styles from './Card.module.css';

// ============================================
// Card Component
// ============================================

interface CardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'subtle' | 'elevated';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hoverable?: boolean;
    onClick?: () => void;
}

export function Card({
    children,
    className = '',
    variant = 'default',
    padding = 'md',
    hoverable = false,
    onClick,
}: CardProps) {
    const isClickable = !!onClick;

    return (
        <div
            className={`
                ${styles.card}
                ${styles[variant]}
                ${styles[`padding-${padding}`]}
                ${hoverable || isClickable ? styles.hoverable : ''}
                ${className}
            `.trim()}
            onClick={onClick}
            role={isClickable ? 'button' : undefined}
            tabIndex={isClickable ? 0 : undefined}
            onKeyDown={isClickable ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick?.();
                }
            } : undefined}
        >
            {children}
        </div>
    );
}

// ============================================
// Card Header
// ============================================

interface CardHeaderProps {
    children: React.ReactNode;
    className?: string;
    actions?: React.ReactNode;
}

export function CardHeader({ children, className = '', actions }: CardHeaderProps) {
    return (
        <div className={`${styles.header} ${className}`}>
            <div className={styles.headerContent}>{children}</div>
            {actions && <div className={styles.headerActions}>{actions}</div>}
        </div>
    );
}

// ============================================
// Card Title
// ============================================

interface CardTitleProps {
    children: React.ReactNode;
    className?: string;
    subtitle?: string;
}

export function CardTitle({ children, className = '', subtitle }: CardTitleProps) {
    return (
        <div className={className}>
            <h3 className={styles.title}>{children}</h3>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
    );
}

// ============================================
// Card Body
// ============================================

interface CardBodyProps {
    children: React.ReactNode;
    className?: string;
}

export function CardBody({ children, className = '' }: CardBodyProps) {
    return <div className={`${styles.body} ${className}`}>{children}</div>;
}

// ============================================
// Card Footer
// ============================================

interface CardFooterProps {
    children: React.ReactNode;
    className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
    return <div className={`${styles.footer} ${className}`}>{children}</div>;
}
