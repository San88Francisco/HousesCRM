import * as React from 'react';
import { BAR_BACKGROUND_OPACITY, BAR_FILL_OPACITY } from '../../utils/payback.utils';
import { BarGlowFilter } from './BarGlowFilter';
import { BarAnimation } from './BarAnimation';

interface CustomBarContentProps {
  id: string;
  color: string;
  isFullyPaidBack: boolean;
  backgroundPath: string;
  fillPath: string;
}

export const CustomBarContent: React.FC<CustomBarContentProps> = ({
  id,
  color,
  isFullyPaidBack,
  backgroundPath,
  fillPath,
}) => (
  <g>
    <BarGlowFilter id={id} />

    <path d={backgroundPath} fill={color} opacity={BAR_BACKGROUND_OPACITY} />

    <path
      d={fillPath}
      fill={color}
      opacity={BAR_FILL_OPACITY}
      filter={isFullyPaidBack ? `url(#glow-${id})` : 'none'}
      style={{
        transition: 'all 0.3s ease',
      }}
    />

    {isFullyPaidBack && <BarAnimation />}
  </g>
);
