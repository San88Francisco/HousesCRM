'use client';

import { formatCurrencyOptions } from '@/shared/constants/currency';
import { StatCard } from '@/shared/ui/stat-card';
import { StatsCardsSkeleton } from '@/widgets/skeletons/stats-cards-skeleton';
import { computeHouseStats, formatTotalDays } from '@/shared/utils/house/house-stats';
import { formatCurrency } from '@/shared/utils/table/formatters';
import { useGetHouseByIdQuery } from '@/store/api/houses-api';
import { HouseOccupancyItem } from '@/types/model/houses-occupancy';
import { BedDouble, Clock, TrendingUp } from 'lucide-react';
import { useParams } from 'next/navigation';

export const HouseStatsCards = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useGetHouseByIdQuery(id, { skip: !id });

  if (isLoading) return <StatsCardsSkeleton />;

  const occupancy = (data?.occupancyReports?.data ?? []) as HouseOccupancyItem[];
  const { totalIncome, rentalDays, idleDays } = computeHouseStats(occupancy);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        variant="yellow"
        icon={TrendingUp}
        label="Загальний дохід"
        value={formatCurrency(totalIncome, formatCurrencyOptions)}
        description="За весь час оренди"
      />
      <StatCard
        variant="purple"
        icon={BedDouble}
        label="Час здачі"
        value={formatTotalDays(rentalDays)}
        description="Загальний час оренди"
      />
      <StatCard
        variant="sky"
        icon={Clock}
        label="Час простою"
        value={formatTotalDays(idleDays)}
        description="Загальний час без орендаря"
      />
    </div>
  );
};
