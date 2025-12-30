'use client';

import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { closeModal } from '@/store/slice/modal-slice';
import { ModalTriggers } from '@/types/model/modals/modals';

export const ConfirmDeleteModal = () => {
  const dispatch = useAppDispatch();
  const { isOpen, trigger, payload } = useAppSelector(s => s.modal);

  const isThisModalOpen = isOpen && trigger === ModalTriggers.CONFIRM_DELETE;

  const title = (payload?.title as string) ?? 'Підтвердження видалення';

  const description =
    (payload?.description as string) ?? 'Цю дію неможливо буде скасувати. Ви впевнені?';

  const handleConfirm = () => {
    dispatch(closeModal());
  };

  return (
    <Dialog open={isThisModalOpen} onOpenChange={() => dispatch(closeModal())}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => dispatch(closeModal())}>
            Скасувати
          </Button>

          <Button variant="destructive" onClick={handleConfirm}>
            Видалити
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
