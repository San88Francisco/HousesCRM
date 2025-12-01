import { cn } from '@/shared/utils/cn';
import { Apartment } from '@/types/core/apartment';
import React from 'react';

type Props = {
  apartmentsData: Apartment[];
  colors: string[];
  activeApartment: string | null;
  onApartmentClick: (id: string) => void;
};

export const LegendContent = ({
  apartmentsData,
  colors,
  activeApartment,
  onApartmentClick,
}: Props) => (
  <div className="flex flex-wrap justify-center sm:gap-5 gap-3 sm:pt-10 pt-4 sm:pr-10 sm:pl-10 pb-3 pr-1 pl-1">
    {apartmentsData.map((apt, idx) => (
      <div
        key={apt.id}
        onClick={() => onApartmentClick(apt.id)}
        className={cn(
          'flex items-center cursor-pointer transition-opacity duration-200 select-none',
          activeApartment && activeApartment !== apt.id && 'opacity-30',
        )}
      >
        <div
          className="w-2.5 h-2.5 rounded-sm mr-1.5"
          style={{ backgroundColor: colors[idx % colors.length] }}
        />
        <span
          className={cn(
            'font-normal text-xs md:text-sm',
            activeApartment === apt.id && 'font-semibold',
          )}
        >
          {apt.apartmentName}
        </span>
      </div>
    ))}
  </div>
);
