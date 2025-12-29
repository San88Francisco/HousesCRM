import { ReactNode } from 'react';
import { ModalTriggers } from '@/types/model/modals';

export type ActionItem = {
  title: string;
  modalTrigger: ModalTriggers;
  icon: ReactNode;
  description?: string;
};
