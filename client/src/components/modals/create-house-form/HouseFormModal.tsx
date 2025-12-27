'use client';

import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { RHFForm } from '@/components/RHF/RHForm';
import { useApartmentForm } from '@/hooks/use-house-form';
import { useApartmentModal } from '@/hooks/use-house-modal';
import { ApartmentFormFields } from './HouseFormFields';
import { ModalTriggers } from '@/types/model/modals';
import Modal from '../modal-wrapper';

export const ApartmentFormModal = () => {
  const {
    isEditMode,
    apartmentToEdit,
    handleClose: getHandleClose,
    modalContent,
  } = useApartmentModal();

  const { methods, onSubmit, isLoading, reset } = useApartmentForm({
    isEditMode,
    apartmentToEdit,
    onSuccess: () => getHandleClose(reset),
  });

  const handleClose = () => getHandleClose(reset);

  return (
    <Modal
      triggers={isEditMode ? ModalTriggers.EDIT_APARTMENT : ModalTriggers.ADD_APARTMENT}
      className="max-w-2xl max-h-[90vh] overflow-y-auto"
    >
      <DialogHeader>
        <DialogTitle className="text-lg font-semibold">{modalContent.title}</DialogTitle>
        <DialogDescription className="!mt-0">{modalContent.description}</DialogDescription>
      </DialogHeader>

      <RHFForm form={methods} onSubmit={onSubmit}>
        <ApartmentFormFields isLoading={isLoading} />

        <DialogFooter className="mt-6 px-6 pb-6">
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
