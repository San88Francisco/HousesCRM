'use client';

import { RHFForm } from '@/components/RHF/RHForm';
import { useHouseForm } from '@/hooks/modals/house-create-update-modal/use-house-form';
import { useHouseModal } from '@/hooks/modals/house-create-update-modal/use-house-modal';
import { Button } from '@/shared/ui/button';
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { ModalTriggers } from '@/types/model/modals';
import { HouseFormFields } from '@/widgets/house-create-update-modal/HouseFormFields';
import Modal from '../modal-wrapper';

export const HouseCreateUpdateModal = () => {
  const { isEditMode, houseToEdit, handleClose: getHandleClose, modalContent } = useHouseModal();

  const { methods, onSubmit, isLoading, reset } = useHouseForm({
    isEditMode,
    houseToEdit,
    onSuccess: () => handleClose(),
  });

  const handleClose = () => getHandleClose(reset);

  return (
    <Modal
      triggers={isEditMode ? ModalTriggers.EDIT_HOUSE : ModalTriggers.ADD_HOUSE}
      className="max-w-2xl max-h-[90vh] overflow-y-auto"
    >
      <DialogHeader>
        <DialogTitle className="text-lg font-semibold">{modalContent.title}</DialogTitle>
        <DialogDescription className="!mt-0">{modalContent.description}</DialogDescription>
      </DialogHeader>

      <RHFForm form={methods} onSubmit={onSubmit}>
        <HouseFormFields isLoading={isLoading} />

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
