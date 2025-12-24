'use client';

import { Button } from '@/shared/ui/button';
import { useAppDispatch } from '@/store/hooks';
import { openModal } from '@/store/modal-slice';
import { ModalTriggers } from '@/types/model/modals';

const CreateRenter = () => {
  const dispatch = useAppDispatch();

  return (
    <div className="w-[150px] mb-5">
      <Button
        onClick={() =>
          dispatch(
            openModal({
              trigger: ModalTriggers.ADD_RENTER,
            }),
          )
        }
      >
        Створити орендаря
      </Button>
    </div>
  );
};

export default CreateRenter;
