'use client';

import { RHFForm } from '@/components/RHF/RHForm';
import { useRenterForm } from '@/hooks/modals/renter-create-update-modal/use-renter-form';
import { useRenterModal } from '@/hooks/modals/renter-create-update-modal/use-renter-modal';
import { Button } from '@/shared/ui/button';
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { ModalTriggers } from '@/types/model/modals';
import { RenterFormFields } from '../../../widgets/renter-create-update-modal/RenterFormFields';
import Modal from '../modal-wrapper';

export const RenterCreateUpdateModal = () => {
  const { isEditMode, renterToEdit, handleClose: getHandleClose, modalContent } = useRenterModal();

  const { methods, onSubmit, isLoading, reset } = useRenterForm({
    isEditMode,
    renterToEdit,
    onSuccess: () => handleClose(),
  });

  const handleClose = () => getHandleClose(reset);

  return (
    <Modal
      triggers={isEditMode ? ModalTriggers.EDIT_RENTER : ModalTriggers.ADD_RENTER}
      className="max-w-2xl max-h-[90vh] overflow-y-auto"
    >
      <DialogHeader>
        <DialogTitle className="text-lg font-semibold">{modalContent.title}</DialogTitle>
        <DialogDescription className="!mt-0">{modalContent.description}</DialogDescription>
      </DialogHeader>

      <RHFForm form={methods} onSubmit={onSubmit}>
        <RenterFormFields isLoading={isLoading} />

        <DialogFooter className="mt-6 pb-6">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
            Скасувати
          </Button>
          <Button type="submit" disabled={isLoading}>
            {modalContent.submitText}
          </Button>
        </DialogFooter>
      </RHFForm>
    </Modal>
  );
};
