'use client';

import { Dialog, DialogContent } from '@/shared/ui/dialog';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { closeModal } from '@/store/slice/modal-slice';
import { ModalTriggers } from '@/types/model/modals/modals';
import { clsx } from 'clsx';
import { ComponentProps, ReactNode, useCallback } from 'react';

interface ModalProps extends ComponentProps<typeof DialogContent> {
  children: ReactNode[] | ReactNode;
  triggers: ModalTriggers;
  onClose?: () => void;
}

export default function Modal({ children, triggers, className, onClose, ...props }: ModalProps) {
  const dispatch = useAppDispatch();

  const isOpen = useAppSelector(state => state.modal.isOpen);
  const activeTrigger = useAppSelector(state => state.modal.trigger);

  const opened = isOpen && activeTrigger === triggers;

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        dispatch(closeModal());
        onClose?.();
      }
    },
    [dispatch, onClose],
  );

  return (
    <Dialog open={opened} onOpenChange={handleOpenChange}>
      <DialogContent
        onOpenAutoFocus={e => e.preventDefault()}
        className={clsx(
          'max-w-full bottom-0 top-auto sm:bottom-auto sm:top-[50%] translate-y-0 sm:translate-y-[-50%] rounded-b-none sm:rounded-lg border-0 outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0',
          className,
        )}
        {...props}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}
