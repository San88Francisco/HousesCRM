import { HeaderApartment } from '@/widgets/house/HeaderApartment';
import { TableApartment } from '@/widgets/house/TableApartment';

export default function Page() {
  return (
    <section className="flex flex-col md:gap-14 gap-8 mb-10">
      <HeaderApartment />
      <TableApartment />
    </section>
  );
}
