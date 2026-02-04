'use client';

import { Button } from '@/shared/ui/button';
import { useGetHouseByIdQuery } from '@/store/api/houses-api';
import { useAppDispatch } from '@/store/hooks';
import { openModal } from '@/store/slice/modal-slice';
import { House } from '@/types/core/house';
import { ModalTriggers } from '@/types/model/modals';
import { useParams } from 'next/navigation';
import { MouseEvent } from 'react';

export const UpdateHouse = () => {
  const { id } = useParams<{ id: string }>();
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

  const { data } = useGetHouseByIdQuery(id);

  return (
    <div>
      <Button
        variant="outline"
        onClick={e => handleEdit(e, data?.houseDetail)}
        disabled={!data?.houseDetail}
      >
        Відредагувати квартиру
      </Button>
    </div>
  );
};
