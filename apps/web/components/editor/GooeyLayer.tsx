import React from 'react';

export const GooeyLayer = () => {
  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
      <div className="relative flex items-center justify-center w-full h-full" style={{ filter: "url('#goo-smooth')" }}>
        <div className="absolute w-44 h-44 bg-white rounded-[38%] animate-[pulse_5s_ease-in-out_infinite]" />
        <div 
          className="absolute w-28 h-64 bg-white rounded-full animate-[spin_8s_linear_infinite]" 
          style={{ transformOrigin: '50% 50%' }}
        />
        <div 
          className="absolute w-36 h-36 bg-white rounded-full animate-[orbit_12s_linear_infinite]" 
          style={{ transformOrigin: '130% 50%' }} 
        />
        <div 
          className="absolute w-24 h-52 bg-white rounded-[45%] animate-[spin_18s_linear_infinite_reverse]" 
          style={{ transformOrigin: '10% 50%' }} 
        />
        <div 
          className="absolute w-14 h-14 bg-white rounded-full animate-[float_6s_ease-in-out_infinite]" 
          style={{ top: '20%', left: '30%' }} 
        />
      </div>

      <svg className="absolute w-0 h-0 invisible">
        <defs>
          <filter id="goo-smooth" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
            <feColorMatrix 
              in="blur" 
              mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -12" 
              result="goo" 
            />
            <feComponentTransfer in="goo">
              <feFuncA type="discrete" tableValues="0 1" />
            </feComponentTransfer>
            <feGaussianBlur stdDeviation="0.5" />
          </filter>
        </defs>
      </svg>

      <style>{`
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(40px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(40px) rotate(-360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1.1); }
          50% { transform: translate(50px, -30px) scale(0.9); }
        }
        @keyframes pulse {
          0%, 100% { border-radius: 38%; transform: scale(1) rotate(0deg); }
          50% { border-radius: 50%; transform: scale(1.1) rotate(5deg); }
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

