"use client"

import { InfoCardsMini } from '@/components/InfoCardsMini/InfoCardsMini';
import { AllIncomeInMonth } from '@/components/AllIncomeInMonth/AllIncomeInMonth';
import { ContractsChart } from '@/components/Chart/Chart';


const Page = () => {


  return (
    <>
      <InfoCardsMini />
      <ContractsChart />
      <AllIncomeInMonth />
    </>
  )
}

export default Page

