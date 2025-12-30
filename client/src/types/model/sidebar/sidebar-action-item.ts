import { ModalTriggers } from '@/types/model/modals/modals';
import { ReactNode } from 'react';

export type ActionItem = {
  title: string;
  modalTrigger: ModalTriggers;
  icon: ReactNode;
  description?: string;
};
