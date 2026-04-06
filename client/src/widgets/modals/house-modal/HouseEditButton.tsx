'use client';

import { useAnimatedIcon } from '@/hooks';
import { Button } from '@/shared/ui/button';
import { SquarePenIcon } from '@/shared/ui/square-pen';
import { cn } from '@/shared/utils/cn';
import { useLazyGetHouseByIdQuery } from '@/store/api/houses-api';
import { useAppDispatch } from '@/store/hooks';
import { openModal } from '@/store/slice/modal-slice';
import { ModalTriggers } from '@/types/model/modals';
import type { MouseEvent } from 'react';
import { toast } from 'sonner';

type Props = {
  houseId: string;
  className?: string;
};

export const HouseEditButton = ({ houseId, className }: Props) => {
  const dispatch = useAppDispatch();
  const [fetchHouse, { isFetching }] = useLazyGetHouseByIdQuery();
  const {
    animatedIcon: editAnimatedIcon,
    handleMouseEnter: handleEditIconMouseEnter,
    handleMouseLeave: handleEditIconMouseLeave,
  } = useAnimatedIcon(<SquarePenIcon />);

  const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      const res = await fetchHouse(houseId).unwrap();
      dispatch(
        openModal({
          trigger: ModalTriggers.EDIT_HOUSE,
          payload: { house: res.houseDetail },
        }),
      );
    } catch {
      toast.error('Не вдалося завантажити квартиру');
    }
  };

  return (
    <Button
      type="button"
      variant="icon"
      disabled={isFetching}
      className={cn(
        'p-0 text-text hover:text-blue rounded-md w-[24px] [&_svg]:size-5 [&_svg]:pointer-events-none',
        className,
      )}
      aria-label="Редагувати квартиру"
      onMouseEnter={handleEditIconMouseEnter}
      onMouseLeave={handleEditIconMouseLeave}
      onClick={handleClick}
    >
      {editAnimatedIcon}
    </Button>
  );
};
