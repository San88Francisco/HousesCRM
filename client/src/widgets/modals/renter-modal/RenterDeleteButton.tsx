'use client';

import { useAnimatedIcon } from '@/hooks';
import { DeleteAction } from '@/shared/constants/delete-actions';
import { deleteIconButtonClass } from '@/shared/constants/styles/delete-icon-button';
import { Button } from '@/shared/ui/button';
import { DeleteIcon } from '@/shared/ui/delete';
import { cn } from '@/shared/utils/cn';
import { useAppDispatch } from '@/store/hooks';
import { openModal } from '@/store/slice/modal-slice';
import { ModalTriggers } from '@/types/model/modals';
import type { MouseEvent } from 'react';

type Props = {
  renterId: string;
  className?: string;
};

export const RenterDeleteButton = ({ renterId, className }: Props) => {
  const dispatch = useAppDispatch();
  const {
    animatedIcon: deleteAnimatedIcon,
    handleMouseEnter: handleDeleteIconMouseEnter,
    handleMouseLeave: handleDeleteIconMouseLeave,
  } = useAnimatedIcon(<DeleteIcon />);

  const handleDeleteClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    dispatch(
      openModal({
        trigger: ModalTriggers.CONFIRM_DELETE,
        payload: {
          deleteAction: DeleteAction.RENTER,
          entityId: renterId,
          skipRedirect: true,
        },
      }),
    );
  };

  return (
    <Button
      type="button"
      variant="icon"
      className={cn(deleteIconButtonClass, className)}
      aria-label="Видалити орендаря"
      onMouseEnter={handleDeleteIconMouseEnter}
      onMouseLeave={handleDeleteIconMouseLeave}
      onClick={handleDeleteClick}
    >
      {deleteAnimatedIcon}
    </Button>
  );
};
