/* eslint-disable */
import { ApartmentItem } from './ApartmentItem';
import { NoContractTooltip } from './NoContractTooltip';
import { LockedApartmentTooltip } from '../LockedApartmentTooltip';
import {
  findGapBetweenContracts,
  isApartmentAcquired,
} from '@/shared/utils/helpers/custom-tooltip-helper';

import { HouseOverviewChartDataItem, TooltipPayload } from '@/types/core/houses-overview/types';
import { isContract } from '@/shared/utils/all-apartments/houses-overview/chart-houses-overview';

type Props = {
  active?: boolean;
  payload?: TooltipPayload[];
  lockedApartment: string | null;
  apartmentsData: HouseOverviewChartDataItem[];
  cursorDate: string;
};

export const CustomTooltip = ({
  active,
  payload,
  lockedApartment,
  apartmentsData,
  cursorDate,
}: Props) => {
  if (!active || !payload || payload.length === 0) return null;

  const allData = payload[0]?.payload;
  if (!allData) return null;

  if (lockedApartment) {
    const apartment = apartmentsData.find(apt => apt.id === lockedApartment);
    if (!apartment) return null;

    if (!isApartmentAcquired(lockedApartment, apartmentsData, cursorDate)) {
      return null;
    }

    const tooltipItem = payload.find(p => p.dataKey === lockedApartment);
    const color = apartment.fill;

    const contractCandidate = allData[`${lockedApartment}_contract`];
    const apartmentName = String(allData[`${lockedApartment}_apartment`] || '');

    if (!isContract(contractCandidate)) {
      const breakInContracts = findGapBetweenContracts(lockedApartment, apartmentsData, cursorDate);

      return (
        <NoContractTooltip
          color={tooltipItem?.stroke || color}
          breakInContracts={breakInContracts}
        />
      );
    }

    return (
      <LockedApartmentTooltip
        color={tooltipItem?.stroke || color}
        apartmentName={apartmentName}
        contract={contractCandidate}
      />
    );
  }

  const acquiredApartments = apartmentsData.filter(apt =>
    isApartmentAcquired(apt.id, apartmentsData, cursorDate),
  );

  if (acquiredApartments.length === 0) return null;

  return (
    <div className="bg-background border border-border rounded-2xl p-3">
      {acquiredApartments.map(apartment => (
        <ApartmentItem
          key={apartment.id}
          apartment={apartment}
          color={apartment.fill}
          allData={allData}
          apartmentsData={apartmentsData}
          cursorDate={cursorDate}
        />
      ))}
    </div>
  );
};
