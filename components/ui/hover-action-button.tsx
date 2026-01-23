"use client";

import { cn } from "@/lib/utils";
import { ArrowBigRight, ArrowRight, LucideIcon } from "lucide-react";
import React from "react";

interface HoverActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text: string;
    icon?: LucideIcon;
}

export const HoverActionButton = React.forwardRef<HTMLButtonElement, HoverActionButtonProps>(
    ({ className, text, icon: Icon = ArrowRight, onClick, ...props }, ref) => {
        return (
            <button
                ref={ref}
                onClick={onClick}
                className={cn(
                    "group relative cursor-pointer p-2 w-32 border border-emerald-500/20 bg-white dark:bg-slate-900 rounded-full overflow-hidden text-slate-900 dark:text-white text-center font-semibold text-sm transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow-emerald-500/20",
                    className
                )}
                {...props}
            >
                <span className="translate-y-0 group-hover:-translate-y-12 group-hover:opacity-0 transition-all duration-300 inline-block">
                    {text}
                </span>
                <div className="flex gap-2 text-white bg-emerald-500 z-10 items-center absolute left-0 top-0 h-full w-full justify-center translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 rounded-full group-hover:rounded-none">
                    <span>{text}</span>
                    <Icon className="w-4 h-4" />
                </div>
            </button>
        );
    }
);

HoverActionButton.displayName = "HoverActionButton";
