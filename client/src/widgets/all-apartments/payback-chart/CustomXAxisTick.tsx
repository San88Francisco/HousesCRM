interface CustomXAxisTickProps {
  x?: number;
  y?: number;
  payload?: { value: string };
}

const MAX_TEXT_LENGTH = 12;

export const CustomXAxisTick = ({ x = 0, y = 0, payload }: CustomXAxisTickProps) => {
  if (!payload) {
    return null;
  }

  const text = payload.value;
  const displayText =
    text.length > MAX_TEXT_LENGTH ? `${text.substring(0, MAX_TEXT_LENGTH)}...` : text;

  return (
    <g transform={`translate(${x},${y})`}>
      <title>{text}</title>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="end"
        fill="#9ca3af"
        fontSize={13}
        fontWeight={400}
        transform="rotate(-45)"
      >
        {displayText}
      </text>
    </g>
  );
};
