'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { openModal } from '@/store/modal-slice';
import { SidebarMenuButton, SidebarMenuItem } from '@/shared/ui/sidebar';
import { getSidebarMenuItemClasses } from '@/shared/constants/styles';
import { ActionItem } from '@/types/model/sidebar-action-item';
import { MouseEvent } from 'react';

interface Props {
  item: ActionItem;
}

export const SidebarActionItem = ({ item }: Props) => {
  const dispatch = useAppDispatch();
  const { trigger } = useAppSelector(s => s.modal);

  const isActive = trigger === item.modalTrigger;

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    e.currentTarget.blur();
    dispatch(
      openModal({
        trigger: item.modalTrigger,
      }),
    );
  };

  return (
    <SidebarMenuItem className={getSidebarMenuItemClasses(isActive)}>
      <SidebarMenuButton
        onClick={handleClick}
        tooltip={{
          children: item.description || item.title,
          className: 'bg-text text-background',
        }}
      >
        {item.icon}
        <span>{item.title}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
