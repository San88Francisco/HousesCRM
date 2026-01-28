'use client';

import { ErrorState } from '@/components/chart-states/ErrorState';
import { Badge } from '@/shared/ui/badge';
import { Skeleton } from '@/shared/ui/skeleton';
import { formatDate } from '@/shared/utils/format/format-date';
import { contractDuration } from '@/shared/utils/table/contract-duration';
import { useGetAllContractsByRenterIdQuery } from '@/store/api/renters-api';
import { ContractStatus } from '@/types/core/status/status';
import {
  CircleCheck,
  CircleDollarSign,
  CircleOff,
  Clock,
  Hourglass,
  UserRound,
} from 'lucide-react';
import { useParams } from 'next/navigation';

export const RenterHeader = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useGetAllContractsByRenterIdQuery(
    {
      renterId: id,
    },
    {
      skip: !id,
    },
  );

  if (isLoading) return <Skeleton className="h-32 w-full" />;
  if (error || !data) return <ErrorState className="w-full" error={error} />;
  const { firstName, lastName, age, occupied, vacated, totalIncome, status } = data.oneRenterReport;

  const isActive = status === ContractStatus.ACTIVE;
  const statusText = isActive ? 'Активний' : 'Неактивний';
  const StatusIcon = isActive ? CircleCheck : CircleOff;

  const items = [
    { key: 'age', Icon: UserRound, text: `${age} років.` },
    {
      key: 'dates',
      Icon: Clock,
      text: isActive
        ? `Проживає з ${formatDate(occupied)} до тепер`
        : `Проживав з ${formatDate(occupied)} по ${formatDate(vacated)}`,
    },
    { key: 'duration', Icon: Hourglass, text: `Загалом ${contractDuration(occupied, vacated)}` },
    { key: 'income', Icon: CircleDollarSign, text: `Прибуток ${totalIncome ?? 0} грн.` },
  ];

  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-semibold leading-tight">
          {firstName} {lastName}
        </h1>
        <Badge variant={isActive ? 'active' : 'inactive'}>{statusText}</Badge>
      </div>
      <div className="flex items-center gap-2 text-sm sm:text-base font-semibold">
        <StatusIcon className="w-4 h-4 sm:w-5 sm:h-5 text-text mt-[2px] opacity-90" />
        <span className="text-text break-words opacity-75">{statusText}</span>
      </div>
      <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-muted-text">
        {items.map(({ key, Icon, text }) => (
          <div key={key} className="flex items-center gap-1 rounded-full bg-muted/60 py-1">
            <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-text opacity-95" />
            <span className="text-text whitespace-nowrap opacity-75">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
