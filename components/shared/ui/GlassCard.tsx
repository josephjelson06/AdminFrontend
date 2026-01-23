"use client";

import React from "react";
import { cn } from "@/lib/utils"; // Assuming you have a class merger

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className, style }) => {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-3xl text-black dark:text-white transition-all duration-700",
                className
            )}
            style={{
                boxShadow: "0 6px 6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1)",
                ...style,
            }}
        >
            {/* 1. Blur Layer */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backdropFilter: "blur(3px)",
                    filter: "url(#glass-distortion)", // References the ID from LiquidBackground
                }}
            />

            {/* 2. Tint Layer (Adjusted for Dark Mode compatibility) */}
            <div
                className="absolute inset-0 z-10"
                style={{ background: "rgba(255, 255, 255, 0.15)" }} // Lower opacity for dashboard readability
            />

            {/* 3. Border/Shine Layer */}
            <div
                className="absolute inset-0 z-20 rounded-3xl pointer-events-none"
                style={{
                    boxShadow: "inset 2px 2px 1px 0 rgba(255, 255, 255, 0.5), inset -1px -1px 1px 1px rgba(255, 255, 255, 0.5)",
                }}
            />

            {/* 4. Content */}
            <div className="relative z-30 h-full">{children}</div>
        </div>
    );
};
