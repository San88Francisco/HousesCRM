'use client';
import { useAnimatedIcon } from '@/hooks';
import { Button } from '@/shared/ui/button';
import { FileChartLineIcon } from '@/shared/ui/file-chart-line-icon-handle';
import { useAppDispatch } from '@/store/hooks';
import { openModal } from '@/store/slice/modal-slice';
import { ModalTriggers } from '@/types/model/modals';
import { MouseEvent } from 'react';

type Props = {
  id: string;
};

export const ContractModalTrigger = ({ id }: Props) => {
  const { animatedIcon, handleMouseEnter, handleMouseLeave } = useAnimatedIcon(
    <FileChartLineIcon />,
  );

  const dispatch = useAppDispatch();

  const handleOpenModal = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    dispatch(
      openModal({
        trigger: ModalTriggers.OPEN_CONTRACTS_LIST,
        payload: {
          id,
        },
      }),
    );
  };

  return (
    <Button
      variant="icon"
      className="p-0 text-text rounded-md [&_svg]:size-5 w-[24px]"
      aria-label="Відкрити договір"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleOpenModal}
    >
      {animatedIcon}
    </Button>
  );
};
