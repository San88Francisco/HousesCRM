import { BAR_BORDER_RADIUS, generateRoundedRectPath } from '../utils/payback.utils';
import { getCleanBarInput } from '../utils/getCleanBarInput';

interface BarInputProps {
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

interface BarCalculations {
  id: string;
  color: string;
  isFullyPaidBack: boolean;
  backgroundPath: string;
  fillPath: string;
}

export const useBarCalculations = (props: BarInputProps): BarCalculations | null => {
  const cleanInput = getCleanBarInput(props);

  if (!cleanInput.payload) {
    return null;
  }

  const { x, y, width, height } = cleanInput;
  const { isFullyPaidBack, color, displayCoefficient, id } = cleanInput.payload;

  const fillHeight = height * displayCoefficient;
  const fillY = y + (height - fillHeight);

  const backgroundPath = generateRoundedRectPath(x, y, width, height, BAR_BORDER_RADIUS);
  const fillPath = generateRoundedRectPath(x, fillY, width, fillHeight, BAR_BORDER_RADIUS);

  return {
    id,
    color,
    isFullyPaidBack,
    backgroundPath,
    fillPath,
  };
};
