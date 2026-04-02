'use client';

import { Modal } from '@/components/modals/modal-wrapper';
import { RHFForm } from '@/components/RHF/RHForm';
import { useRenterForm, useRenterModal } from '@/hooks/modals/renter-create-update-modal';
import { Button } from '@/shared/ui/button';
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { ModalTriggers } from '@/types/model/modals';
import { RenterFormFields } from '@/widgets/modals/renter-create-update-modal';

export const RenterCreateUpdateModal = () => {
  const { isEditMode, renterToEdit, handleClose: getHandleClose, modalContent } = useRenterModal();

  const { methods, onSubmit, isLoading, reset } = useRenterForm({
    isEditMode,
    renterToEdit,
    onSuccess: () => handleClose(),
  });

  const handleClose = () => getHandleClose(reset);

  const {
    formState: { isDirty },
  } = methods;

  return (
    <Modal
      triggers={isEditMode ? ModalTriggers.EDIT_RENTER : ModalTriggers.ADD_RENTER}
      className="max-w-2xl max-h-[90vh] overflow-y-auto"
      onClose={handleClose}
    >
      <DialogHeader>
        <DialogTitle className="text-lg font-semibold">{modalContent.title}</DialogTitle>
        <DialogDescription className="!mt-0">{modalContent.description}</DialogDescription>
      </DialogHeader>

      <RHFForm form={methods} onSubmit={onSubmit}>
        <RenterFormFields isLoading={isLoading} />

        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
            {modalContent.cancelText}
          </Button>
          <Button type="submit" disabled={isLoading || (isEditMode && !isDirty)}>
            {modalContent.submitText}
          </Button>
        </DialogFooter>
      </RHFForm>
    </Modal>
  );
};
