import { FilePenLineIcon } from '@/shared/ui/file-pen-line';
import { HomeIcon } from '@/shared/ui/home';
import { UserRoundPlusIcon } from '@/shared/ui/user-round-plus';
import { ModalTriggers } from '@/types/model/modals';
import { ActionItem } from '@/types/model/sidebar';

export const actionItems: ActionItem[] = [
  {
    title: 'Створити нову квартиру',
    modalTrigger: ModalTriggers.ADD_HOUSE,
    icon: <HomeIcon size={16} />,
  },
  {
    title: 'Створити нового орендаря',
    modalTrigger: ModalTriggers.ADD_RENTER,
    icon: <UserRoundPlusIcon size={16} />,
  },
  {
    title: 'Створити новий договір',
    modalTrigger: ModalTriggers.ADD_CONTRACT,
    icon: <FilePenLineIcon size={16} />,
  },
];
