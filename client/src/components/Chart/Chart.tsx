"use client"

import { useState, useMemo } from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateYear } from "@/types"

interface YearlyData {
  date: string
  value: number
}

interface ChartProps {
  data: {
    [key: string]: {
      [key: string]: YearlyData[]
    }
  }
  title: string
  description: (range: "1y" | "5y" | "10y" | "all") => string
  yAxisLabel: string
}

const dateRanges = [
  { label: "1Y", value: "1y" },
  { label: "5Y", value: "5y" },
  { label: "10Y", value: "10y" },
  { label: "All", value: "all" },
]

const chartColors = {
  firstLine: "#457B9D",
  secondLine: "#E63946",
  thirdLine: "#1D3557",
}

const monthNames = ["Січ", "Лют", "Бер", "Кві", "Тра", "Чер", "Лип", "Сер", "Вер", "Жов", "Лис", "Гру"]

export const Chart: React.FC<ChartProps> = ({ data, title, description, yAxisLabel }) => {
  const [selectedRange, setSelectedRange] = useState<DateYear>("1y")

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
      // "all"
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
        <CardTitle className="text-lg sm:text-xl font-semibold">{title}</CardTitle>
        <CardDescription className="text-sm">{description(selectedRange)}</CardDescription>
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
      <CardFooter className="px-4 sm:px-6 flex justify-between items-center">
        <span className="text-sm font-medium">{yAxisLabel}</span>
        <Select value={selectedRange} onValueChange={(value: DateYear) => setSelectedRange(value)}>
          <SelectTrigger className="w-[100px] sm:w-[120px]">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            {dateRanges.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

      </CardFooter>
    </Card>
  )
}

