import { ModalTriggers } from '@/types/model/modals';

export type ModalState<T = unknown> = {
  isOpen: boolean;
  trigger: ModalTriggers | null;
  payload?: T;
};
