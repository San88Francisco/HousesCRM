'use client';
import { useAnimatedIcon } from '@/hooks';
import { Button } from '@/shared/ui/button';
import { FileTextIcon } from '@/shared/ui/file-text';
import { useAppDispatch } from '@/store/hooks';
import { openModal } from '@/store/modal-slice';
import { ModalTriggers } from '@/types/model/modals';
import { FC } from 'react';

type Props = {
  id: string;
};

export const PdfContractTriger: FC<Props> = ({ id }) => {
  const { animatedIcon, handleMouseEnter, handleMouseLeave } = useAnimatedIcon(<FileTextIcon />);

  const dispatch = useAppDispatch();

  const handleOpenModal = () => {
    dispatch(
      openModal({
        trigger: ModalTriggers.PDF_CONTRACT,
        payload: {
          id: id,
        },
      }),
    );
  };

  return (
    <Button
      variant="icon"
      className="p-0 text-text rounded-md [&_svg]:size-6 w-[24px]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleOpenModal}
    >
      {animatedIcon}
    </Button>
  );
};
