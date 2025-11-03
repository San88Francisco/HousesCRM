import * as React from 'react';

interface BarGlowFilterProps {
  id: string;
}

export const BarGlowFilter: React.FC<BarGlowFilterProps> = ({ id }) => (
  <defs>
    <filter id={`glow-${id}`}>
      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
      <feMerge>
        <feMergeNode in="coloredBlur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
);
