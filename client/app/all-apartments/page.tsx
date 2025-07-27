'use client';

import { InfoCardsMini } from '@/components/InfoCardsMini/InfoCardsMini';
import { AllIncomeInMonth } from '@/components/AllIncomeInMonth/AllIncomeInMonth';
import { ContractsChart } from '@/components/Chart/Chart';

const Page = () => {
  const unusedVar1 = 123; // Цю змінну не використовуємо, має бути помилка
  const unusedVar6 = 121231233; // Цю змінну не використовуємо, має бути помилка
  const usedVar = 456;
  console.log(usedVar);

  const unusedVar9 = 12133; // Цю змінну не використовуємо, має бути помилка
  return (
    <>
      <InfoCardsMini />
      <ContractsChart />
      <AllIncomeInMonth />
    </>
  );
};

export default Page;
