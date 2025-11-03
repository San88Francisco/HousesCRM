import * as React from 'react';
import { TICK_MAX_TEXT_LENGTH, truncateText } from '../utils/payback.utils';

interface CustomXAxisTickProps {
  x?: number;
  y?: number;
  payload?: { value: string };
  isDark: boolean;
}

export const CustomXAxisTick: React.FC<CustomXAxisTickProps> = props => {
  if (!props.payload) {
    return null;
  }
  const x = props.x ?? 0;
  const y = props.y ?? 0;
  const { value: text } = props.payload;

  const displayText = truncateText(text, TICK_MAX_TEXT_LENGTH);

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="end"
        fill={'#9ca3af'}
        fontSize={13}
        fontWeight={400}
        transform="rotate(-45)"
        title={text}
      >
        {displayText}
      </text>
    </g>
  );
};
