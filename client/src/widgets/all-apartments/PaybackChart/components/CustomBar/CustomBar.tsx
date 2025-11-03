import * as React from 'react';
import { CustomBarContent } from './CustomBarContent';
import { useBarCalculations } from '../../hooks/useBarCalculations';

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

export const CustomBar: React.FC<CustomBarProps> = props => {
  const barData = useBarCalculations(props);

  if (!barData) {
    return null;
  }

  return (
    <CustomBarContent
      id={barData.id}
      color={barData.color}
      isFullyPaidBack={barData.isFullyPaidBack}
      backgroundPath={barData.backgroundPath}
      fillPath={barData.fillPath}
    />
  );
};
