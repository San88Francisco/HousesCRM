import { ModalTriggers } from '@/types/model/modals/modals';
import { ActionItem } from '@/types/model/sidebar/sidebar-action-item';
import { FileText, Home, UserPlus } from 'lucide-react';

export const actionItems: ActionItem[] = [
  {
    title: 'Додати квартиру',
    modalTrigger: ModalTriggers.ADD_HOUSE,
    icon: <Home className="h-4 w-4" />,
    description: 'Створити нову квартиру',
  },
  {
    title: 'Додати орендаря',
    modalTrigger: ModalTriggers.ADD_RENTER,
    icon: <UserPlus className="h-4 w-4" />,
    description: 'Додати нового орендаря',
  },
  {
    title: 'Додати договір',
    modalTrigger: ModalTriggers.ADD_CONTRACT,
    icon: <FileText className="h-4 w-4" />,
    description: 'Створити новий контракт',
  },
];
