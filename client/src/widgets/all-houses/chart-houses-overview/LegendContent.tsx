import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/utils/cn';

import { HouseOverviewChartDataItem } from '@/types/model/houses-overview/types';

type Props = {
  apartmentsData: HouseOverviewChartDataItem[];
  activeApartment: string | null;
  onApartmentClick: (id: string) => void;
};

export const LegendContent = ({ apartmentsData, activeApartment, onApartmentClick }: Props) => {
  return (
    <div className="flex  max-[420px]:flex-col max-[420px]:items-center justify-center  sm:pt-10 pt-4 sm:px-10 px-1 pb-3">
      <div className="w-max mx-auto flex flex-wrap max-[420px]:flex-col items-start justify-center min-[420.5px]:gap-7 gap-3">
        {apartmentsData.map(apt => (
          <Button
            variant="icon"
            key={apt.id}
            onClick={() => onApartmentClick(apt.id)}
            className={cn(
              'flex items-center cursor-pointer transition-opacity duration-200 select-none p-0',
              activeApartment && activeApartment !== apt.id && 'opacity-30',
            )}
          >
            <div
              className="w-2 h-2 rounded-sm mr-1.5 flex-shrink-0"
              style={{ backgroundColor: apt.fill }}
            />

            <span
              className={cn('text-xs md:text-sm', activeApartment === apt.id && 'font-semibold')}
            >
              {apt.apartmentName}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};
