'use client';

import { Modal } from '@/components/modals/modal-wrapper';
import { useConfirmDelete } from '@/hooks/modals/confirm-delete-modal/index';
import { Button } from '@/shared/ui/button';
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { ModalTriggers } from '@/types/model/modals';

export const ConfirmDeleteModal = () => {
  const { title, description, isLoading, handleConfirm, handleClose } = useConfirmDelete();

  return (
    <Modal
      triggers={ModalTriggers.CONFIRM_DELETE}
      onClose={handleClose}
      className="max-w-2xl max-h-[90vh] overflow-y-auto"
    >
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogFooter className="mt-4">
        <Button variant="outline" onClick={handleClose} disabled={isLoading}>
          Скасувати
        </Button>
        <Button variant="destructive" onClick={handleConfirm} disabled={isLoading}>
          {isLoading ? 'Видалення...' : 'Видалити'}
        </Button>
      </DialogFooter>
    </Modal>
  );
};
