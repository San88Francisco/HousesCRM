import { ChartPieConfig } from '@/types/core/chart-pie-config';
import { createContext, useContext } from 'react';

type Props = {
  config: ChartPieConfig;
};

export const ChartContext = createContext<Props | null>(null);

export function useChart() {
  const context = useContext(ChartContext);

  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />');
  }

  return context;
}
