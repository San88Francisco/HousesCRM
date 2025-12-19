import { HeaderApartment } from '@/widgets/apartment/HeaderApartment';
import { TableApartment } from '@/widgets/apartment/TableApartment';

export default function Page() {
  return (
    <div className="flex flex-col md:gap-14 gap-8 mb-10">
      <HeaderApartment />
      <TableApartment />
    </div>
  );
}
