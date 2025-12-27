'use client';

import { Button } from '@/shared/ui/button';
import { useAppDispatch } from '@/store/hooks';
import { useGetHouseByIdQuery } from '@/store/houses-api';
import { openModal } from '@/store/modal-slice';
import { HouseFromAPI } from '@/types/core/house';
import { ModalTriggers } from '@/types/model/modals';
import { MouseEvent } from 'react';
import { toast } from 'sonner';

// TODO цей файл тимчасовий. Тут приклад як робити функцію редагування данних існуючої квартири.
const idApartment = '2188f8c5-2528-49c2-b252-b5dc02e8da13';

const UpdateApartment = () => {
  const dispatch = useAppDispatch();

  const handleEdit = (e: MouseEvent<HTMLButtonElement>, apartment?: HouseFromAPI) => {
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
