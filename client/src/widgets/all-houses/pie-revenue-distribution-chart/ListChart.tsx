import { scrollbarClasses } from '@/shared/constants/styles/scrollbar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';
import { cn } from '@/shared/utils/cn';
import { HouseDistributionDataItemChart } from '@/types/model/revenue-distribution';

export const ListChart = ({ chartData }: { chartData: HouseDistributionDataItemChart[] }) => {
  return (
    <ul
      className={cn(
        'w-full lg:w-[50%] flex flex-col gap-5 max-h-[205px] overflow-y-auto lg:pr-16 xl:pr-0 ',
        scrollbarClasses,
      )}
    >
      {chartData.map(item => (
        <li key={item.id} className="flex items-center justify-between gap-3 pb-1">
          <div className="flex flex-1 items-center gap-2 min-w-0">
            <div className="h-2 w-2 shrink-0 rounded-sm" style={{ backgroundColor: item.fill }} />
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="truncate cursor-default font-semibold">{item.apartmentName}</span>
              </TooltipTrigger>
              <TooltipContent className="bg-foreground">
                <p>{item.apartmentName}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <span className="text-sm text-gray-500 whitespace-nowrap">{item.percentage}%</span>
        </li>
      ))}
    </ul>
  );
};
