import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';
import { HouseChartDataItem } from '@/types/core/revenue-distribution/chart-pie-item';

export const ChartList = ({ chartData }: { chartData: HouseChartDataItem[] }) => {
  return (
    <ul className="w-full lg:w-[50%] flex flex-col gap-5 max-h-[205px] overflow-y-auto lg:pr-16 xl:pr-0 2xl:pr-16">
      {chartData.map(item => (
        <li key={item.id} className="flex items-center justify-between gap-3 pb-1">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 shrink-0 rounded-sm" style={{ backgroundColor: item.fill }} />
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="max-w-[180px] truncate cursor-default font-semibold">
                  {item.apartmentName}
                </span>
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
