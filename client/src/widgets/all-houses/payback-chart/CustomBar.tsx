'use client';

interface CustomBarProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  payload?: {
    isFullyPaidBack: boolean;
    color: string;
    displayCoefficient: number;
    id: string;
  };
}

const BORDER_RADIUS = 4;
const BACKGROUND_OPACITY = 0.25;
const FILL_OPACITY = 0.9;
const ANIMATION_DURATION = '2s';

export const CustomBar = ({ x = 0, y = 0, width = 0, height = 0, payload }: CustomBarProps) => {
  if (!payload) {
    return null;
  }

  const { isFullyPaidBack, color, displayCoefficient, id } = payload;

  const fillHeight = height * displayCoefficient;
  const fillY = y + (height - fillHeight);

  return (
    <g>
      <defs>
        <filter id={`glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path
        d={`
          M ${x + BORDER_RADIUS} ${y}
          L ${x + width - BORDER_RADIUS} ${y}
          Q ${x + width} ${y} ${x + width} ${y + BORDER_RADIUS}
          L ${x + width} ${y + height}
          L ${x} ${y + height}
          L ${x} ${y + BORDER_RADIUS}
          Q ${x} ${y} ${x + BORDER_RADIUS} ${y}
          Z
        `}
        fill={color}
        opacity={BACKGROUND_OPACITY}
      />

      <path
        d={`
          M ${x + BORDER_RADIUS} ${fillY}
          L ${x + width - BORDER_RADIUS} ${fillY}
          Q ${x + width} ${fillY} ${x + width} ${fillY + BORDER_RADIUS}
          L ${x + width} ${y + height}
          L ${x} ${y + height}
          L ${x} ${fillY + BORDER_RADIUS}
          Q ${x} ${fillY} ${x + BORDER_RADIUS} ${fillY}
          Z
        `}
        fill={color}
        opacity={FILL_OPACITY}
        filter={isFullyPaidBack ? `url(#glow-${id})` : 'none'}
        style={{
          transition: 'all 0.3s ease',
        }}
      />

      {isFullyPaidBack && (
        <animate
          attributeName="opacity"
          values={`${FILL_OPACITY};1;${FILL_OPACITY}`}
          dur={ANIMATION_DURATION}
          repeatCount="indefinite"
        />
      )}
    </g>
  );
};
