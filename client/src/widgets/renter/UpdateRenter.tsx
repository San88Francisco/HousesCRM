'use client';

import { Button } from '@/shared/ui/button';
import { useGetRenterByIdQuery } from '@/store/api/houses-api';
import { useAppDispatch } from '@/store/hooks';
import { openModal } from '@/store/slice/modal-slice';
import { Renter } from '@/types/core/renter';
import { ModalTriggers } from '@/types/model/modals';
import { useParams } from 'next/navigation';
import { MouseEvent } from 'react';

const UpdateRenter = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const handleEdit = (e: MouseEvent<HTMLButtonElement>, renter?: Renter) => {
    e.currentTarget.blur();

    dispatch(
      openModal({
        trigger: ModalTriggers.EDIT_RENTER,
        payload: { renter },
      }),
    );
  };

  const { data } = useGetRenterByIdQuery(id);

  return (
    <div>
      <Button
        variant="outline"
        onClick={e => handleEdit(e, data?.oneRenterReport)}
        disabled={!data?.oneRenterReport}
      >
        Відредагувати орендаря
      </Button>
    </div>
  );
};

export default UpdateRenter;
