import { Button } from '@/shared/ui/button';
import { useGetHouseByIdQuery } from '@/store/api/houses-api';
import { useAppDispatch } from '@/store/hooks';
import { openModal } from '@/store/slice/modal-slice';
import { House } from '@/types/core/house/house';
import { ModalTriggers } from '@/types/model/modals/modals';
import { MouseEvent } from 'react';
import { toast } from 'sonner';

// TODO цей файл тимчасовий. Тут приклад як робити функцію редагування данних існуючої квартири.
// TODO це ID вашої квартири.
const idHouse = '4eaeccd2-4d5e-45b3-9035-1f6bc3ad6c48';

const UpdateHouse = () => {
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

  const { data /* error, isLoading*/ } = useGetHouseByIdQuery(idHouse);

  return (
    <div className="w-[150px] mb-5">
      <Button onClick={e => handleEdit(e, data?.houseDetail)} disabled={!data?.houseDetail}>
        Відредагувати квартиру
      </Button>
    </div>
  );
};

export default UpdateHouse;
