"use client"

import React from 'react'
import { Chart, } from '@/components/Chart/Chart'
import { DateYear } from '@/types';



const mockData = {
  firstLine: {
    "1y": [
      { date: "2024-02-01", value: 5000 },
      { date: "2024-03-01", value: 5100 },
      { date: "2024-04-01", value: 5200 },
      { date: "2024-05-01", value: 5300 },
      { date: "2024-06-01", value: 5400 },
      { date: "2024-07-01", value: 5500 },
      { date: "2024-08-01", value: 5600 },
      { date: "2024-09-01", value: 5700 },
      { date: "2024-10-01", value: 5800 },
      { date: "2024-11-01", value: 5900 },
      { date: "2024-12-01", value: 6000 },
      { date: "2025-01-19", value: 6100 },
    ],
    "5y": [
      { date: "2020-01-01", value: 4000 },
      { date: "2021-01-01", value: 4500 },
      { date: "2022-01-01", value: 5000 },
      { date: "2023-01-01", value: 5500 },
      { date: "2024-01-01", value: 5800 },
      { date: "2025-01-19", value: 6000 },
    ],
    "10y": [
      { date: "2015-01-01", value: 3000 },
      { date: "2016-01-01", value: 3100 },
      { date: "2017-01-01", value: 3500 },
      { date: "2018-01-01", value: 3600 },
      { date: "2019-01-01", value: 4000 },
      { date: "2020-01-01", value: 4500 },
      { date: "2021-01-01", value: 4600 },
      { date: "2022-01-01", value: 5000 },
      { date: "2023-01-01", value: 5500 },
      { date: "2024-01-01", value: 5800 },
      { date: "2025-01-19", value: 6000 },
    ],
    "all": [
      { date: "2005-01-01", value: 2000 },
      { date: "2006-01-01", value: 2100 },
      { date: "2007-01-01", value: 2200 },
      { date: "2008-01-01", value: 2300 },
      { date: "2009-01-01", value: 2400 },
      { date: "2010-01-01", value: 2500 },
      { date: "2011-01-01", value: 2600 },
      { date: "2012-01-01", value: 2700 },
      { date: "2013-01-01", value: 2800 },
      { date: "2014-01-01", value: 2900 },
      { date: "2015-01-01", value: 3000 },
      { date: "2016-01-01", value: 3100 },
      { date: "2017-01-01", value: 3200 },
      { date: "2018-01-01", value: 3300 },
      { date: "2019-01-01", value: 3400 },
      { date: "2020-01-01", value: 3500 },
      { date: "2021-01-01", value: 4000 },
      { date: "2022-01-01", value: 4500 },
      { date: "2023-01-01", value: 5000 },
      { date: "2024-01-01", value: 5500 },
      { date: "2025-01-01", value: 6000 },
      { date: "2026-01-01", value: 6000 },
    ],
  },
  secondLine: {
    "1y": [
      { date: "2024-02-01", value: 5200 },
      { date: "2024-03-01", value: 5300 },
      { date: "2024-04-01", value: 5400 },
      { date: "2024-05-01", value: 5500 },
      { date: "2024-06-01", value: 5600 },
      { date: "2024-07-01", value: 5700 },
      { date: "2024-08-01", value: 5800 },
      { date: "2024-09-01", value: 5900 },
      { date: "2024-10-01", value: 6000 },
      { date: "2024-11-01", value: 6100 },
      { date: "2024-12-01", value: 6200 },
      { date: "2025-01-19", value: 6300 },
    ],
    "5y": [
      { date: "2020-01-01", value: 4200 },
      { date: "2021-01-01", value: 4700 },
      { date: "2022-01-01", value: 5200 },
      { date: "2023-01-01", value: 5700 },
      { date: "2024-01-01", value: 6000 },
      { date: "2025-01-19", value: 6200 },
    ],
    "10y": [
      { date: "2015-01-01", value: 3200 },
      { date: "2016-01-01", value: 3300 },
      { date: "2017-01-01", value: 3700 },
      { date: "2018-01-01", value: 3800 },
      { date: "2019-01-01", value: 4200 },
      { date: "2020-01-01", value: 4700 },
      { date: "2021-01-01", value: 4800 },
      { date: "2022-01-01", value: 5200 },
      { date: "2023-01-01", value: 5700 },
      { date: "2024-01-01", value: 6000 },
      { date: "2025-01-19", value: 6200 },
    ],
    "all": [
      { date: "2005-01-01", value: 2200 },
      { date: "2006-01-01", value: 2300 },
      { date: "2007-01-01", value: 2400 },
      { date: "2008-01-01", value: 2500 },
      { date: "2009-01-01", value: 2600 },
      { date: "2010-01-01", value: 2700 },
      { date: "2011-01-01", value: 2800 },
      { date: "2012-01-01", value: 2900 },
      { date: "2013-01-01", value: 3000 },
      { date: "2014-01-01", value: 3100 },
      { date: "2015-01-01", value: 3200 },
      { date: "2016-01-01", value: 3300 },
      { date: "2017-01-01", value: 3400 },
      { date: "2018-01-01", value: 3500 },
      { date: "2019-01-01", value: 3600 },
      { date: "2020-01-01", value: 3700 },
      { date: "2021-01-01", value: 4200 },
      { date: "2022-01-01", value: 4700 },
      { date: "2023-01-01", value: 5200 },
      { date: "2024-01-01", value: 5700 },
      { date: "2025-01-01", value: 5900 },
      { date: "2026-01-01", value: 6200 },
    ],
  },
  thirdLine: {
    "1y": [
      { date: "2024-02-01", value: 4800 },
      { date: "2024-03-01", value: 4900 },
      { date: "2024-04-01", value: 5000 },
      { date: "2024-05-01", value: 5100 },
      { date: "2024-06-01", value: 5200 },
      { date: "2024-07-01", value: 5300 },
      { date: "2024-08-01", value: 5400 },
      { date: "2024-09-01", value: 5500 },
      { date: "2024-10-01", value: 5600 },
      { date: "2024-11-01", value: 5700 },
      { date: "2024-12-01", value: 5800 },
      { date: "2025-01-19", value: 5900 },
    ],
    "5y": [
      { date: "2020-01-01", value: 3800 },
      { date: "2021-01-01", value: 4300 },
      { date: "2022-01-01", value: 4800 },
      { date: "2023-01-01", value: 5300 },
      { date: "2024-01-01", value: 5500 },
      { date: "2025-01-19", value: 5800 },
    ],
    "10y": [
      { date: "2015-01-01", value: 2800 },
      { date: "2016-01-01", value: 2900 },
      { date: "2017-01-01", value: 3300 },
      { date: "2018-01-01", value: 3400 },
      { date: "2019-01-01", value: 3800 },
      { date: "2020-01-01", value: 4300 },
      { date: "2021-01-01", value: 4400 },
      { date: "2022-01-01", value: 4800 },
      { date: "2023-01-01", value: 5300 },
      { date: "2024-01-01", value: 5500 },
      { date: "2025-01-01", value: 5700 },
    ],
    "all": [
      { date: "2005-01-01", value: 1800 },
      { date: "2006-01-01", value: 1900 },
      { date: "2007-01-01", value: 2000 },
      { date: "2008-01-01", value: 2100 },
      { date: "2009-01-01", value: 2400 },
      { date: "2010-01-01", value: 2500 },
      { date: "2011-01-01", value: 2600 },
      { date: "2012-01-01", value: 2700 },
      { date: "2013-01-01", value: 2800 },
      { date: "2014-01-01", value: 2900 },
      { date: "2015-01-01", value: 3000 },
      { date: "2016-01-01", value: 3100 },
      { date: "2017-01-01", value: 3200 },
      { date: "2018-01-01", value: 3300 },
      { date: "2019-01-01", value: 3400 },
      { date: "2020-01-01", value: 3500 },
      { date: "2021-01-01", value: 4000 },
      { date: "2022-01-01", value: 4500 },
      { date: "2023-01-01", value: 5000 },
      { date: "2024-01-01", value: 5500 },
      { date: "2025-01-01", value: 5800 },
      { date: "2026-01-01", value: 6000 },
    ],
  },
}


const Page = () => {
  const descriptions: {
    "1y": string;
    "5y": string;
    "10y": string;
    all: string;
  } = {
    "1y": "Історичні дані про ціни за останній рік",
    "5y": "Історичні дані про ціни за останні 5 років",
    "10y": "Історичні дані про ціни за останні 10 років",
    "all": "Історичні дані про ціни за весь час",
  };

  const getDescription = (range: DateYear) => descriptions[range];

  return (
    <div className=" p-4">
      <h1 className="text-2xl font-bold">Apartment Price Comparison</h1>
      <Chart data={mockData} title='таблиця' description={getDescription} yAxisLabel='курс' />
    </div>
  )
}

export default Page

