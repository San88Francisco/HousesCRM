/* eslint-disable */
import {
  findGapBetweenContracts,
  isHouseAcquired,
} from '@/shared/utils/helpers/custom-tooltip-helper';
import { NoContractTooltip } from './NoContractTooltip';

import { isContract } from '@/shared/utils/all-house/houses-overview/chart-houses-overview';
import {
  HouseOverviewChartDataItem,
  HouseOverviewTooltipPayload,
} from '@/types/model/houses-overview';
import { LockedHouseTooltip } from '../LockedHouseTooltip';
import { HouseItem } from './HouseItem';

type Props = {
  active?: boolean;
  payload?: HouseOverviewTooltipPayload[];
  lockedHouse: string | null;
  housesData: HouseOverviewChartDataItem[];
  cursorDate: string;
};

export const CustomTooltip = ({ active, payload, lockedHouse, housesData, cursorDate }: Props) => {
  if (!active || !payload || payload.length === 0) return null;

  const allData = payload[0]?.payload;
  if (!allData) return null;

  if (lockedHouse) {
    const apartment = housesData.find(apt => apt.id === lockedHouse);
    if (!apartment) return null;

    if (!isHouseAcquired(lockedHouse, housesData, cursorDate)) {
      return null;
    }

    const tooltipItem = payload.find(p => p.dataKey === lockedHouse);
    const color = apartment.fill;

    const contractCandidate = allData[`${lockedHouse}_contract`];
    const apartmentName = String(allData[`${lockedHouse}_apartment`] || '');

    if (!isContract(contractCandidate)) {
      const breakInContracts = findGapBetweenContracts(lockedHouse, housesData, cursorDate);

      return (
        <NoContractTooltip
          color={tooltipItem?.stroke || color}
          breakInContracts={breakInContracts}
        />
      );
    }

    return (
      <LockedHouseTooltip
        color={tooltipItem?.stroke || color}
        apartmentName={apartmentName}
        contract={contractCandidate}
      />
    );
  }

  const acquiredHouses = housesData.filter(apt => isHouseAcquired(apt.id, housesData, cursorDate));

  if (acquiredHouses.length === 0) return null;

  return (
    <div className="bg-background border border-border rounded-2xl p-3">
      {acquiredHouses.map(apartment => (
        <HouseItem
          key={apartment.id}
          apartment={apartment}
          color={apartment.fill}
          allData={allData}
          housesData={housesData}
          cursorDate={cursorDate}
        />
      ))}
    </div>
  );
};
