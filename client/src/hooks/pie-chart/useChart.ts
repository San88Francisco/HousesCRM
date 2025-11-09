import { ChartConfig } from '@/widgets/all-apartments/pie-chart-revenue-distribution/type';
import * as React from 'react';

type Props = {
  config: ChartConfig;
};

export const ChartContext = React.createContext<Props | null>(null);

export function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />');
  }

  return context;
}
