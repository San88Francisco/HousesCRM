import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/utils/cn';
import { getPaletteColors } from '@/shared/utils/houses-overview/colors';
import { Apartment } from '@/types/core/houses-overview/types';

type Props = {
  apartmentsData: Apartment[];
  activeApartment: string | null;
  onApartmentClick: (id: string) => void;
};

const colors = getPaletteColors();

export const LegendContent = ({ apartmentsData, activeApartment, onApartmentClick }: Props) => (
  <div className="flex  max-[420px]:flex-col max-[420px]:items-center justify-center  sm:pt-10 pt-4 sm:px-10 px-1 pb-3">
    <div className="w-max mx-auto flex flex-wrap max-[420px]:flex-col items-start justify-center min-[420.5px]:gap-7 gap-3">
      {apartmentsData.map((apt, idx) => (
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
            className="w-2.5 h-2.5 rounded-sm mr-1.5 flex-shrink-0"
            style={{ backgroundColor: colors[idx % colors.length] }}
          />

          <span className={cn('text-xs md:text-sm', activeApartment === apt.id && 'font-semibold')}>
            {apt.apartmentName}
          </span>
        </Button>
      ))}
    </div>
  </div>
);
