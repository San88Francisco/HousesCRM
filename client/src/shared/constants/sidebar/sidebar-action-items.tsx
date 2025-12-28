import { ModalTriggers } from '@/types/model/modals';
import { ActionItem } from '@/types/model/sidebar-action-item';
import { FileText, Home, UserPlus } from 'lucide-react';

export const actionItems: ActionItem[] = [
  {
    title: 'Створити нову квартиру',
    modalTrigger: ModalTriggers.ADD_HOUSE,
    icon: <Home className="h-4 w-4" />,
  },
  {
    title: 'Створити нового орендаря',
    modalTrigger: ModalTriggers.ADD_RENTER,
    icon: <UserPlus className="h-4 w-4" />,
  },
  {
    title: 'Створити новий договір',
    modalTrigger: ModalTriggers.ADD_CONTRACT,
    icon: <FileText className="h-4 w-4" />,
  },
];
