import { Home, FileText, UserPlus } from 'lucide-react';
import { ModalTriggers } from '@/types/model/modals';
import { ActionItem } from '@/types/model/sidebar-action-item';

export const actionItems: ActionItem[] = [
  {
    title: 'Додати квартиру',
    modalTrigger: ModalTriggers.ADD_APARTMENT,
    icon: <Home className="h-4 w-4" />,
    description: 'Створити нову квартиру',
  },
  {
    title: 'Додати орендаря',
    modalTrigger: ModalTriggers.ADD_TENANT,
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
