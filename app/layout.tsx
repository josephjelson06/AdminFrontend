import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google'; // Import the new font
import './globals.css';
import { ClientLayout } from '@/components/shared/ClientLayout';

// Base font for body text (readable)
const inter = Inter({ 
    subsets: ['latin'],
    variable: '--font-inter',
});

// Premium font for Headings (Headers, Titles)
const outfit = Outfit({ 
    subsets: ['latin'],
    variable: '--font-outfit',
});

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
        <html lang="en" suppressHydrationWarning>
            {/* Load both fonts */}
            <body className={`${inter.variable} ${outfit.variable} antialiased min-h-screen`}>
                <ClientLayout>{children}</ClientLayout>
            </body>
        </html>
    );
}