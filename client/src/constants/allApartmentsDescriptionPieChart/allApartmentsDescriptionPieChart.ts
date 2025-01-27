import { DateYear } from "@/types";
export type DateRangeWithMonth = DateYear | "1m";

const descriptions: Record<DateRangeWithMonth, string> = {
  "1m": "Загальна сума доходу за останній місяць",
  "1y": "Загальна сума доходу за останній рік",
  "5y": "Загальна сума доходу за останні 5 років",
  "10y": "Загальна сума доходу за останні 10 років",
  "all": "Загальна сума доходу за весь час",
};

export const getDescription = (range: DateRangeWithMonth): string => descriptions[range];
