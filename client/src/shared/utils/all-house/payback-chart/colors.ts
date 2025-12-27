export const HOUSE_COLORS = [
  '#8b7aff',
  '#7dd3fc',
  '#1f2937',
  '#34d399',
  '#fbbf24',
  '#fb923c',
  '#f87171',
  '#ec4899',
  '#a78bfa',
  '#60a5fa',
  '#4ade80',
  '#facc15',
  '#f472b6',
  '#818cf8',
  '#2dd4bf',
] as const;

export const getApartmentColor = (index: number): string => {
  return HOUSE_COLORS[index % HOUSE_COLORS.length];
};
