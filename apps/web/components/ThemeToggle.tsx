"use client";

import { useEffect, useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from "@/components/ui/button";

const getInitialTheme = () => {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
        return localStorage.getItem('theme') as 'light' | 'dark';
    }
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
};

export function ThemeToggle() {
    const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };
    
    if (!mounted) {
        return (
             <Button
                variant="ghost"
                size="icon"
                className="w-9 h-9 flex items-center justify-center rounded-full text-foreground/80 transition-colors border-none"
                aria-label="Toggle theme"
            >
                <Monitor className="h-5 w-5" />
            </Button>
        );
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            className="glass-panel w-9 h-9 flex items-center justify-center rounded-full text-foreground/80 hover:text-foreground transition-colors border-none"
            onClick={toggleTheme}
            aria-label="Toggle theme"
        >
            {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
    );
}
