'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';

interface DropdownProps {
    trigger: ReactNode;
    children: ReactNode;
    align?: 'left' | 'right';
}

export function Dropdown({ trigger, children, align = 'left' }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleClickOutside = (e: MouseEvent) => {
            // Check if click is outside trigger AND outside the portal menu
            const menuElement = document.getElementById(`dropdown-menu-${dropdownRef.current?.id}`);

            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node) &&
                (!menuElement || !menuElement.contains(e.target as Node))
            ) {
                setIsOpen(false);
            }
        };

        const handleScroll = () => {
            if (isOpen) setIsOpen(false); // Close on scroll for simplicity or update position
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            window.addEventListener('scroll', handleScroll, true);
            // Calculate position
            if (dropdownRef.current) {
                const rect = dropdownRef.current.getBoundingClientRect();
                setMenuStyle({
                    position: 'fixed',
                    top: rect.bottom + 8,
                    left: align === 'left' ? rect.left : 'auto',
                    right: align === 'right' ? window.innerWidth - rect.right : 'auto',
                    minWidth: '160px',
                    zIndex: 99999,
                });
            }
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [isOpen, align]);

    const dropdownId = useRef(`dropdown-${Math.random().toString(36).substr(2, 9)}`);

    return (
        <div ref={dropdownRef} id={dropdownId.current} className="relative inline-block">
            <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

            {mounted && isOpen && createPortal(
                <div
                    id={`dropdown-menu-${dropdownId.current}`}
                    className="glass-elevated rounded-2xl py-2 animate-scale-in"
                    style={menuStyle}
                >
                    {children}
                </div>,
                document.body
            )}
        </div>
    );
}

interface DropdownItemProps {
    onClick?: () => void;
    children: ReactNode;
    variant?: 'default' | 'danger';
    className?: string;
}

export function DropdownItem({ onClick, children, variant = 'default', className }: DropdownItemProps) {
    return (
        <button
            onClick={onClick}
            className={`w-full text-left px-4 py-2.5 text-sm transition-all duration-normal flex items-center gap-2.5 ${variant === 'danger'
                ? 'text-danger hover:bg-danger/10'
                : 'text-secondary hover:text-primary hover:bg-glass-soft'
                } ${className || ''}`}
        >
            {children}
        </button>
    );
}

interface SelectDropdownProps {
    value: string;
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
    placeholder?: string;
}

export function SelectDropdown({ value, options, onChange, placeholder = 'Select...' }: SelectDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedLabel = options.find((o) => o.value === value)?.label || placeholder;

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-3 py-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/60 dark:border-slate-600/60 rounded-xl text-sm text-slate-700 dark:text-slate-300 hover:border-slate-300/70 dark:hover:border-slate-500/70 transition-colors"
            >
                <span className={value ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400'}>{selectedLabel}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 glass-elevated rounded-xl py-1 max-h-48 overflow-auto">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-sm transition-colors ${option.value === value
                                ? 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 font-medium'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700/50'
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
