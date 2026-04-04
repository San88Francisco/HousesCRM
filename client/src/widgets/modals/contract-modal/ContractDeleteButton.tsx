'use client';

import { useAnimatedIcon } from '@/hooks';
import { DeleteAction } from '@/shared/constants/delete-actions';
import { Button } from '@/shared/ui/button';
import { DeleteIcon } from '@/shared/ui/delete';
import { cn } from '@/shared/utils/cn';
import { useAppDispatch } from '@/store/hooks';
import { openModal } from '@/store/slice/modal-slice';
import { ModalTriggers } from '@/types/model/modals';
import { MouseEvent } from 'react';

type Props = {
  contractId: string;
  className?: string;
};

export const ContractDeleteButton = ({ contractId, className }: Props) => {
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
          deleteAction: DeleteAction.CONTRACT,
          entityId: contractId,
        },
      }),
    );
  };

  return (
    <Button
      type="button"
      variant="icon"
      className={cn(
        'p-0 text-text hover:text-red rounded-md w-[24px] [&_svg]:size-5 [&_svg]:pointer-events-none',
        className,
      )}
      aria-label="Видалити договір"
      onMouseEnter={handleDeleteIconMouseEnter}
      onMouseLeave={handleDeleteIconMouseLeave}
      onClick={handleDeleteClick}
    >
      {deleteAnimatedIcon}
    </Button>
  );
};
