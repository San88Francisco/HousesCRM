import { HeaderHouse } from '@/widgets/house/HeaderHouse';
import { TableHouse } from '@/widgets/house/TableHouse';

export default function Page() {
  return (
    <section className="flex flex-col md:gap-14 gap-8 mb-10">
      <HeaderHouse />
      <TableHouse />
    </section>
  );
}
