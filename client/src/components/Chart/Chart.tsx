"use client"

import { useState, useMemo, type FC } from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { DropdownSelect } from "../DropdownSelect/DropdownSelect"
import { monthNames } from "@/constants/chart/monthNames"
import { chartColors } from "@/constants/chart/chartColors"
import { dateRanges } from "@/constants/chart/dateRanges"
import type { DateRange, YearlyData } from "@/types"
import { useCurrency } from "@/context/CurrencyContext"
import { nameTranslations } from "@/constants/nameTranslations"
import { getCurrencySymbol } from "@/utils/getCurrencySymbol"
import { formatNumber } from "@/utils/formatNumber"

type Props = {
  data: {
    [key: string]: {
      [key in DateRange]: YearlyData[]
    }
  }
  title: string
  description: (range: DateRange) => string
}

export const Chart: FC<Props> = ({ data, title, description }) => {
  const { selectedCurrency, currencyRate } = useCurrency()
  const [selectedRange, setSelectedRange] = useState<DateRange>("1y")

  const convertCurrency = (value: number) => {
    if (selectedCurrency === "UAH" || !currencyRate) return value
    return value / currencyRate
  }

  const chartData = useMemo(() => {
    const mergedData: { [key: string]: number | string }[] = []
    Object.keys(data).forEach((lineName) => {
      data[lineName][selectedRange].forEach((item, index) => {
        if (!mergedData[index]) {
          mergedData[index] = { date: item.date }
        }
        mergedData[index][lineName] = convertCurrency(item.value)
      })
    })
    return mergedData
  }, [data, selectedRange, selectedCurrency, currencyRate])

  const ticks = useMemo(() => {
    const dataLength = chartData.length
    if (selectedRange === "10y") {
      return chartData.map((item) => item.date)
    } else if (selectedRange === "5y") {
      return chartData.map((item) => item.date)
    } else if (selectedRange === "1y") {
      const tickCount = Math.min(12, dataLength)
      return chartData.filter((_, index) => index % Math.ceil(dataLength / tickCount) === 0).map((item) => item.date)
    } else {
      const tickCount = Math.round(10 / (dataLength / 10))
      return chartData.filter((_, index) => index % tickCount === 0).map((item) => item.date)
    }
  }, [chartData, selectedRange])

  const formatXAxisTick = (tickItem: string) => {
    const date = new Date(tickItem)
    if (selectedRange === "1y") {
      return monthNames[date.getMonth()].slice(0, 3)
    }
    return date.getFullYear().toString()
  }

  const formatYAxis = (value: number) => {
    return `${getCurrencySymbol(selectedCurrency)}${formatNumber(value)}`
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow">
          <p className="font-bold">{label}</p>
          {payload.map((pld: any, index: number) => (
            <p key={index} style={{ color: pld.color }}>
              {nameTranslations[pld.name] || pld.name}: {getCurrencySymbol(selectedCurrency)}
              {formatNumber(pld.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const getLineColor = (index: number) => {
    const colorKeys = Object.keys(chartColors)
    return chartColors[colorKeys[index % colorKeys.length] as keyof typeof chartColors]
  }

  return (
    <Card className="w-full">
      <CardHeader className="px-4 sm:px-6">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <CardTitle>
              <h2>{title}</h2>
            </CardTitle>
            <CardDescription>
              <h5>{description(selectedRange)}</h5>
            </CardDescription>
          </div>
          <DropdownSelect<DateRange>
            options={dateRanges}
            value={selectedRange}
            onChange={setSelectedRange}
            className="w-[150px]"
          />
        </div>
      </CardHeader>

      <CardContent className="p-2 sm:p-4 h-[240px] w-full sm:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 15, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#A8DADC" opacity={0.3} />
            <XAxis
              dataKey="date"
              tickFormatter={formatXAxisTick}
              stroke="#1D3557"
              tick={{ fill: "#1D3557", fontSize: 10 }}
              ticks={ticks}
            />
            <YAxis stroke="#1D3557" tick={{ fill: "#1D3557", fontSize: 10 }} width={50} tickFormatter={formatYAxis} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {Object.keys(data).map((lineName, index) => (
              <Line
                key={lineName}
                type="monotone"
                dataKey={lineName}
                stroke={getLineColor(index)}
                strokeWidth={2}
                dot={{ fill: getLineColor(index), r: 1 }}
                activeDot={{ r: 4, fill: getLineColor(index), stroke: "#fff" }}
                name={nameTranslations[lineName] || lineName}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter className="px-4 sm:px-6 flex justify-end items-center">

      </CardFooter>
    </Card>
  )
}

