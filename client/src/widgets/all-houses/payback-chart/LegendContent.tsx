import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/utils/cn';
import { PaybackChartData } from '@/types/core/payback-chart';

type Props = {
  apartmentsData: PaybackChartData[];
  activeApartment: string | null;
  onApartmentClick: (id: string) => void;
};

export const LegendContent = ({ apartmentsData, activeApartment, onApartmentClick }: Props) => {
  return (
    <div className="flex flex-col items-start justify-start py-3 px-1 w-full overflow-visible">
      <div className="flex flex-nowrap items-center justify-start gap-4 min-w-max">
        {apartmentsData.map(apt => (
          <Button
            variant="icon"
            key={apt.id}
            onClick={() => onApartmentClick(apt.id)}
            className={cn(
              'flex items-center cursor-pointer transition-opacity duration-200 select-none p-0',
              'flex-shrink-0',
              activeApartment && activeApartment !== apt.id && 'opacity-30',
            )}
          >
            <div
              className="w-2 h-2 rounded-sm mr-1.5 flex-shrink-0"
              style={{ backgroundColor: apt.color }}
            />

            <span
              className={cn(
                'text-xs sm:text-sm whitespace-nowrap',
                activeApartment === apt.id && 'font-semibold',
              )}
            >
              {apt.apartmentName}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};
