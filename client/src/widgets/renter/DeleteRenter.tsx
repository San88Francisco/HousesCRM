'use client';

import { Button } from '@/shared/ui/button';
import { useAppDispatch } from '@/store/hooks';
import { openModal } from '@/store/slice/modal-slice';
import { ModalTriggers } from '@/types/model/modals';
import { DeleteAction } from '@/types/model/modals/delete-actions';
import { useParams } from 'next/navigation';

const DeleteRenter = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const handleDelete = () => {
    dispatch(
      openModal({
        trigger: ModalTriggers.CONFIRM_DELETE,
        payload: {
          deleteAction: DeleteAction.RENTER,
          entityId: id,
        },
      }),
    );
  };

  return (
    <div>
      <Button variant="destructive" onClick={handleDelete}>
        Видалити
      </Button>
    </div>
  );
};

export default DeleteRenter;
