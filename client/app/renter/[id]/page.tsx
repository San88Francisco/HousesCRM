import { HeaderRenter } from '@/widgets/all-houses/renter/HeaderRenter';
import { TableRenter } from '@/widgets/all-houses/renter/TableRenter';

export default function Page() {
  return (
    <section className="flex flex-col md:gap-14 gap-8 mb-10">
      <HeaderRenter />
      <TableRenter />
    </section>
  );
}
