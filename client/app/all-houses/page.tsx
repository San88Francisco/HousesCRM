import { ApartmentRentalChart } from '@/widgets/all-houses/chart-houses-overview';
import { CurrencyRevaluationChart } from '@/widgets/all-houses/currency-revaluation-chart/CurrencyRevaluationChart';
import { PaybackChart } from '@/widgets/all-houses/payback-chart/PaybackChart';
import { ChartPieDonutText } from '@/widgets/all-houses/pie-chart-revenue-distribution';

import { TableComponent } from '@/widgets/uikit/table-component/TableComponent';
const Page = () => {
  return (
    <div className="flex flex-col gap-7 w-full mb-7">
      <ApartmentRentalChart />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 w-full">
        <ChartPieDonutText />
        <PaybackChart />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[4fr_1fr] gap-5 w-full">
        <TableComponent />
        <CurrencyRevaluationChart />
      </div>
    </div>
  );
};

export default Page;
