'use client';

import { useAnimatedIcon } from '@/hooks';
import { Button } from '@/shared/ui/button';
import { SquarePenIcon } from '@/shared/ui/square-pen';
import { cn } from '@/shared/utils/cn';
import { useAppDispatch } from '@/store/hooks';
import { openModal } from '@/store/slice/modal-slice';
import { Renter } from '@/types/core/renter';
import { RentersOccupancyItem } from '@/types/core/renters-occupancy';
import { ModalTriggers } from '@/types/model/modals';
import type { MouseEvent } from 'react';

type Props = {
  renter: RentersOccupancyItem;
  className?: string;
};

export const RenterEditButton = ({ renter, className }: Props) => {
  const dispatch = useAppDispatch();
  const {
    animatedIcon: editAnimatedIcon,
    handleMouseEnter: handleEditIconMouseEnter,
    handleMouseLeave: handleEditIconMouseLeave,
  } = useAnimatedIcon(<SquarePenIcon />);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    dispatch(
      openModal({
        trigger: ModalTriggers.EDIT_RENTER,
        payload: { renter: renter as Renter },
      }),
    );
  };

  return (
    <Button
      type="button"
      variant="icon"
      className={cn(
        'p-0 text-text hover:text-blue rounded-md w-[24px] [&_svg]:size-5 [&_svg]:pointer-events-none',
        className,
      )}
      aria-label="Редагувати орендаря"
      onMouseEnter={handleEditIconMouseEnter}
      onMouseLeave={handleEditIconMouseLeave}
      onClick={handleClick}
    >
      {editAnimatedIcon}
    </Button>
  );
};
