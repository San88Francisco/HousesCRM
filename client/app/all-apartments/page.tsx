"use client"

import React from 'react'
import { Chart, } from '@/components/Chart/Chart'
import { InfoCardsMini } from '@/components/InfoCardsMini/InfoCardsMini';
import { AllIncomeInMonth } from '@/components/AllIncomeInMonth/AllIncomeInMonth';
import { getDescription } from '@/constants/allApartmentsDescriptionChart/allApartmentsDescriptionChart';
import { mockData } from '@/constants/mockDataAll';






const Page = () => {

  return (
    <>
      <InfoCardsMini />
      <Chart data={mockData} title='Статистика оренди по квартирам' description={getDescription} />
      <AllIncomeInMonth />
    </>
  )
}

export default Page

