import { CurrencyRevaluationChart } from '@/widgets/all-apartments/currency-revaluation-chart/CurrencyRevaluationChart';
import { ChartPieDonutText } from '@/widgets/all-apartments/pie-chart-revenue-distribution';
import { ApartmentRentalChart } from '@/widgets/uikit/line-chart-component';
const Page = () => {
  return (
    <div className="p-6 flex flex-col gap-6">
      <ApartmentRentalChart />
      <CurrencyRevaluationChart />
      <ChartPieDonutText />
    </div>
  );
};

export default Page;
