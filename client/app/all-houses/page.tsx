import { CurrencyRevaluationChart } from '@/widgets/all-houses/currency-revaluation-chart/CurrencyRevaluationChart';
import { HouseRentalChart } from '@/widgets/all-houses/houses-overview-chart/HouseRentalChart';
import { HousesPerformanceAnalytic } from '@/widgets/all-houses/houses-performance-analytic/HousesPerformanceAnalytic';
import { PaybackChart } from '@/widgets/all-houses/payback-chart/PaybackChart';
import { PieDonutTextChart } from '@/widgets/all-houses/pie-revenue-distribution-chart/PieDonutTextChart';

const Page = () => {
  return (
    <div className="flex flex-col gap-7 w-full mb-7">
      <HouseRentalChart />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 w-full">
        <PieDonutTextChart />
        <PaybackChart />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[4fr_1fr] gap-5 w-full">
        <HousesPerformanceAnalytic />
        <CurrencyRevaluationChart />
      </div>
    </div>
  );
};

export default Page;
