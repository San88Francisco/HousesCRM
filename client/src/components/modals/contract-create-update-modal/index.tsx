'use client';

import { Modal } from '@/components/modals/modal-wrapper';
import { RHFForm } from '@/components/RHF/RHForm';
import { useContractForm, useContractModal } from '@/hooks/modals/contract-create-update-modal';
import { Button } from '@/shared/ui/button';
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { ModalTriggers } from '@/types/model/modals';
import { ContractFormFields } from '@/widgets/modals/contract-create-update-modal';

export const ContractCreateUpdateModal = () => {
  const {
    isEditMode,
    contractToEdit,
    handleClose: getHandleClose,
    modalContent,
  } = useContractModal();

  const { methods, onSubmit, isLoading, reset } = useContractForm({
    isEditMode,
    contractToEdit,
    onSuccess: () => handleClose(),
  });

  const handleClose = () => getHandleClose(reset);

  const {
    formState: { isDirty },
  } = methods;

  return (
    <Modal
      triggers={isEditMode ? ModalTriggers.EDIT_CONTRACT : ModalTriggers.ADD_CONTRACT}
      className="max-w-2xl max-h-[90vh] overflow-y-auto"
      onClose={handleClose}
    >
      <DialogHeader>
        <DialogTitle className="text-lg font-semibold">{modalContent.title}</DialogTitle>
        <DialogDescription className="!mt-0">{modalContent.description}</DialogDescription>
      </DialogHeader>

      <RHFForm form={methods} onSubmit={onSubmit}>
        <ContractFormFields
          isLoading={isLoading}
          initialHouse={contractToEdit?.house}
          initialRenter={contractToEdit?.renter}
        />

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
