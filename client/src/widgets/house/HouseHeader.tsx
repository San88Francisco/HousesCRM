'use client';

import { PROPERTY_TYPE_MAP } from '@/shared/constants/house/house-type-map';
import { formatDate } from '@/shared/utils/format';
import { useGetHouseByIdQuery } from '@/store/api/houses-api';
import { Building2, DoorOpen, MapPin, PackagePlus, Ruler } from 'lucide-react';
import { useParams } from 'next/navigation';
import { HouseOccupancyHeaderSkeleton } from '../skeletons/house-occupancy/RenterHeaderSkeleton';

export const HouseHeader = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useGetHouseByIdQuery(id, {
    skip: !id,
  });

  if (isLoading) return <HouseOccupancyHeaderSkeleton />;
  if (error || !data) return <div>Щось пішло не так</div>;

  const { street, roomsCount, totalArea, floor, apartmentName, purchaseDate, apartmentType } =
    data.houseDetail;

  const { label, icon: TypeIcon } = PROPERTY_TYPE_MAP[apartmentType];

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
        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-text mt-[2px] opacity-90" />
        <span className="text-text break-words opacity-75">{street}</span>
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-5 text-xs sm:text-sm text-text">
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
