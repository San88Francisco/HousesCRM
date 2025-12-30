'use client';

import { Button } from '@/shared/ui/button';
import { useGetHouseByIdQuery } from '@/store/api/houses-api';
import { useAppDispatch } from '@/store/hooks';
import { openModal } from '@/store/slice/modal-slice';
import { House } from '@/types/core/house/house';
import { ModalTriggers } from '@/types/model/modals/modals';
import { MouseEvent } from 'react';
import { toast } from 'sonner';

// TODO цей файл тимчасовий. Тут приклад як робити функцію редагування данних існуючої квартири.
const idApartment = '53111308-c9e2-4751-b548-ef20895e58e5';

const UpdateApartment = () => {
  const dispatch = useAppDispatch();

  const handleEdit = (e: MouseEvent<HTMLButtonElement>, house?: House) => {
    e.currentTarget.blur();

    if (!house) {
      toast.error('Не вдалося завантажити дані квартири');
      return;
    }

    dispatch(
      openModal({
        trigger: ModalTriggers.EDIT_HOUSE,
        payload: { house },
      }),
    );
  };

  const { data /* error, isLoading*/ } = useGetHouseByIdQuery(idApartment);

  return (
    <div className="w-[150px] mb-5">
      <Button onClick={e => handleEdit(e, data?.houseDetail)} disabled={!data?.houseDetail}>
        Відредагувати квартиру
      </Button>
    </div>
  );
};

export default UpdateApartment;
