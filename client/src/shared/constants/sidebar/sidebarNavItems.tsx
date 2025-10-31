import { Captions } from 'lucide-react';
import { NavItem } from '@/types/navigation';
import { ROUTES } from '@/shared/routes';
import { KeySquareIcon } from '@/shared/ui/key';
import { HomeIcon } from '@/shared/ui/home';
import { UserIcon } from '@/shared/ui/user';

export const itemsNav: NavItem[] = [
  {
    title: 'Всі Квартири',
    url: ROUTES.UIKIT,
    icon: <KeySquareIcon size={16} />,
  },
  {
    title: 'Домашня сторінка',
    url: ROUTES.ALL_APARTMENTS,
    icon: <HomeIcon size={16} />,
  },
  {
    title: 'Логін',
    url: ROUTES.LOGIN,
    icon: <UserIcon size={16} />,
  },
  {
    title: 'Вибрати Квартири',
    items: [
      { title: 'Студії', url: ROUTES.UIKIT },
      { title: '1-кімнатні', url: ROUTES.UIKIT },
      { title: '2-кімнатні', url: ROUTES.UIKIT },
      { title: '3-кімнатні', url: ROUTES.UIKIT },
      { title: '4-кімнатні', url: ROUTES.UIKIT },
      { title: 'Пентхауси', url: ROUTES.UIKIT },
    ],
    icon: <Captions className="h-4 w-4" />,
  },
  {
    title: 'Вибрати Рік',
    items: [
      { title: '2023', url: ROUTES.UIKIT },
      { title: '2024', url: ROUTES.UIKIT },
      { title: '2025', url: ROUTES.UIKIT },
    ],
    icon: <Captions className="h-4 w-4" />,
  },
];
