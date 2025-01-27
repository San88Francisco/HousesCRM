import { getDescription } from "@/constants/allApartmentsDescriptionPieChart/allApartmentsDescriptionPieChart";
import { PieChart } from "../PieChart/PieChart";
import { mockDataMonth } from "@/constants/mockDataAllMounth";

export const AllIncomeInMonth = () => {
  return <>
    <PieChart data={mockDataMonth} title='Статистика доходу по квартирам' description={getDescription} />
  </>;
};
