import React, { useState, useEffect, useRef } from 'react';

interface LavaLampProps {
  primaryColor?: string;
  secondaryColor?: string;
}

export const LavaLampLayer: React.FC<LavaLampProps> = ({ 
  primaryColor = "#FF3B30", 
  secondaryColor = "#FFCC00" 
}) => {
  const [mousePos, setMousePos] = useState({ x: 150, y: 200 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!containerRef.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: clientX - rect.left,
        y: clientY - rect.top,
      });
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full bg-black overflow-hidden relative"
      style={{
        filter: 'url(#lava-gooey-effect) contrast(30)',
        WebkitFilter: 'url(#lava-gooey-effect) contrast(30)',
      }}
    >
      <div className="absolute w-64 h-64 rounded-full blur-[40px] opacity-80 animate-pulse" 
           style={{ backgroundColor: primaryColor, top: '5%', left: '-10%', animationDuration: '10s' }} />
      
      <div className="absolute w-48 h-48 rounded-full blur-[40px] opacity-80" 
           style={{ 
             backgroundColor: primaryColor, 
             bottom: '10%', 
             right: '5%', 
             animation: 'lava-float 15s infinite alternate ease-in-out' 
           }} />

      <div 
        className="absolute w-32 h-32 rounded-full blur-[30px]"
        style={{
          backgroundColor: secondaryColor,
          left: mousePos.x - 64,
          top: mousePos.y - 64,
          transition: 'transform 0.1s ease-out',
          boxShadow: `0 0 50px ${secondaryColor}`
        }}
      />

      <svg className="hidden" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="lava-gooey-effect">
            <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
            <feColorMatrix 
              in="blur" 
              mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10" 
              result="goo" 
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <style>{`
        @keyframes lava-float {
          from { transform: translate(0, 0) scale(1); }
          to { transform: translate(60px, -80px) scale(1.2); }
        }
      `}</style>
    </div>
  );
};

export default LavaLampLayer;

