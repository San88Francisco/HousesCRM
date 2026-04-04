import { RenterActions } from '@/widgets/renter/RenterActions';
import { RenterHeader } from '@/widgets/renter/RenterHeader';
import { RenterReportCard } from '@/widgets/renter/RenterReportCard';
import { RenterStatsCards } from '@/widgets/renter/RenterStatsCards';

const Page = () => {
  return (
    <section className="flex flex-col justify-between gap-8 mb-5 h-full">
      <div className="flex flex-col md:gap-14 gap-8 mb-5">
        <RenterHeader />
        <RenterStatsCards />
        <RenterReportCard />
      </div>
      <RenterActions />
    </section>
  );
};

export default Page;
