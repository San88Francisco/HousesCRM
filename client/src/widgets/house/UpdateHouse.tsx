'use client';

import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import { useGetHouseByIdQuery } from '@/store/api/houses-api';
import { useAppDispatch } from '@/store/hooks';
import { openModal } from '@/store/slice/modal-slice';
import { House } from '@/types/core/house';
import { ModalTriggers } from '@/types/model/modals';
import { useParams } from 'next/navigation';
import { MouseEvent } from 'react';

export const UpdateHouse = () => {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const dispatch = useAppDispatch();

  const handleEdit = (e: MouseEvent<HTMLButtonElement>, house?: House) => {
    e.currentTarget.blur();

    dispatch(
      openModal({
        trigger: ModalTriggers.EDIT_HOUSE,
        payload: { house },
      }),
    );
  };

  const { data, isLoading, error } = useGetHouseByIdQuery(id, { skip: !id });

  if (isLoading) return <Skeleton className="h-10 w-40" />;

  if (error)
    return (
      <Button disabled className="text-red" variant="outline">
        Помилка завантаження
      </Button>
    );

  return (
    <Button
      variant="outline"
      onClick={e => handleEdit(e, data?.houseDetail)}
      disabled={!data?.houseDetail}
    >
      Відредагувати квартиру
    </Button>
  );
};
