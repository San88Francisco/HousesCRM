/* eslint-disable */
import { Apartment, Contract } from '@/types/core/apartment';
import { useCallback } from 'react';

const isContract = (value: unknown): value is Contract => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'renter' in value &&
    'commencement' in value &&
    'termination' in value
  );
};

type PayloadData = {
  [key: string]: Contract | string | null | undefined;
};

type TooltipPayload = {
  dataKey: string;
  payload: PayloadData;
  stroke: string;
};

type Props = {
  active?: boolean;
  payload?: TooltipPayload[];
  lockedApartment: string | null;
  apartmentsData: Apartment[];
  colors: string[];
  cursorDate: number;
};

export const CustomTooltip = ({
  active,
  payload,
  lockedApartment,
  apartmentsData,
  colors,
  cursorDate,
}: Props) => {
  const truncate = useCallback(
    (text: string, maxLen: number) =>
      text.length > maxLen ? text.slice(0, maxLen - 3) + '...' : text,
    [],
  );

  const findGapBetweenContracts = useCallback(
    (
      id: string | null,
      apartments: Apartment[],
      currentDate: number,
    ): { start: string; end: string } | null => {
      if (!id) return null;
      const apartment = apartments.find(apt => apt.id === id);
      if (!apartment) return null;

      const gap = apartment.contracts
        .map((contract, i, arr) => {
          if (i === 0) return null;
          const prev = arr[i - 1];
          const prevEnd = new Date(prev.termination).getTime();
          const currStart = new Date(contract.commencement).getTime();
          return currentDate > prevEnd && currentDate < currStart
            ? { start: contract.commencement, end: prev.termination }
            : null;
        })
        .find(g => g !== null);

      return gap ?? null;
    },
    [apartmentsData],
  );

  if (!active || !payload || payload.length === 0) return null;

  const allData = payload[0]?.payload || {};

  if (lockedApartment) {
    const item = payload.find(p => p.dataKey === lockedApartment);
    const apartmentIndex = apartmentsData.findIndex(apt => apt.id === lockedApartment);
    const color = colors[apartmentIndex % colors.length];

    const contractCandidate = allData[`${lockedApartment}_contract`];
    const apartmentNameCandidate = allData[`${lockedApartment}_apartment`];

    if (!isContract(contractCandidate)) {
      const breakInContracts = findGapBetweenContracts(lockedApartment, apartmentsData, cursorDate);

      return (
        <div className="bg-text border border-gray-200 rounded-lg p-3 shadow-md pointer-events-none max-w-[240px] text-sm">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: item?.stroke || color, flexShrink: 0 }}
            />
            <span className="font-semibold text-red">Відсутній контракт</span>
          </div>

          {breakInContracts && (
            <p className="text-red text-xs">
              {truncate(new Date(breakInContracts.end).toLocaleDateString('uk-UA'), 15)} –{' '}
              {truncate(new Date(breakInContracts.start).toLocaleDateString('uk-UA'), 15)}
            </p>
          )}
        </div>
      );
    }

    const contract = contractCandidate;

    return (
      <div className="bg-text border border-gray-200 rounded-lg p-3 shadow-md pointer-events-none max-w-[240px] text-sm">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: item?.stroke || color, flexShrink: 0 }}
          />
          <span className="font-semibold text-background">
            {String(apartmentNameCandidate || '')}
          </span>
        </div>

        <div className="text-xs">
          <p className="text-background mb-1">
            Орендар: {truncate(contract.renter.lastName + ' ' + contract.renter.firstName, 20)}
          </p>

          <p className="font-bold text-background mb-1">
            Оплата: {contract.monthlyPayment.toLocaleString()} грн/міс
          </p>

          <p className="text-background text-[11px]">
            {truncate(new Date(contract.commencement).toLocaleDateString('uk-UA'), 15)} –{' '}
            {truncate(new Date(contract.termination).toLocaleDateString('uk-UA'), 15)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-text border border-gray-200 rounded-lg p-2 shadow-md pointer-events-none max-w-[240px] text-xs flex flex-col gap-2">
      {apartmentsData.map((apt, idx) => {
        const contractCandidate = allData[`${apt.id}_contract`];
        const color = colors[idx % colors.length];

        const breakInContracts = findGapBetweenContracts(apt.id, apartmentsData, cursorDate);

        if (!isContract(contractCandidate)) {
          return (
            <div key={apt.id} className="mb-1">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-red">Відсутній контракт</span>
              </div>

              <div className="ml-3 text-red" style={{ fontSize: '10px', lineHeight: '1.1' }}>
                {breakInContracts ? (
                  <>
                    {truncate(new Date(breakInContracts.end).toLocaleDateString('uk-UA'), 15)} –{' '}
                    {truncate(new Date(breakInContracts.start).toLocaleDateString('uk-UA'), 15)}
                  </>
                ) : (
                  'Відсутній у цей період'
                )}
              </div>
            </div>
          );
        }

        const contract = contractCandidate;
        const renterName = truncate(contract.renter.lastName + ' ' + contract.renter.firstName, 15);

        return (
          <div key={apt.id} className="mb-1">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-background">{`${renterName}: ${contract.monthlyPayment.toLocaleString()}`}</span>
            </div>

            <div className="ml-3 text-background" style={{ fontSize: '10px', lineHeight: '1.1' }}>
              {truncate(new Date(contract.commencement).toLocaleDateString('uk-UA'), 15)} –{' '}
              {truncate(new Date(contract.termination).toLocaleDateString('uk-UA'), 15)}
            </div>
          </div>
        );
      })}
    </div>
  );
};
