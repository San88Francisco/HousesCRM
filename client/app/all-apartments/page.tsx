'use client';

// import { InfoCardsMini } from '@/components/InfoCardsMini/InfoCardsMini';
import { AllIncomeInMonth } from '@/components/AllIncomeInMonth/AllIncomeInMonth';
import { ContractsChart } from '@/components/Chart/Chart';
import { DetailedTestComponent } from '@/components/DetailedTestComponent';

import { useAuthGuard } from '@/hooks/useAuthGuard';

const Page = () => {
  const { isLoading } = useAuthGuard();

  if (isLoading) return <div>Завантаження...</div>;

  return (
    <>
      {/* <InfoCardsMini /> */}
      <ContractsChart />
      <AllIncomeInMonth />
      {process.env.NODE_ENV === 'development' && <DetailedTestComponent />}
    </>
  );
};

export default Page;
