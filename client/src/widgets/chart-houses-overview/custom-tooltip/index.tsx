/* eslint-disable */
import { isContract } from '@/shared/utils/houses-overview/chart-houses-overview';
import { getPaletteColors } from '@/shared/utils/houses-overview/colors';
import { Apartment, TooltipPayload } from '@/types/core/houses-overview/types';
import { ApartmentItem } from './ApartmentItem';
import { NoContractTooltip } from './NoContractTooltip';
import { LockedApartmentTooltip } from '../LockedApartmentTooltip';
import {
  findGapBetweenContracts,
  isApartmentAcquired,
} from '@/shared/utils/helpers/custom-tooltip-helper';

type Props = {
  active?: boolean;
  payload?: TooltipPayload[];
  lockedApartment: string | null;
  apartmentsData: Apartment[];
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

  const allData = payload[0]?.payload || {};

  const colors = getPaletteColors();

  if (colors.length === 0) return null;

  if (lockedApartment) {
    if (!isApartmentAcquired(lockedApartment, apartmentsData, cursorDate)) {
      return null;
    }

    const item = payload.find(p => p.dataKey === lockedApartment);
    const apartmentIndex = apartmentsData.findIndex(apt => apt.id === lockedApartment);
    const color = apartmentIndex >= 0 ? colors[apartmentIndex % colors.length] : colors[0];

    const contractCandidate = allData[`${lockedApartment}_contract`];
    const apartmentName = String(allData[`${lockedApartment}_apartment`] || '');

    if (!isContract(contractCandidate)) {
      const breakInContracts = findGapBetweenContracts(lockedApartment, apartmentsData, cursorDate);
      return (
        <NoContractTooltip color={item?.stroke || color} breakInContracts={breakInContracts} />
      );
    }

    return (
      <LockedApartmentTooltip
        color={item?.stroke || color}
        apartmentName={apartmentName}
        contract={contractCandidate}
      />
    );
  }

  const acquiredApartments = apartmentsData.filter(apt =>
    isApartmentAcquired(apt.id, apartmentsData, cursorDate),
  );

  const preparedApartments = acquiredApartments.map(apt => {
    const realIdx = apartmentsData.findIndex(a => a.id === apt.id);
    const color = realIdx >= 0 ? colors[realIdx % colors.length] : colors[0];

    return { apt, color };
  });

  return (
    <div className="bg-text border rounded-lg p-3">
      {preparedApartments.map(({ apt, color }) => (
        <ApartmentItem
          key={apt.id}
          apartment={apt}
          color={color}
          allData={allData}
          apartmentsData={apartmentsData}
          cursorDate={cursorDate}
        />
      ))}
    </div>
  );
};
