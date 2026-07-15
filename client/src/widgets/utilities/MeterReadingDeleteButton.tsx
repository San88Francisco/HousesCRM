'use client';

import { DeleteAction } from '@/shared/constants/delete-actions';
import { deleteIconButtonClass } from '@/shared/constants/styles/delete-icon-button';
import { Button } from '@/shared/ui/button';
import { useAppDispatch } from '@/store/hooks';
import { openModal } from '@/store/slice/modal-slice';
import { ModalTriggers } from '@/types/model/modals';
import { UtilityType } from '@/types/services/meters';
import { Trash2 } from 'lucide-react';

type Props = {
  readingId: string;
  houseId: string;
  utilityType: UtilityType;
};

export const MeterReadingDeleteButton = ({ readingId, houseId, utilityType }: Props) => {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(
      openModal({
        trigger: ModalTriggers.CONFIRM_DELETE,
        payload: {
          deleteAction: DeleteAction.METER_READING,
          entityId: readingId,
          houseId,
          utilityType,
        },
      }),
    );
  };

  return (
    <Button
      type="button"
      variant="icon"
      className={deleteIconButtonClass}
      aria-label="Видалити запис"
      onClick={handleClick}
    >
      <Trash2 size={16} />
    </Button>
  );
};
