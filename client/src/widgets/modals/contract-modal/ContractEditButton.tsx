'use client';

import { useAnimatedIcon } from '@/hooks';
import { Button } from '@/shared/ui/button';
import { SquarePenIcon } from '@/shared/ui/square-pen';
import { cn } from '@/shared/utils/cn';
import { useLazyGetContractByIdQuery } from '@/store/api/contracts-api';
import { useAppDispatch } from '@/store/hooks';
import { openModal } from '@/store/slice/modal-slice';
import { ModalTriggers } from '@/types/model/modals';
import { MouseEvent } from 'react';
import { toast } from 'sonner';

type Props = {
  contractId: string;
  className?: string;
};

export const ContractEditButton = ({ contractId, className }: Props) => {
  const dispatch = useAppDispatch();
  const [fetchContract, { isFetching }] = useLazyGetContractByIdQuery();
  const {
    animatedIcon: editAnimatedIcon,
    handleMouseEnter: handleEditIconMouseEnter,
    handleMouseLeave: handleEditIconMouseLeave,
  } = useAnimatedIcon(<SquarePenIcon />);

  const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      const contract = await fetchContract(contractId).unwrap();
      dispatch(
        openModal({
          trigger: ModalTriggers.EDIT_CONTRACT,
          payload: { contract },
        }),
      );
    } catch {
      toast.error('Не вдалося завантажити договір');
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
      aria-label="Редагувати договір"
      onMouseEnter={handleEditIconMouseEnter}
      onMouseLeave={handleEditIconMouseLeave}
      onClick={handleClick}
    >
      {editAnimatedIcon}
    </Button>
  );
};
