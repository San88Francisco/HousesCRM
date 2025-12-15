'use client';

import { Button } from '@/shared/ui/button';
import { useAppDispatch } from '@/store/hooks';
import { openModal } from '@/store/modal-slice';
import { ModalTriggers } from '@/types/model/modals';
import { toast } from 'sonner';
import { ApartmentFromAPI } from '@/types/core/apartment';
import { useGetHouseByIdQuery } from '@/store/houses-api';

// TODO цей файл тимчасовий. Тут приклад як робити функцію редагування данних існуючої квартири.
const idApartment = 'f021f05c-4cd3-4ac6-a349-faf420d4290b';

const UpdateApartment = () => {
  const dispatch = useAppDispatch();

  const handleEdit = (apartment?: ApartmentFromAPI) => {
    if (!apartment) {
      toast.error('Не вдалося завантажити дані квартири');
      return;
    }

    dispatch(
      openModal({
        trigger: ModalTriggers.EDIT_APARTMENT,
        payload: { apartment },
      }),
    );
  };

  const { data /* error, isLoading*/ } = useGetHouseByIdQuery(idApartment);

  return (
    <div className="w-[150px] mb-5">
      <Button
        onClick={() => data?.houseDetail && handleEdit(data?.houseDetail)}
        disabled={!data?.houseDetail}
      >
        Відредагувати квартиру
      </Button>
    </div>
  );
};

export default UpdateApartment;
