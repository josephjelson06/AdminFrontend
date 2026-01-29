'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/admin/layout/Sidebar';
import { Header } from '@/components/admin/layout/Header';
import { ProtectedRoute } from '@/components/shared/auth/ProtectedRoute';
import { useState, useEffect } from 'react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Sidebar State
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState(256);
    const [isMounted, setIsMounted] = useState(false);

    // Initial load
    useEffect(() => {
        setIsMounted(true);
        const savedCollapsed = localStorage.getItem('sidebar-collapsed');
        const savedWidth = localStorage.getItem('sidebar-width');

        if (savedCollapsed !== null) {
            setIsCollapsed(savedCollapsed === 'true');
        }
        if (savedWidth !== null) {
            setSidebarWidth(Number(savedWidth));
        }
    }, []);

    // Persist sidebar width with debounce
    useEffect(() => {
        if (!isMounted) return;
        const timer = setTimeout(() => {
            localStorage.setItem('sidebar-width', String(sidebarWidth));
        }, 500);
        return () => clearTimeout(timer);
    }, [sidebarWidth, isMounted]);

    const toggleCollapsed = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        localStorage.setItem('sidebar-collapsed', String(newState));
    };

    // Default width prevention before mount (SSR match)
    const currentSidebarWidth = isMounted ? (isCollapsed ? 80 : sidebarWidth) : 256;

    return (
        <ProtectedRoute>
            <div
                className="min-h-screen bg-gradient-mesh"
                style={{
                    '--sidebar-width': `${currentSidebarWidth}px`
                } as React.CSSProperties}
            >
                <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    sidebarWidth={sidebarWidth}
                    setSidebarWidth={setSidebarWidth}
                    isCollapsed={isCollapsed}
                    toggleCollapsed={toggleCollapsed}
                />
                <Header
                    onMenuClick={() => setSidebarOpen(true)}
                    sidebarCollapsed={isCollapsed}
                />
                <main className="min-h-screen transition-all duration-normal ease-smooth lg:ml-[var(--sidebar-width)]">
                    <div className="p-4 sm:p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
