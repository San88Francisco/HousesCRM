'use client';

import { getSidebarMenuItemClasses } from '@/shared/constants/styles';
import { SidebarMenuButton, SidebarMenuItem } from '@/shared/ui/sidebar';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { openModal } from '@/store/slice/modal-slice';
import { ActionItem } from '@/types/model/sidebar/sidebar-action-item';
import { MouseEvent } from 'react';

type Props = {
  item: ActionItem;
};

export const SidebarActionItem = ({ item }: Props) => {
  const dispatch = useAppDispatch();
  const trigger = useAppSelector(s => s.modal.trigger);

  const isActive = trigger === item.modalTrigger;

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    e.currentTarget.blur();

    if (isActive) return;

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
