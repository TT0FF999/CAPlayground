import React from 'react';

export const GooeyLayer = () => {
  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
      <div className="relative flex items-center justify-center w-full h-full" style={{ filter: "url('#goo-filter')" }}>
        <div className="absolute w-40 h-40 bg-white rounded-[35%] animate-[pulse_4s_ease-in-out_infinite] opacity-90" />
        <div className="absolute w-24 h-56 bg-white rounded-full opacity-80 animate-[spin_12s_linear_infinite]" />
        <div 
          className="absolute w-32 h-32 bg-white rounded-full opacity-70 animate-[orbit_8s_linear_infinite]" 
          style={{ transformOrigin: '120% 50%' }} 
        />
        <div 
          className="absolute w-20 h-48 bg-white rounded-[40%] opacity-90 animate-[spin_15s_linear_infinite_reverse]" 
          style={{ transformOrigin: '20% 50%' }} 
        />
        <div 
          className="absolute w-12 h-12 bg-white rounded-full animate-[float_5s_ease-in-out_infinite]" 
          style={{ top: '30%', left: '40%' }} 
        />
      </div>

      <svg className="absolute w-0 h-0 invisible">
        <defs>
          <filter id="goo-filter" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur" />
            <feColorMatrix 
              in="blur" 
              mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 35 -15" 
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
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -20px) scale(1.2); }
        }
        @keyframes pulse {
          0%, 100% { border-radius: 35%; transform: scale(1); }
          50% { border-radius: 50%; transform: scale(1.1); }
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

