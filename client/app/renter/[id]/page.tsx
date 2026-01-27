import { RenterHeader } from '@/widgets/renter/RenterHeader';
import { RenterReportCard } from '@/widgets/renter/RenterReportCard';

export default function Page() {
  return (
    <section className="flex flex-col md:gap-14 gap-8 mb-10">
      <RenterHeader />
      <RenterReportCard />
    </section>
  );
}
