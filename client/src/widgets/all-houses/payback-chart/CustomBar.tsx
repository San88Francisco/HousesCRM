'use client';

type CustomBarProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  payload?: {
    isFullyPaidBack: boolean;
    color: string;
    displayCoefficient: number;
    id: string;
    isEmpty?: boolean;
  };
  activeApartment?: string | null;
};

const BORDER_RADIUS = 4;
const BACKGROUND_OPACITY = 0.25;
const FILL_OPACITY = 0.9;
const ANIMATION_DURATION = '2s';

const createRoundedRectPath = (x: number, y: number, width: number, height: number): string => {
  return `
    M ${x + BORDER_RADIUS} ${y}
    L ${x + width - BORDER_RADIUS} ${y}
    Q ${x + width} ${y} ${x + width} ${y + BORDER_RADIUS}
    L ${x + width} ${y + height}
    L ${x} ${y + height}
    L ${x} ${y + BORDER_RADIUS}
    Q ${x} ${y} ${x + BORDER_RADIUS} ${y}
    Z
  `;
};

const GlowFilter = ({ id }: { id: string }) => (
  <filter id={`glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur stdDeviation="2" result="blur" />
    <feMerge>
      <feMergeNode in="blur" />
      <feMergeNode in="SourceGraphic" />
    </feMerge>
  </filter>
);

const PulseAnimation = () => (
  <animate
    attributeName="opacity"
    values={`${FILL_OPACITY};1;${FILL_OPACITY}`}
    dur={ANIMATION_DURATION}
    repeatCount="indefinite"
  />
);

type BarPathsProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  fillY: number;
  color: string;
  isFullyPaidBack: boolean;
  id: string;
};

const BarPaths = ({ x, y, width, height, fillY, color, isFullyPaidBack, id }: BarPathsProps) => {
  const backgroundPath = createRoundedRectPath(x, y, width, height);
  const fillPath = createRoundedRectPath(x, fillY, width, height - fillY + y);

  return (
    <>
      <path d={backgroundPath} fill={color} opacity={BACKGROUND_OPACITY} />
      <path
        d={fillPath}
        fill={color}
        opacity={FILL_OPACITY}
        filter={isFullyPaidBack ? `url(#glow-${id})` : 'none'}
        style={{ transition: 'all 0.3s ease' }}
      >
        {isFullyPaidBack && <PulseAnimation />}
      </path>
    </>
  );
};

export const CustomBar = ({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  payload,
  activeApartment,
}: CustomBarProps) => {
  if (!payload || payload.isEmpty) {
    return null;
  }

  const { isFullyPaidBack, color, displayCoefficient, id } = payload;
  const isHidden = activeApartment && activeApartment !== id;
  const barOpacity = isHidden ? 0.15 : 1;
  const fillHeight = height * displayCoefficient;
  const fillY = y + (height - fillHeight);

  return (
    <g style={{ opacity: barOpacity, transition: 'opacity 0.3s ease' }}>
      <defs>
        <GlowFilter id={id} />
      </defs>
      <BarPaths
        x={x}
        y={y}
        width={width}
        height={height}
        fillY={fillY}
        color={color}
        isFullyPaidBack={isFullyPaidBack}
        id={id}
      />
    </g>
  );
};
