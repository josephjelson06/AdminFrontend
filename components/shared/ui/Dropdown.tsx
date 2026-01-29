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
                className="w-full flex items-center justify-between px-4 py-2.5 surface-glass-strong border border-glass rounded-xl text-sm text-secondary-text hover:border-primary/30 transition-all duration-fast"
            >
                <span className={value ? 'text-primary' : 'text-muted'}>{selectedLabel}</span>
                <ChevronDown className={`w-4 h-4 text-muted transition-transform duration-fast ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 surface-glass-strong border border-glass rounded-xl py-1 max-h-48 overflow-auto shadow-elevated">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-all duration-fast ${option.value === value
                                ? 'bg-primary/15 text-primary font-medium'
                                : 'text-secondary-text hover:bg-glass-soft hover:text-primary'
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
