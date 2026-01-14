import { HeaderRenter } from '@/widgets/all-houses/renter/header-renter';
import { RentersReport } from '@/widgets/all-houses/renter/table-renter';

export default function Page() {
  return (
    <section className="flex flex-col md:gap-14 gap-8 mb-10">
      <HeaderRenter />
      <RentersReport />
    </section>
  );
}
