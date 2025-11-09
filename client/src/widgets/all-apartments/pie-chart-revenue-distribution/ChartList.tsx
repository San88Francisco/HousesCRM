import React from 'react';
import { ChartConfig, ChartDataItem } from './type';

interface Props {
  chartConfig: ChartConfig;
  chartData: ChartDataItem[];
}

export const ChartList: React.FC<Props> = ({ chartConfig, chartData }) => {
  const [isDark, setIsDark] = React.useState(false);

  // слухаємо зміни теми
  React.useEffect(() => {
    const checkTheme = () => setIsDark(document.documentElement.classList.contains('dark'));
    checkTheme();

    // якщо тема змінюється під час роботи
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {Object.entries(chartConfig).map(([key, item]) => {
        const match = chartData.find(d => d.apartmentName === item.label);
        const color = item.theme && isDark ? item.theme.dark : item.theme?.light;

        return (
          <li key={key} className="flex items-center justify-between gap-2 pb-1">
            <div className="flex items-center gap-2">
              <div
                className="h-2 w-2 shrink-0 rounded-full mt-1"
                style={{ backgroundColor: color }}
              />
              <span className="max-w-[180px] truncate" title={item.label as string}>
                {item.label}
              </span>
            </div>

            {match && (
              <span className="text-sm text-gray-500 whitespace-nowrap">{match.percentage}%</span>
            )}
          </li>
        );
      })}
    </>
  );
};
