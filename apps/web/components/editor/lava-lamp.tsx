import React, { useMemo } from 'react';

interface LavaLampProps {
  primaryColor?: string;
  secondaryColor?: string;
}

export const LavaLampLayer: React.FC<LavaLampProps> = ({ 
  primaryColor = "#FF3B30", 
  secondaryColor = "#FFCC00" 
}) => {
  // On définit des positions fixes mais animées par CSS pour éviter tout calcul JS
  // Cela permet au moteur iOS (Mika/PosterBoard) de gérer l'animation seul.
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#000000',
      position: 'fixed',
      top: 0,
      left: 0,
      overflow: 'hidden'
    }}>
      {/* Premier calque de couleur (Base dynamique) */}
      <div style={{
        position: 'absolute',
        width: '150%',
        height: '150%',
        top: '-25%',
        left: '-25%',
        background: `radial-gradient(circle at center, ${primaryColor} 0%, transparent 60%)`,
        opacity: 0.7,
        filter: 'blur(80px)',
        WebkitFilter: 'blur(80px)',
        animation: 'ca-pulse 12s infinite alternate ease-in-out'
      }} />

      {/* Deuxième calque (Bulle secondaire) */}
      <div style={{
        position: 'absolute',
        width: '120%',
        height: '120%',
        bottom: '-10%',
        right: '-10%',
        background: `radial-gradient(circle at center, ${secondaryColor} 0%, transparent 50%)`,
        opacity: 0.6,
        filter: 'blur(100px)',
        WebkitFilter: 'blur(100px)',
        animation: 'ca-float 18s infinite alternate ease-in-out'
      }} />

      {/* Calque de fusion (Simule l'effet de l'Apple Watch) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), transparent, rgba(0,0,0,0.5))',
        mixBlendMode: 'overlay'
      }} />

      <style>{`
        @keyframes ca-pulse {
          0% { transform: scale(1) translate(0, 0); opacity: 0.5; }
          100% { transform: scale(1.1) translate(5%, 5%); opacity: 0.8; }
        }
        @keyframes ca-float {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-10%, -15%); }
        }
      `}</style>
    </div>
  );
};

export default LavaLampLayer;

