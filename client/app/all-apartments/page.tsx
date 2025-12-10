import { ChartPieDonutText } from '@/widgets/all-apartments/pie-chart-revenue-distribution';
import { ApartmentRentalChart } from '@/widgets/uikit/line-chart-component';

const Page = () => {
  return (
    <div className="pt-6 flex flex-col gap-6">
      <ApartmentRentalChart />
      <ChartPieDonutText />
    </div>
  );
};

export default Page;
