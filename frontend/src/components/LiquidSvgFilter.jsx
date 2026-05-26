import React from 'react';

const LiquidSvgFilter = () => (
  <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
    <filter id="liquid-filter" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
      <feColorMatrix 
        in="blur" 
        mode="matrix" 
        values="1 0 0 0 0  
                0 1 0 0 0  
                0 0 1 0 0  
                0 0 0 20 -8" 
      />
    </filter>
  </svg>
);

export default LiquidSvgFilter;