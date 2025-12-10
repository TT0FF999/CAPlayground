"use client";

import { useEffect } from 'react';

export function LiquidGlassLayout({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            const blob1 = document.querySelector('.blob-1') as HTMLElement | null;
            const blob2 = document.querySelector('.blob-2') as HTMLElement | null;
            const blob3 = document.querySelector('.blob-3') as HTMLElement | null;

            if (blob1) blob1.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
            if (blob2) blob2.style.transform = `translate(${-x * 20}px, ${-y * 20}px)`;
            if (blob3) blob3.style.transform = `translate(${x * 10}px, ${-y * 10}px)`;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            {}
            <div className="blob-cont">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
                <div className="blob blob-3"></div>
            </div>
            
            {}
            {children}
        </div>
    );
}
