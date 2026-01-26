import { HouseHeader } from '@/widgets/house/HouseHeader';
import { HouseOccupancy } from '@/widgets/house/HouseOccupancy';

export default function Page() {
  return (
    <section className="flex flex-col md:gap-14 gap-8 mb-10">
      <HouseHeader />
      <HouseOccupancy />
    </section>
  );
}
