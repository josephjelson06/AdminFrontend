import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClientLayout } from '@/components/shared/ClientLayout';
import { LiquidBackground, LiquidFilter } from '@/components/shared/ui/LiquidBackground';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'ATC Hotel Management',
    description: 'Manage hotels, kiosks, and operations',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-slate-50 dark:bg-slate-900`}>
                <LiquidFilter />
                <LiquidBackground />
                <div className="relative z-10">
                    <ClientLayout>{children}</ClientLayout>
                </div>
            </body>
        </html>
    );
}
