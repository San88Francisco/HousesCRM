'use client';

import { Button } from '@/shared/ui/button';
import { useAppDispatch } from '@/store/hooks';
import { openModal } from '@/store/modal-slice';
import { ModalTriggers } from '@/types/model/modals';
import { toast } from 'sonner';
import { ApartmentFromAPI } from '@/types/core/house';
import { useGetHouseByIdQuery } from '@/store/houses-api';
import { MouseEvent } from 'react';

// TODO цей файл тимчасовий. Тут приклад як робити функцію редагування данних існуючої квартири.
const idApartment = 'f021f05c-4cd3-4ac6-a349-faf420d4290b';

const UpdateApartment = () => {
  const dispatch = useAppDispatch();

  const handleEdit = (e: MouseEvent<HTMLButtonElement>, apartment?: ApartmentFromAPI) => {
    e.currentTarget.blur();

    if (!apartment) {
      toast.error('Не вдалося завантажити дані квартири');
      return;
    }

    dispatch(
      openModal({
        trigger: ModalTriggers.EDIT_HOUSE,
        payload: { apartment },
      }),
    );
  };

  const { data /* error, isLoading*/ } = useGetHouseByIdQuery(idApartment);

  return (
    <div className="w-[150px] mb-5">
      <Button
        onClick={e => data?.houseDetail && handleEdit(e, data?.houseDetail)}
        disabled={!data?.houseDetail}
      >
        Відредагувати квартиру
      </Button>
    </div>
  );
};

export default UpdateApartment;
