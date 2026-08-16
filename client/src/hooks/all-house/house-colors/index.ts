import { buildHouseColorMap } from '@/shared/utils/all-house/house-color';
import { useGetHousesAnalyticsQuery } from '@/store/api/houses-api';
import { useMemo } from 'react';

export const useHouseColors = () => {
  const { data } = useGetHousesAnalyticsQuery();
  const housesOverview = data?.housesOverview;

  return useMemo(() => buildHouseColorMap(housesOverview ?? []), [housesOverview]);
};
