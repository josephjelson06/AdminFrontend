import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Primary accent (emerald-based)
                primary: {
                    DEFAULT: 'rgb(var(--accent-primary))',
                    soft: 'rgb(var(--accent-primary-soft))',
                    50: '#ecfdf5',
                    100: '#d1fae5',
                    200: '#a7f3d0',
                    300: '#6ee7b7',
                    400: '#34d399',
                    500: '#10b981',
                    600: '#059669',
                    700: '#047857',
                    800: '#065f46',
                    900: '#064e3b',
                },
                // Secondary accent (indigo-based)
                secondary: {
                    DEFAULT: 'rgb(var(--accent-secondary))',
                    soft: 'rgb(var(--accent-secondary-soft))',
                },
                // Semantic colors using tokens
                success: {
                    DEFAULT: 'rgb(var(--success))',
                    soft: 'rgb(var(--success-soft))',
                },
                warning: {
                    DEFAULT: 'rgb(var(--warning))',
                    soft: 'rgb(var(--warning-soft))',
                },
                danger: {
                    DEFAULT: 'rgb(var(--danger))',
                    soft: 'rgb(var(--danger-soft))',
                },
                info: {
                    DEFAULT: 'rgb(var(--info))',
                    soft: 'rgb(var(--info-soft))',
                },
                // Glass surfaces
                glass: {
                    bg: 'rgba(var(--glass-bg), var(--glass-opacity-strong))',
                    soft: 'rgba(var(--glass-bg), var(--glass-opacity-soft))',
                    solid: 'rgba(var(--glass-bg), var(--glass-opacity-solid))',
                    border: 'rgba(var(--border-glass), var(--border-glass-opacity))',
                },
                // Text colors
                text: {
                    primary: 'rgb(var(--text-primary))',
                    secondary: 'rgb(var(--text-secondary))',
                    muted: 'rgb(var(--text-muted))',
                    inverted: 'rgb(var(--text-inverted))',
                },
                // Background colors
                surface: {
                    base: 'rgb(var(--bg-base))',
                    elevated: 'rgb(var(--bg-elevated))',
                    overlay: 'rgb(var(--bg-overlay))',
                },
                // Border colors
                border: {
                    subtle: 'rgb(var(--border-subtle))',
                    DEFAULT: 'rgb(var(--border-default))',
                    strong: 'rgb(var(--border-strong))',
                },
            },
            borderRadius: {
                'sm': 'var(--radius-sm)',
                'md': 'var(--radius-md)',
                'lg': 'var(--radius-lg)',
                'xl': 'var(--radius-xl)',
                '2xl': 'var(--radius-2xl)',
                'full': 'var(--radius-full)',
            },
            backdropBlur: {
                'none': 'var(--blur-none)',
                'sm': 'var(--blur-sm)',
                'md': 'var(--blur-md)',
                'lg': 'var(--blur-lg)',
                'xl': 'var(--blur-xl)',
            },
            transitionDuration: {
                'fast': 'var(--transition-fast)',
                'normal': 'var(--transition-normal)',
                'slow': 'var(--transition-slow)',
            },
            transitionTimingFunction: {
                'smooth': 'var(--ease-smooth)',
                'bounce': 'var(--ease-bounce)',
            },
            spacing: {
                'xs': 'var(--space-xs)',
                'sm': 'var(--space-sm)',
                'md': 'var(--space-md)',
                'lg': 'var(--space-lg)',
                'xl': 'var(--space-xl)',
                '2xl': 'var(--space-2xl)',
            },
            boxShadow: {
                'glass-soft': '0 4px 16px rgba(var(--shadow-color), var(--shadow-opacity-soft))',
                'glass-strong': '0 8px 32px rgba(var(--shadow-color), var(--shadow-opacity-strong))',
                'glass-glow': '0 0 20px rgba(var(--accent-primary), var(--shadow-opacity-glow))',
                'glass-elevated': '0 16px 48px rgba(var(--shadow-color), var(--shadow-opacity-strong))',
            },
            screens: {
                'xs': '475px',
            },
            keyframes: {
                moveBackground: {
                    '0%': { backgroundPosition: '0% 0%' },
                    '100%': { backgroundPosition: '0% -1000%' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(8px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideIn: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                pulse: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.5' },
                },
            },
            animation: {
                'liquid-bg': 'moveBackground 60s linear infinite',
                'shimmer': 'shimmer 2s infinite',
                'fade-in': 'fadeIn 0.3s ease-out',
                'slide-in': 'slideIn 0.3s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
                'pulse-slow': 'pulse 3s ease-in-out infinite',
            },
        },
    },
    plugins: [],
};

export default config;
