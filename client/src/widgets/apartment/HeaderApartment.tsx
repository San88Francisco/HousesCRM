'use client';

import { useParams } from 'next/navigation';
import { useGetHouseByIdQuery } from '@/store/houses';
import { MapPin, DoorOpen, Ruler, Building2, PackagePlus } from 'lucide-react';
import { formatDate } from '@/shared/utils/format/format-date';
import { APARTMENT_TYPE_MAP } from '@/constants/apartment/apartment-type-map';

export const HeaderApartment = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useGetHouseByIdQuery(id, {
    skip: !id,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error || !data) return <div>Щось пішло не так</div>;

  const detail = data.houseDetail;
  const { street, roomsCount, totalArea, floor, apartmentName, purchaseDate, apartmentType } =
    detail;

  const { label, icon: TypeIcon } = APARTMENT_TYPE_MAP[apartmentType];

  const items = [
    { Icon: DoorOpen, text: `${roomsCount} кімн.` },
    { Icon: Ruler, text: `${totalArea} м²` },
    { Icon: Building2, text: `${floor} поверх` },
    { Icon: PackagePlus, text: `Куплено ${formatDate(purchaseDate)}` },
    { Icon: TypeIcon, text: label },
  ];

  return (
    <div className="space-y-2 sm:space-y-3">
      <h1 className="text-xl sm:text-2xl font-semibold leading-tight">{apartmentName}</h1>

      <div className="flex items-start gap-2 text-sm sm:text-base font-semibold">
        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-muted-text mt-[2px]" />
        <span className="text-gray-medium break-words">{street}</span>
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
