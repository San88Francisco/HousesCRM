/* eslint-disable */

'use client';

import { useState, useMemo, FC } from 'react';
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format, eachMonthOfInterval, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { uk } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Calendar } from 'lucide-react';

import { useGetAllContractsQuery } from '@/store/contracts';
import { ContractPeriod } from '@/types/services/contracts';
import type { UUID } from 'crypto';

type Props = {
  renterId?: UUID;
};

export const ContractsChart: FC<Props> = ({ renterId }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<ContractPeriod>(ContractPeriod.OneYear);

  const { data, isLoading, isFetching, error } = useGetAllContractsQuery({
    period: selectedPeriod,
    renter_id: renterId,
  });

  // const getPeriodLabel = (period: ContractPeriod): string => {
  //   const labels = {
  //     [ContractPeriod.OneMonth]: '1 місяць',
  //     [ContractPeriod.SixMonths]: '6 місяців',
  //     [ContractPeriod.OneYear]: '1 рік',
  //     [ContractPeriod.FiveYears]: '5 років',
  //     [ContractPeriod.TenYears]: '10 років',
  //     [ContractPeriod.FifteenYears]: '15 років',
  //     [ContractPeriod.All]: 'Весь час',
  //   };
  //   return labels[period] || period;
  // };
  const test = 'Auth API Documentation';
  const test = 'Auth API Documentation';

  // Transform contract data for chart visualization
  const chartData = useMemo(() => {
    if (!data?.contracts || !data?.period) {
      return [];
    }

    // Get the period range
    const periodStart = new Date(data.period.startDate);
    const periodEnd = new Date(data.period.endDate);

    // Generate all months in the period
    const monthsInPeriod = eachMonthOfInterval({
      start: periodStart,
      end: periodEnd,
    });

    // Initialize revenue for each month
    const monthlyRevenue: Record<string, number> = {};
    monthsInPeriod.forEach(month => {
      const monthKey = format(month, 'yyyy-MM');
      monthlyRevenue[monthKey] = 0;
    });

    // Calculate revenue for each month based on active contracts
    // Group contracts by property (house_id + renter_id) to handle sequential contracts correctly
    const contractsByProperty: Record<string, typeof data.contracts> = {};

    data.contracts.forEach(contract => {
      const propertyKey = `${contract.renter.house_id}_${contract.renter_id}`;
      if (!contractsByProperty[propertyKey]) {
        contractsByProperty[propertyKey] = [];
      }
      contractsByProperty[propertyKey].push(contract);
    });

    // For each property, calculate revenue month by month
    Object.values(contractsByProperty).forEach(propertyContracts => {
      // Sort contracts by start date
      const sortedContracts = propertyContracts.sort((a, b) => {
        const dateA = new Date(a.adjustedStartDate || a.originalStartDate);
        const dateB = new Date(b.adjustedStartDate || b.originalStartDate);
        return dateA.getTime() - dateB.getTime();
      });

      monthsInPeriod.forEach(month => {
        const monthStart = startOfMonth(month);
        const monthEnd = endOfMonth(month);
        const monthKey = format(month, 'yyyy-MM');

        // Find the active contract for this month (latest contract that covers this month)
        let activeContract = null;

        for (const contract of sortedContracts) {
          const contractStart = new Date(contract.adjustedStartDate || contract.originalStartDate);
          const contractEnd =
            contract.adjustedEndDate === 'now'
              ? new Date()
              : new Date(contract.adjustedEndDate || contract.originalEndDate);

          // Check if contract covers this month (any overlap means full monthly payment)
          const isContractActive =
            isWithinInterval(monthStart, { start: contractStart, end: contractEnd }) ||
            isWithinInterval(monthEnd, { start: contractStart, end: contractEnd }) ||
            (contractStart <= monthStart && contractEnd >= monthEnd) ||
            (contractStart >= monthStart && contractStart <= monthEnd) ||
            (contractEnd >= monthStart && contractEnd <= monthEnd);

          if (isContractActive) {
            activeContract = contract;
          }
        }

        // Add full monthly payment if contract is active during this month
        if (activeContract) {
          monthlyRevenue[monthKey] += activeContract.monthlyPayment;
        }
      });
    });

    // Convert to array format for chart
    return Object.entries(monthlyRevenue)
      .map(([month, revenue]) => ({
        month,
        revenue,
        displayMonth: format(new Date(month + '-01'), 'MMM yyyy', { locale: uk }),
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [data?.contracts, data?.period]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH' }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold text-gray-800">{label}</p>
          {payload.map((pld: any, index: number) => (
            <p key={index} style={{ color: pld.color }} className="text-sm">
              {pld.name}: {formatCurrency(pld.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </div>
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            <Skeleton className="h-20 w-40" />
            <Skeleton className="h-20 w-40" />
            <Skeleton className="h-20 w-40" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Помилка</AlertTitle>
        <AlertDescription>
          Не вдалося завантажити дані контрактів. Спробуйте оновити сторінку.
        </AlertDescription>
      </Alert>
    );
  }

  if (!data || !data.contracts || data.contracts.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle>Контракти</CardTitle>
              <CardDescription>Виберіть період для перегляду даних</CardDescription>
            </div>
            <Select
              value={selectedPeriod}
              onValueChange={value => setSelectedPeriod(value as ContractPeriod)}
            >
              <SelectTrigger className="w-40">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ContractPeriod.OneMonth}>1 місяць</SelectItem>
                <SelectItem value={ContractPeriod.SixMonths}>6 місяців</SelectItem>
                <SelectItem value={ContractPeriod.OneYear}>1 рік</SelectItem>
                <SelectItem value={ContractPeriod.FiveYears}>5 років</SelectItem>
                <SelectItem value={ContractPeriod.TenYears}>10 років</SelectItem>
                <SelectItem value={ContractPeriod.FifteenYears}>15 років</SelectItem>
                <SelectItem value={ContractPeriod.All}>Весь час</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTitle>Немає даних</AlertTitle>
            <AlertDescription>
              Для вибраного періоду немає доступних даних контрактів.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle>Контракти за період: {data.period.description}</CardTitle>
            <CardDescription>
              {format(new Date(data.period.startDate), 'dd.MM.yyyy')} -{' '}
              {format(new Date(data.period.endDate), 'dd.MM.yyyy')}
            </CardDescription>
          </div>
          <Select
            value={selectedPeriod}
            onValueChange={value => setSelectedPeriod(value as ContractPeriod)}
          >
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ContractPeriod.OneMonth}>1 місяць</SelectItem>
              <SelectItem value={ContractPeriod.SixMonths}>6 місяців</SelectItem>
              <SelectItem value={ContractPeriod.OneYear}>1 рік</SelectItem>
              <SelectItem value={ContractPeriod.FiveYears}>5 років</SelectItem>
              <SelectItem value={ContractPeriod.TenYears}>10 років</SelectItem>
              <SelectItem value={ContractPeriod.FifteenYears}>15 років</SelectItem>
              <SelectItem value={ContractPeriod.All}>Весь час</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Всього контрактів</p>
            <p className="text-2xl font-bold">{data.statistics.totalContracts}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Загальний дохід</p>
            <p className="text-2xl font-bold">{formatCurrency(data.statistics.totalRevenue)}</p>
          </div>
          <div className="bg-amber-50 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Середній місячний платіж</p>
            <p className="text-2xl font-bold">
              {formatCurrency(data.statistics.averageMonthlyPayment)}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="displayMonth"
                tick={{ fontSize: 12, fill: '#6B7280' }}
                stroke="#6B7280"
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tickFormatter={value => `₴${value.toLocaleString()}`}
                width={80}
                tick={{ fontSize: 12, fill: '#6B7280' }}
                stroke="#6B7280"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              {/* Reference line for average monthly payment */}
              <ReferenceLine
                y={data.statistics.averageMonthlyPayment}
                stroke="#DC2626"
                strokeDasharray="5 5"
                strokeWidth={2}
                label={{
                  value: `Середній платіж: ${formatCurrency(data.statistics.averageMonthlyPayment)}`,
                  position: 'top',
                  offset: 10,
                  style: {
                    fill: '#DC2626',
                    fontSize: '12px',
                    fontWeight: '500',
                    textAnchor: 'end',
                  },
                }}
              />

              <Line
                type="monotone"
                dataKey="revenue"
                name="Дохід"
                stroke="#457B9D"
                strokeWidth={3}
                dot={{ fill: '#457B9D', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, fill: '#457B9D', stroke: '#FFFFFF', strokeWidth: 2 }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>

      <CardFooter className="text-sm text-muted-foreground">
        {isFetching && 'Оновлення даних...'}
        {chartData.length > 0 && (
          <span className="ml-auto">
            Показано {chartData.filter(item => item.revenue > 0).length} місяців з доходом
          </span>
        )}
      </CardFooter>
    </Card>
  );
}
