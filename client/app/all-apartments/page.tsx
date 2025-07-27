'use client';
import React from "react"; // Якщо React не використовується, це буде помилка

const a = 5;
console.log(a);

import { InfoCardsMini } from '@/components/InfoCardsMini/InfoCardsMini';
import { AllIncomeInMonth } from '@/components/AllIncomeInMonth/AllIncomeInMonth';
import { ContractsChart } from '@/components/Chart/Chart';

const Page = () => {
  const unusedVar1 = 123; // Цю змінну не використовуємо, має бути помилка
  const unusedVar6 = 121231233; // Цю змінну не використовуємо, має бути помилка
  const unusedVar63 = 121231233; // Цю змінну не використовуємо, має бути помилка
  const unusedVar65 = 121231233; // Цю змінну не використовуємо, має бути помилка
  const unusedVar69 = 121231233; // Цю змінну не використовуємо, має бути помилка
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
