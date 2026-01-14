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
    window.addEventListener('touchmove', handleMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full relative"
      style={{
        backgroundColor: '#000000',
        overflow: 'hidden',
        zIndex: 1
      }}
    >
      {/* Utilisation de dégradés flous au lieu de filtres SVG pour la compatibilité iOS Wallpaper */}
      <div 
        className="absolute w-[150%] h-[150%] -top-[25%] -left-[25%] opacity-70"
        style={{
          background: `radial-gradient(circle at 30% 20%, ${primaryColor} 0%, transparent 40%),
                       radial-gradient(circle at 70% 80%, ${primaryColor} 0%, transparent 40%)`,
          filter: 'blur(60px)',
          WebkitFilter: 'blur(60px)',
          animation: 'lava-slow-pulse 15s infinite alternate ease-in-out'
        }}
      />

      {/* Bulle interactive avec flou natif */}
      <div 
        className="absolute w-40 h-40 rounded-full"
        style={{
          backgroundColor: secondaryColor,
          left: mousePos.x,
          top: mousePos.y,
          transform: 'translate(-50%, -50%)',
          filter: 'blur(45px)',
          WebkitFilter: 'blur(45px)',
          boxShadow: `0 0 60px ${secondaryColor}`,
          transition: 'left 0.15s ease-out, top 0.15s ease-out',
          opacity: 0.9,
          willChange: 'left, top'
        }}
      />

      {/* Bulle flottante secondaire */}
      <div 
        className="absolute w-56 h-56 rounded-full opacity-60"
        style={{
          backgroundColor: primaryColor,
          right: '10%',
          bottom: '10%',
          filter: 'blur(50px)',
          WebkitFilter: 'blur(50px)',
          animation: 'lava-float-native 20s infinite alternate ease-in-out'
        }}
      />

      <style>{`
        @keyframes lava-float-native {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-40px, -80px) scale(1.1); }
        }
        @keyframes lava-slow-pulse {
          0% { transform: rotate(0deg) scale(1); }
          100% { transform: rotate(10deg) scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default LavaLampLayer;

