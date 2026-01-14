import React, { useState, useEffect, useRef } from 'react';

interface LavaLampProps {
  primaryColor?: string;
  secondaryColor?: string;
}

export const LavaLampLayer: React.FC<LavaLampProps> = ({ 
  primaryColor = "#FF3B30", 
  secondaryColor = "#FFCC00" 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const update = (e: any) => {
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setPos({
          x: ((x - rect.left) / rect.width) * 100,
          y: ((y - rect.top) / rect.height) * 100,
        });
      }
    };
    window.addEventListener('mousemove', update);
    window.addEventListener('touchmove', update);
    return () => {
      window.removeEventListener('mousemove', update);
      window.removeEventListener('touchmove', update);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#000000',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1
      }}
    >
      <div 
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '70%',
          height: '40%',
          borderRadius: '50%',
          background: primaryColor,
          filter: 'blur(60px)',
          opacity: 0.6,
          animation: 'float-1 20s infinite alternate ease-in-out',
          willChange: 'transform'
        }}
      />

      <div 
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '-5%',
          width: '60%',
          height: '50%',
          borderRadius: '50%',
          background: primaryColor,
          filter: 'blur(70px)',
          opacity: 0.5,
          animation: 'float-2 25s infinite alternate ease-in-out',
          willChange: 'transform'
        }}
      />

      <div 
        style={{
          position: 'absolute',
          left: `${pos.x}%`,
          top: `${pos.y}%`,
          width: '150px',
          height: '150px',
          background: secondaryColor,
          borderRadius: '50%',
          filter: 'blur(40px)',
          transform: 'translate(-50%, -50%)',
          boxShadow: `0 0 80px ${secondaryColor}`,
          opacity: 0.8,
          transition: 'left 0.2s ease-out, top 0.2s ease-out',
          willChange: 'left, top'
        }}
      />

      <style>{`
        @keyframes float-1 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(10%, 15%) scale(1.2); }
        }
        @keyframes float-2 {
          0% { transform: translate(0, 0) rotate(0deg); }
          100% { transform: translate(-15%, -10%) rotate(20deg); }
        }
      `}</style>
    </div>
  );
};

export default LavaLampLayer;

