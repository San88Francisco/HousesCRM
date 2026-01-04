'use client';
import { Button } from '@/shared/ui/button';
import { useAppDispatch } from '@/store/hooks';
import { openModal } from '@/store/slice/modal-slice';
import { ModalTriggers } from '@/types/model/modals/modals';

export const ModalTrigger = () => {
  const dispatch = useAppDispatch();

  const handleOpenDeleteModal = () => {
    dispatch(
      openModal({
        trigger: ModalTriggers.CONFIRM_DELETE,
        payload: {
          title: 'Видалити користувача?',
          description: `Користувача буде видалено безповоротно.`,
        },
      }),
    );
  };

  return (
    <Button className="w-[150px] mb-5" onClick={handleOpenDeleteModal}>
      Modal Trigger
    </Button>
  );
};
