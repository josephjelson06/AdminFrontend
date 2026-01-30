"use client";

import React from "react";
import { cn } from "@/lib/utils";

type GlassVariant = 'soft' | 'strong' | 'solid' | 'elevated';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    variant?: GlassVariant;
    hover?: boolean;
    glow?: boolean;
    aurora?: boolean; // Aurora accent stripe
    auroraGlow?: boolean; // Aurora glow effect
    padding?: 'none' | 'sm' | 'md' | 'lg';
    onClick?: () => void;
}

const variantClasses: Record<GlassVariant, string> = {
    soft: 'surface-glass-soft',
    strong: 'surface-glass-strong',
    solid: 'surface-solid',
    elevated: 'glass-elevated',
};

const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6',
};

export const GlassCard: React.FC<GlassCardProps> = ({
    children,
    className,
    style,
    variant = 'strong',
    hover = true,
    glow = false,
    aurora = false,
    auroraGlow = false,
    padding = 'md',
    onClick,
}) => {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-2xl",
                variantClasses[variant],
                paddingClasses[padding],
                hover && "glass-hover",
                glow && "glow-accent-soft",
                aurora && "aurora-accent",
                auroraGlow && "aurora-glow",
                "transition-all duration-normal ease-smooth",
                onClick && "cursor-pointer",
                className
            )}
            style={style}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

// Convenience exports for specific variants
export const GlassCardSoft: React.FC<Omit<GlassCardProps, 'variant'>> = (props) => (
    <GlassCard {...props} variant="soft" />
);

export const GlassCardStrong: React.FC<Omit<GlassCardProps, 'variant'>> = (props) => (
    <GlassCard {...props} variant="strong" />
);

export const GlassCardSolid: React.FC<Omit<GlassCardProps, 'variant'>> = (props) => (
    <GlassCard {...props} variant="solid" />
);

export const GlassCardElevated: React.FC<Omit<GlassCardProps, 'variant'>> = (props) => (
    <GlassCard {...props} variant="elevated" />
);
