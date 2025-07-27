'use client';

import { InfoCardsMini } from '@/components/InfoCardsMini/InfoCardsMini';
import { AllIncomeInMonth } from '@/components/AllIncomeInMonth/AllIncomeInMonth';
import { ContractsChart } from '@/components/Chart/Chart';

const Page = () => {
  const unusedVar1 = 123; // Цю змінну не використовуємо, має бути помилка
  const unusedVar24 = 123; // Цю змінну не використовуємо, має бути помилка
  const unusedVar34 = 123; // Цю змінну не використовуємо, має бути помилка
  const usedVar = 456;
  console.log(usedVar);

  return (
    <>
      <InfoCardsMini />
      <ContractsChart />
      <AllIncomeInMonth />
    </>
  );
};

export default Page;
