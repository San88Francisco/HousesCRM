import { DateRange, DropdownSelectOption } from "@/types";

export const dateRanges: DropdownSelectOption<DateRange>[] = [
  { label: "1 рік", value: "1y" },
  { label: "5 років", value: "5y" },
  { label: "10 років", value: "10y" },
  { label: "Весь час", value: "all" },
]