import { HeaderHouse } from '@/widgets/house/HeaderHouse';
import { TableApartment } from '@/widgets/house/TableApartment';

export default function Page() {
  return (
    <section className="flex flex-col md:gap-14 gap-8 mb-10">
      <HeaderHouse />
      <TableApartment />
    </section>
  );
}
