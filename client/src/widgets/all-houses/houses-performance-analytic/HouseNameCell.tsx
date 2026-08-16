'use client';

import { useHouseColors } from '@/hooks/all-house/house-colors';
import { getHouseColor } from '@/shared/utils/all-house/house-color';

type Props = {
  houseId: string;
  apartmentName: string;
};

export const HouseNameCell = ({ houseId, apartmentName }: Props) => {
  const houseColors = useHouseColors();

  return (
    <div className="flex items-center gap-2 min-w-0">
      <div
        className="h-2 w-2 shrink-0 rounded-sm"
        style={{ backgroundColor: getHouseColor(houseColors, houseId) }}
      />
      <span className="font-semibold truncate">{apartmentName}</span>
    </div>
  );
};
