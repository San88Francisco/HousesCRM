import { HouseActions } from '@/widgets/house/HouseActions';
import { HouseHeader } from '@/widgets/house/HouseHeader';
import { HouseOccupancyCard } from '@/widgets/house/HouseOccupancyCard';
import { HouseStatsCards } from '@/widgets/house/HouseStatsCards';

const Page = () => {
  return (
    <section className="flex flex-col justify-between gap-8 mb-5 h-full">
      <div className="flex flex-col md:gap-14 gap-8 mb-5">
        <HouseHeader />
        <HouseStatsCards />
        <HouseOccupancyCard />
      </div>
      <HouseActions />
    </section>
  );
};

export default Page;
