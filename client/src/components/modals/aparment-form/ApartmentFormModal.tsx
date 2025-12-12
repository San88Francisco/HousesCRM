'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { RHFForm } from '@/components/RHF/RHForm';
import { useApartmentForm } from '@/hooks/useApartmentForm';
import { useApartmentModal } from '@/hooks/useApartmentModal';
import { ApartmentFormFields } from './ApartmentFormFields';

export const ApartmentFormModal = () => {
  const {
    isThisModalOpen,
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
    <Dialog open={isThisModalOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{modalContent.title}</DialogTitle>
          <DialogDescription>{modalContent.description}</DialogDescription>
        </DialogHeader>

        <RHFForm form={methods} onSubmit={onSubmit}>
          <ApartmentFormFields isLoading={isLoading} />

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Скасувати
            </Button>
            <Button type="submit" disabled={isLoading}>
              {modalContent.submitText}
            </Button>
          </DialogFooter>
        </RHFForm>
      </DialogContent>
    </Dialog>
  );
};
