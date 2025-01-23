"use client"

import { useState, useMemo } from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { DropdownSelect, type DropdownSelectOption } from "../DropdownSelect/DropdownSelect"

type DateRange = "1y" | "5y" | "10y" | "all"

interface YearlyData {
  date: string
  value: number
}

interface ChartProps {
  data: {
    [key: string]: {
      [key in DateRange]: YearlyData[]
    }
  }
  title: string
  description: (range: DateRange) => string
}

const dateRanges: DropdownSelectOption<DateRange>[] = [
  { label: "1 рік", value: "1y" },
  { label: "5 років", value: "5y" },
  { label: "10 років", value: "10y" },
  { label: "Весь час", value: "all" },
]

const chartColors = {
  firstLine: "#457B9D",
  secondLine: "#E63946",
  thirdLine: "#1D3557",
}

const monthNames = ["Січ", "Лют", "Бер", "Кві", "Тра", "Чер", "Лип", "Сер", "Вер", "Жов", "Лис", "Гру"]

export const Chart: React.FC<ChartProps> = ({ data, title, description }) => {
  const [selectedRange, setSelectedRange] = useState<DateRange>("1y")

  const chartData = useMemo(() => {
    const mergedData: { [key: string]: number | string }[] = []
    Object.keys(data).forEach((lineName) => {
      data[lineName][selectedRange].forEach((item, index) => {
        if (!mergedData[index]) {
          mergedData[index] = { date: item.date }
        }
        mergedData[index][lineName] = item.value
      })
    })
    return mergedData
  }, [data, selectedRange])

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

  return (
    <Card className="w-full">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle>
          <h2>{title}</h2>
        </CardTitle>
        <CardDescription>
          <h5>{description(selectedRange)}</h5>
        </CardDescription>
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
            <YAxis stroke="#1D3557" tick={{ fill: "#1D3557", fontSize: 10 }} width={30} />
            <Tooltip />
            <Legend />
            {Object.keys(data).map((lineName) => (
              <Line
                key={lineName}
                type="monotone"
                dataKey={lineName}
                stroke={chartColors[lineName as keyof typeof chartColors]}
                strokeWidth={2}
                dot={false}
                name={lineName}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter className="px-4 sm:px-6 flex justify-end items-center">
        <DropdownSelect<DateRange>
          options={dateRanges}
          value={selectedRange}
          onChange={setSelectedRange}
          className="w-[150px]"
        />
      </CardFooter>
    </Card>
  )
}

