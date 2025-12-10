import { CurrencyRevaluationChart } from '@/widgets/all-apartments/currency-revaluation-chart/CurrencyRevaluationChart';
import { ChartPieDonutText } from '@/widgets/all-apartments/pie-chart-revenue-distribution';
const Page = () => {
  return (
    <>
      <CurrencyRevaluationChart />
      <ChartPieDonutText />
    </>
  );
};

export default Page;
