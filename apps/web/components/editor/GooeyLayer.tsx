import React from 'react';

export const GooeyLayer = () => {
  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center" style={{ filter: "url('#goo-filter')" }}>
      
      {/* Forme centrale stable (Le noyau) */}
      <div className="absolute w-40 h-40 bg-white rounded-[35%] animate-[pulse_4s_ease-in-out_infinite] opacity-90" />
      
      {/* Formes satellites qui créent la fusion organique */}
      <div className="absolute w-24 h-56 bg-white rounded-full opacity-80 animate-[spin_12s_linear_infinite]" />
      
      <div className="absolute w-32 h-32 bg-white rounded-full opacity-70 animate-[orbit_8s_linear_infinite]" 
           style={{ transformOrigin: '120% 50%' }} />
      
      <div className="absolute w-20 h-48 bg-white rounded-[40%] opacity-90 animate-[spin_15s_linear_infinite_reverse]" 
           style={{ transformOrigin: '20% 50%' }} />

      {/* Petites bulles de "détail" pour l'aspect mercure */}
      <div className="absolute w-12 h-12 bg-white rounded-full animate-[float_5s_ease-in-out_infinite]" 
           style={{ top: '30%', left: '40%' }} />

      {/* Filtre SVG optimisé pour la douceur Apple */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="goo-filter">
            {/* Un flou un peu plus élevé pour une fusion plus précoce */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur" />
            {/* Matrice ajustée : le "25 -12" est bon, mais on peut le rendre plus lisse avec "20 -10" */}
            <feColorMatrix 
              in="blur" 
              mode="matrix" 
              values="1 0 0 0 0  
                      0 1 0 0 0  
                      0 0 1 0 0  
                      0 0 0 22 -11" 
              result="goo" 
            />
            {/* Fondre les éléments entre eux sans perdre l'éclat */}
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
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -20px) scale(1.2); }
        }
        @keyframes pulse {
          0%, 100% { border-radius: 35%; transform: scale(1); }
          50% { border-radius: 50%; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default GooeyLayer;

