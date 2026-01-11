'use client';

import { PAGE_LIMIT } from '@/shared/constants/renter';
import { useGetAllContractsByRenterIdQuery } from '@/store/renters-api';
import { Building2, DoorOpen, MapPin, PackagePlus, Ruler } from 'lucide-react';
import { useParams } from 'next/navigation';

export const HeaderRenter = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useGetAllContractsByRenterIdQuery(
    {
      renterId: id,
      page: 1,
      limit: PAGE_LIMIT,
      sortBy: 'commencement',
      order: 'DESC',
    },
    {
      skip: !id,
    },
  );

  if (isLoading) return <div>Loading...</div>;
  if (error || !data) return <div>Щось пішло не так</div>;

  const { firstName, lastName, age, occupied, vacated, totalIncome, status } = data.oneRenterReport;

  const items = [
    { Icon: DoorOpen, text: `${occupied} кімн.` },
    { Icon: Ruler, text: `${vacated} м²` },
    { Icon: Building2, text: `${totalIncome} поверх` },
    { Icon: PackagePlus, text: `Куплено ${status}` },
  ];

  return (
    <div className="space-y-2 sm:space-y-3">
      <h1 className="text-xl sm:text-2xl font-semibold leading-tight">
        {firstName} {lastName}
      </h1>

      <div className="flex items-start gap-2 text-sm sm:text-base font-semibold">
        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-muted-text mt-[2px]" />
        <span className="text-gray-medium break-words">{age}</span>
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-muted-text">
        {items.map(({ Icon, text }) => (
          <div key={text} className="flex items-center gap-1 rounded-full bg-muted/60 px-2 py-1">
            <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-text" />
            <span className="text-gray-medium whitespace-nowrap">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
