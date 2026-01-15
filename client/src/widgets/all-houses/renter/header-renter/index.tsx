'use client';

import { Badge } from '@/shared/ui/badge';
import { formatDate } from '@/shared/utils/format/format-date';
import { contractDuration } from '@/shared/utils/table/contract-duration';
import { useGetAllContractsByRenterIdPaginatedQuery } from '@/store/api/renters-api';
import {
  CircleCheck,
  CircleDollarSign,
  CircleOff,
  Clock,
  Hourglass,
  UserRound,
} from 'lucide-react';
import { useParams } from 'next/navigation';

export const HeaderRenter = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useGetAllContractsByRenterIdPaginatedQuery(
    {
      renterId: id,
    },
    {
      skip: !id,
    },
  );

  if (isLoading) return <div>Loading...</div>;
  if (error || !data) return <div>Щось пішло не так</div>;

  const { firstName, lastName, age, occupied, vacated, totalIncome, status } = data.oneRenterReport;
  const rawDuration = contractDuration(occupied, vacated);

  const monthsMatch = rawDuration.match(/(\d+)\s*міс/);
  const months = monthsMatch ? Number(monthsMatch[1]) : 0;

  const duration = months >= 12 ? `${Math.floor(months / 12)}р ${months % 12}м` : rawDuration;

  const isActive = status === 'active';
  const statusText = isActive ? 'Активний' : 'Неактивний';
  const StatusIcon = isActive ? CircleCheck : CircleOff;

  const items = [
    { Icon: UserRound, text: `${age} років.` },
    {
      Icon: Clock,
      text: isActive
        ? `Проживає з ${formatDate(occupied)} до тепер`
        : `Проживав з ${formatDate(occupied)} по ${formatDate(vacated)}`,
    },
    { Icon: Hourglass, text: `Загалом ${duration}` },
    { Icon: CircleDollarSign, text: `Прибуток ${totalIncome} грн.` },
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
        <span className="text-gray-medium break-words">{statusText}</span>
      </div>
      <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-muted-text">
        {items.map(({ Icon, text }) => (
          <div key={text} className="flex items-center gap-1 rounded-full bg-muted/60 py-1">
            <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-text opacity-95" />
            <span className="text-text whitespace-nowrap opacity-75">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
