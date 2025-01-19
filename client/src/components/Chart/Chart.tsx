"use client"

import { useState, useMemo, useEffect } from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
  description: (range: string) => string
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

const monthNames = [
  "Січ", "Лют", "Бер", "Кві", "Тра", "Чер",
  "Лип", "Сер", "Вер", "Жов", "Лис", "Гру"
]

const findBestDivisor = (length: number): number => {
  const targetDivisor = 10;
  let bestDivisor = 1;
  let smallestDifference = Infinity;

  for (let i = 1; i <= length; i++) {
    if (length % i === 0) {
      const difference = Math.abs(i - targetDivisor);
      if (difference < smallestDifference) {
        smallestDifference = difference;
        bestDivisor = i;
      }
    }
  }

  return bestDivisor;
}

const calculateOptimalTickCount = (dataLength: number, selectedRange: string, isSmallScreen: boolean): number => {
  if (selectedRange === "1y" && dataLength === 12) {
    return isSmallScreen ? 6 : 12;
  }
  if (selectedRange === "10y" && !isSmallScreen) {
    return dataLength;
  }
  if (selectedRange === "all") {
    return isSmallScreen ? 5 : findBestDivisor(dataLength);
  }
  return isSmallScreen ? 6 : dataLength;
}

export const Chart: React.FC<ChartProps> = ({
  data,
  title,
  description,
  yAxisLabel,
}) => {
  const [selectedRange, setSelectedRange] = useState("5y")
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 550)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const chartData = useMemo(() => {
    const allDates = new Set<string>()
    Object.values(data).forEach(lineData => {
      lineData[selectedRange].forEach(point => allDates.add(point.date))
    })

    return Array.from(allDates).sort().map(date => {
      const point: { [key: string]: any } = { date }
      Object.entries(data).forEach(([lineName, lineData]) => {
        const dataPoint = lineData[selectedRange].find(p => p.date === date)
        if (dataPoint) {
          point[lineName] = dataPoint.value
        }
      })
      return point
    })
  }, [data, selectedRange])

  const getEvenlyDistributedTicks = (data: any[]): string[] => {
    if (!data.length) return [];
    if (data.length === 1) return [data[0].date];

    let optimalTickCount: number;

    if (selectedRange === "all" && !isSmallScreen) {
      optimalTickCount = findBestDivisor(data.length);
    } else {
      optimalTickCount = calculateOptimalTickCount(data.length, selectedRange, isSmallScreen);
    }

    const step = (data.length - 1) / (optimalTickCount - 1);
    const ticks: string[] = [];

    for (let i = 0; i < optimalTickCount; i++) {
      const index = Math.round(i * step);
      ticks.push(data[index].date);
    }

    // Ensure the last tick is always the last date in the data
    if (ticks[ticks.length - 1] !== data[data.length - 1].date) {
      ticks[ticks.length - 1] = data[data.length - 1].date;
    }

    return ticks;
  }

  const formatXAxisTick = (tickItem: string) => {
    const date = new Date(tickItem)
    if (selectedRange === "1y") {
      return monthNames[date.getMonth()]
    }
    return date.getFullYear().toString()
  }

  const ticks = useMemo(() => getEvenlyDistributedTicks(chartData), [
    chartData,
    selectedRange,
    isSmallScreen
  ]);

  return (
    <Card className="w-full">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-lg sm:text-xl font-semibold">{title}</CardTitle>
        <CardDescription className="text-sm">{description(selectedRange)}</CardDescription>
      </CardHeader>
      <CardContent className="p-2 sm:p-4 h-[240px] w-full sm:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#A8DADC" opacity={0.3} />
            <XAxis
              dataKey="date"
              tickFormatter={formatXAxisTick}
              stroke="#1D3557"
              tick={{ fill: "#1D3557", fontSize: 10 }}
              ticks={ticks}
            />
            <YAxis
              stroke="#1D3557"
              tick={{ fill: "#1D3557", fontSize: 10 }}
              width={30}
            />
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
        <Select value={selectedRange} onValueChange={setSelectedRange}>
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

