'use client';

import { DialogDescription, DialogFooter, DialogHeader } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { RHFForm } from '@/components/RHF/RHForm';
import { useApartmentForm } from '@/hooks/useApartmentForm';
import { useApartmentModal } from '@/hooks/useApartmentModal';
import { ApartmentFormFields } from './ApartmentFormFields';
import { ModalTriggers } from '@/types/model/modals';
import { DialogTitle } from '@radix-ui/react-dialog';
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
      <DialogDescription className="sr-only">{modalContent.description}</DialogDescription>

      <DialogHeader className="p-6">
        <DialogTitle className="text-lg font-semibold mb-4">{modalContent.title}</DialogTitle>

        <RHFForm form={methods} onSubmit={onSubmit}>
          <ApartmentFormFields isLoading={isLoading} />

          <DialogFooter className="mt-6 flex gap-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Скасувати
            </Button>
            <Button type="submit" disabled={isLoading}>
              {modalContent.submitText}
            </Button>
          </DialogFooter>
        </RHFForm>
      </DialogHeader>
    </Modal>
  );
};
