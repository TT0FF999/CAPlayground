"use client";

import React, { useEffect, useState } from 'react';

export const GooeyLayer = () => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 40;
      const y = (e.clientY / window.innerHeight - 0.5) * 40;
      setOffset({ x, y });
    };

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (!e.gamma || !e.beta) return;
      const x = Math.min(Math.max(e.gamma, -45), 45); 
      const y = Math.min(Math.max(e.beta - 45, -45), 45);
      setOffset({ x: x * 1.5, y: y * 1.5 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const parallax = (depth: number) => ({
    transform: `translate(${offset.x * depth}px, ${offset.y * depth}px)`,
    transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
    willChange: 'transform'
  });

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
      <div 
        className="relative flex items-center justify-center w-full h-full transform-gpu translate-z-0" 
        style={{ filter: "url('#goo-watch')" }}
      >
        <div 
          className="absolute w-48 h-48 bg-white rounded-[42%] animate-[pulse_6s_ease-in-out_infinite] opacity-90"
          style={parallax(0.5)} 
        />
        <div 
          className="absolute w-32 h-64 bg-white rounded-full opacity-80 animate-[spin_14s_linear_infinite]" 
          style={{ ...parallax(-0.8), transformOrigin: '50% 60%' }}
        />
        <div 
          className="absolute w-40 h-40 bg-white rounded-[45%] opacity-70 animate-[orbit_10s_linear_infinite]" 
          style={{ ...parallax(1.5), transformOrigin: '140% 50%' }} 
        />
        <div 
          className="absolute w-28 h-56 bg-white rounded-[40%] opacity-85 animate-[spin_20s_linear_infinite_reverse]" 
          style={{ ...parallax(-1.2), transformOrigin: '20% 40%' }} 
        />
        <div 
          className="absolute w-16 h-16 bg-white rounded-full animate-[float_5s_ease-in-out_infinite]" 
          style={{ ...parallax(2.0), top: '25%', left: '35%' }} 
        />
      </div>

      <svg className="absolute w-0 h-0 invisible">
        <defs>
          <filter id="goo-watch" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur" />
            <feColorMatrix 
              in="blur" 
              mode="matrix" 
              values="1 0 0 0 0  
                      0 1 0 0 0  
                      0 0 1 0 0  
                      0 0 0 35 -14" 
              result="goo" 
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <style>{`
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(50px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(50px) rotate(-360deg); }
        }
        @keyframes float {
          0%, 100% { transform: scale(1.05); }
          50% { transform: translate(20px, -20px) scale(0.95); }
        }
        @keyframes pulse {
          0%, 100% { border-radius: 42%; transform: scale(1); }
          50% { border-radius: 50%; transform: scale(1.05); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default GooeyLayer;


