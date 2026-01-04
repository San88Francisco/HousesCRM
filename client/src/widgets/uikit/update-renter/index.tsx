import { Button } from '@/shared/ui/button';
import { useGetRenterByIdQuery } from '@/store/api/houses-api';
import { useAppDispatch } from '@/store/hooks';
import { openModal } from '@/store/slice/modal-slice';
import { ModalTriggers } from '@/types/model/modals/modals';
import { Renter } from '@/types/services/renters';
import { MouseEvent } from 'react';
import { toast } from 'sonner';

// TODO цей файл тимчасовий. Тут приклад як робити функцію редагування данних існуючої квартири.
// TODO це ID вашого орендаря.
const idRenter = '244ca675-895f-4054-831c-e14fb085e57d';

const UpdateRenter = () => {
  const dispatch = useAppDispatch();

  const handleEdit = (e: MouseEvent<HTMLButtonElement>, renter?: Renter) => {
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
