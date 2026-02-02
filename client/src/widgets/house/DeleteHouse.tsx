'use client';

import { Button } from '@/shared/ui/button';
import { useAppDispatch } from '@/store/hooks';
import { openModal } from '@/store/slice/modal-slice';
import { ModalTriggers } from '@/types/model/modals';
import { DeleteAction } from '@/types/model/modals/delete-actions';
import { useParams } from 'next/navigation';

const DeleteHouse = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const handleDelete = () => {
    if (!id) return;
    dispatch(
      openModal({
        trigger: ModalTriggers.CONFIRM_DELETE,
        payload: {
          deleteAction: DeleteAction.HOUSE,
          entityId: id,
        },
      }),
    );
  };

  return (
    <Button variant="destructive" onClick={handleDelete}>
      Видалити
    </Button>
  );
};

export default DeleteHouse;
