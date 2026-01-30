'use client';

import React, { useState, useRef, useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
    children: ReactNode;
    content: ReactNode;
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
    delayMs?: number;
    className?: string;
}

export function Tooltip({
    children,
    content,
    side = 'top',
    align = 'center',
    delayMs = 300,
    className = '',
}: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const calculatePosition = () => {
        if (!triggerRef.current || !tooltipRef.current) return;

        const triggerRect = triggerRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        const gap = 8;

        let top = 0;
        let left = 0;

        // Calculate base position based on side
        switch (side) {
            case 'top':
                top = triggerRect.top - tooltipRect.height - gap;
                left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
                break;
            case 'bottom':
                top = triggerRect.bottom + gap;
                left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
                break;
            case 'left':
                top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
                left = triggerRect.left - tooltipRect.width - gap;
                break;
            case 'right':
                top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
                left = triggerRect.right + gap;
                break;
        }

        // Adjust for alignment
        if (side === 'top' || side === 'bottom') {
            if (align === 'start') {
                left = triggerRect.left;
            } else if (align === 'end') {
                left = triggerRect.right - tooltipRect.width;
            }
        } else {
            if (align === 'start') {
                top = triggerRect.top;
            } else if (align === 'end') {
                top = triggerRect.bottom - tooltipRect.height;
            }
        }

        // Ensure tooltip stays within viewport
        const padding = 8;
        left = Math.max(padding, Math.min(left, window.innerWidth - tooltipRect.width - padding));
        top = Math.max(padding, Math.min(top, window.innerHeight - tooltipRect.height - padding));

        setPosition({ top, left });
    };

    const handleMouseEnter = () => {
        timeoutRef.current = setTimeout(() => {
            setIsVisible(true);
        }, delayMs);
    };

    const handleMouseLeave = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsVisible(false);
    };

    useEffect(() => {
        if (isVisible) {
            // Wait for tooltip to render before calculating position
            requestAnimationFrame(calculatePosition);
        }
    }, [isVisible]);

    if (!mounted) return <>{children}</>;

    return (
        <>
            <div
                ref={triggerRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onFocus={handleMouseEnter}
                onBlur={handleMouseLeave}
                className="inline-block"
            >
                {children}
            </div>

            {isVisible && createPortal(
                <div
                    ref={tooltipRef}
                    role="tooltip"
                    className={`
                        fixed z-[9999] px-3 py-1.5 text-xs font-medium rounded-lg
                        bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900
                        shadow-lg animate-fade-in pointer-events-none
                        ${className}
                    `}
                    style={{
                        top: position.top,
                        left: position.left,
                    }}
                >
                    {content}
                </div>,
                document.body
            )}
        </>
    );
}

// Simple wrapper for common use case
interface TooltipTriggerProps {
    children: ReactNode;
    tooltip: ReactNode;
    side?: 'top' | 'right' | 'bottom' | 'left';
}

export function WithTooltip({ children, tooltip, side = 'top' }: TooltipTriggerProps) {
    return (
        <Tooltip content={tooltip} side={side}>
            {children}
        </Tooltip>
    );
}
