'use client';

import { useAnimatedIcon } from '@/hooks';
import { Button } from '@/shared/ui/button';
import { FileTextIcon } from '@/shared/ui/file-text';
import { useAppDispatch } from '@/store/hooks';
import { openModal } from '@/store/modal-slice';
import { ModalTriggers } from '@/types/model/modals';
import { MouseEvent, useEffect } from 'react';

type Props = {
  id: string;

  isHovered?: boolean;
};

export const PdfContractTrigger = ({ id, isHovered }: Props) => {
  const { animatedIcon, handleMouseEnter, handleMouseLeave } = useAnimatedIcon(<FileTextIcon />);

  const dispatch = useAppDispatch();

  const openPdf = (e: MouseEvent) => {
    e.stopPropagation();
    dispatch(
      openModal({
        trigger: ModalTriggers.PDF_CONTRACT,
        payload: { id },
      }),
    );
  };

  useEffect(() => {
    if (isHovered === undefined) return;

    if (isHovered) handleMouseEnter();
    else handleMouseLeave();
  }, [isHovered, handleMouseEnter, handleMouseLeave]);

  return (
    <Button
      variant="icon"
      className="p-0 text-text rounded-md [&_svg]:size-6 w-[24px]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={openPdf}
    >
      {animatedIcon}
    </Button>
  );
};
