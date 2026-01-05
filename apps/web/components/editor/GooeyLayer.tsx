import React from 'react';

export const GooeyLayer = () => {
  return (
    <div className="relative w-full h-full bg-black overflow-hidden pointer-events-none" style={{ filter: "url('#goo-filter')" }}>
      <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      <div className="absolute top-1/2 left-1/2 w-24 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 animate-[spin_10s_linear_infinite]" />
      
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="goo-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
            <feColorMatrix 
              in="blur" 
              mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -12" 
              result="goo" 
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default GooeyLayer;

