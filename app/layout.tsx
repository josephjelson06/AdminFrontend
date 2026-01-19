import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { ToastProvider } from '@/components/ui/Toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'ATC Super Admin Panel',
    description: 'Manage hotels, kiosks, and operations',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-slate-50`}>
                <ToastProvider>
                    <Sidebar />
                    <Header />
                    <main className="ml-56 mt-14 min-h-[calc(100vh-3.5rem)]">
                        {children}
                    </main>
                </ToastProvider>
            </body>
        </html>
    );
}
