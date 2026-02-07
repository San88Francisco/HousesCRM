'use client';

import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import { useGetAllContractsByRenterIdQuery } from '@/store/api/renters-api';

import { useAppDispatch } from '@/store/hooks';
import { openModal } from '@/store/slice/modal-slice';
import { Renter } from '@/types/core/renter';
import { ModalTriggers } from '@/types/model/modals';
import { useParams } from 'next/navigation';
import { MouseEvent } from 'react';

export const UpdateRenter = () => {
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

  const { data, isLoading, error } = useGetAllContractsByRenterIdQuery(
    { renterId: id },
    { skip: !id },
  );

  if (isLoading) return <Skeleton className="w-48 h-10" />;

  if (error)
    return (
      <Button variant="outline" className="text-red" disabled>
        Помилка при завантаженні орендаря
      </Button>
    );

  return (
    <Button
      variant="outline"
      onClick={e => handleEdit(e, data?.oneRenterReport)}
      disabled={!data?.oneRenterReport}
    >
      Відредагувати орендаря
    </Button>
  );
};
