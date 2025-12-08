/* eslint-disable */
import { isContract } from '@/shared/utils/line-chart/line-chart';
import {
  isApartmentAcquired,
  findGapBetweenContracts,
} from '../../../shared/utils/helpers/custom-tooltip-helper';
import { Apartment, TooltipPayload } from '@/types/core/line-chart';
import { NoContractTooltip } from './noContractTooltip';
import { LockedApartmentTooltip } from '../lockedApartmenttToltip';
import { ApartmentItem } from './apartmentItem';
import { getPaletteColors } from '@/shared/utils/line-chart/colors';

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

  if (lockedApartment) {
    if (!isApartmentAcquired(lockedApartment, apartmentsData, cursorDate)) {
      return null;
    }

    const item = payload.find(p => p.dataKey === lockedApartment);
    const apartmentIndex = apartmentsData.findIndex(apt => apt.id === lockedApartment);
    const color = colors[apartmentIndex % colors.length];

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
    const color = colors[realIdx % colors.length];

    return { apt, color };
  });

  return (
    <div className="bg-text border ...">
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
