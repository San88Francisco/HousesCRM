import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';
import { HouseChartDataItem } from '@/types/core/chart-pie-item';

export const ChartList = ({ chartData }: { chartData: HouseChartDataItem[] }) => {
  return (
    <ul className="w-full md:w-[60%] flex flex-col gap-5 max-h-[205px] overflow-y-auto pr-2">
      {chartData.map(item => (
        <li key={item.id} className="flex items-center justify-between gap-2 pb-1">
          <div className="flex items-center gap-2">
            <div
              className="h-2 w-2 shrink-0 rounded-full mt-1"
              style={{ backgroundColor: item.fill }}
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="max-w-[180px] truncate cursor-default">{item.apartmentName}</span>
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
