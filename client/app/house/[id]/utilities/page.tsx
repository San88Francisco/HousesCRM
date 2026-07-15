import { UtilitiesShell } from '@/widgets/utilities/UtilitiesShell';
import { Suspense } from 'react';

const Page = () => {
  return (
    <section className="flex flex-col gap-8 mb-5 h-full">
      <Suspense>
        <UtilitiesShell />
      </Suspense>
    </section>
  );
};

export default Page;
