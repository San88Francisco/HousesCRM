'use client';

import { Button } from '@/shared/ui/button';
import { useAppDispatch } from '@/store/hooks';
import { useGetRenterByIdQuery } from '@/store/houses-api';
import { openModal } from '@/store/modal-slice';
import { ModalTriggers } from '@/types/model/modals';
import { RenterResponse } from '@/types/model/renter';
import { MouseEvent } from 'react';
import { toast } from 'sonner';

// TODO цей файл тимчасовий. Тут приклад як робити функцію редагування данних існуючої квартири.
// TODO це ID вашого орендаря.
const idRenter = '2c6adabe-d8e7-420b-92c2-fad2ad7b5c3b';

const UpdateRenter = () => {
  const dispatch = useAppDispatch();

  const handleEdit = (e: MouseEvent<HTMLButtonElement>, renter?: RenterResponse) => {
    e.currentTarget.blur();

    if (!renter) {
      toast.error('Не вдалося завантажити дані орендаря');
      return;
    }

    dispatch(
      openModal({
        trigger: ModalTriggers.EDIT_RENTER,
        payload: { renter },
      }),
    );
  };

  const { data /* error, isLoading*/ } = useGetRenterByIdQuery(idRenter);

  return (
    <div className="w-[150px] mb-5">
      <Button onClick={e => handleEdit(e, data?.oneRenterReport)} disabled={!data?.oneRenterReport}>
        Відредагувати орендаря
      </Button>
    </div>
  );
};

export default UpdateRenter;
