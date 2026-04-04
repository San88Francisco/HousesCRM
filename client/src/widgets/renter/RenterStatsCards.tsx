'use client';

import { formatCurrencyOptions } from '@/shared/constants/currency';
import { StatCard } from '@/shared/ui/stat-card';
import { StatsCardsSkeleton } from '@/widgets/skeletons/stats-cards-skeleton';
import { formatTotalDays } from '@/shared/utils/house/house-stats';
import { computeRenterLivedDays } from '@/shared/utils/renter/renter-stats';
import { formatCurrency } from '@/shared/utils/table/formatters';
import { useGetAllContractsByRenterIdQuery } from '@/store/api/renters-api';
import { ContractWithRevenue } from '@/types/core/contract';
import { FileStack, Hourglass, TrendingUp } from 'lucide-react';
import { useParams } from 'next/navigation';

export const RenterStatsCards = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useGetAllContractsByRenterIdQuery(
    { renterId: id ?? '' },
    { skip: !id },
  );

  if (isLoading) return <StatsCardsSkeleton />;

  const report = data?.oneRenterReport;
  const contracts = (data?.allContractsByRenterId?.data ?? []) as ContractWithRevenue[];
  const contractsTotal = data?.allContractsByRenterId?.meta?.total ?? contracts.length;
  const totalIncome = report?.totalIncome ?? 0;
  const livedDays = report ? computeRenterLivedDays(contracts, report.occupied, report.vacated) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        variant="yellow"
        icon={TrendingUp}
        label="Загальний дохід"
        value={formatCurrency(totalIncome, formatCurrencyOptions)}
        description="За всі договори оренди"
      />
      <StatCard
        variant="purple"
        icon={Hourglass}
        label="Час проживання"
        value={formatTotalDays(livedDays)}
        description="Сума тривалості за договорами"
      />
      <StatCard
        variant="sky"
        icon={FileStack}
        label="Договорів"
        value={String(contractsTotal)}
        description="Кількість орендних договорів"
      />
    </div>
  );
};
