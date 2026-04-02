import { Button } from '@/shared/ui/button';
import { useGetContractByIdQuery } from '@/store/api/contracts-api';
import { useAppDispatch } from '@/store/hooks';
import { openModal } from '@/store/slice/modal-slice';
import { Contract } from '@/types/core/contract';
import { ModalTriggers } from '@/types/model/modals';
import { MouseEvent } from 'react';

// TODO: Це тестовий компонент - замініть ID на реальний
const contractId = '2698c2ff-05f5-4a5c-9b24-a13a828528b5';

const UpdateContract = () => {
  const dispatch = useAppDispatch();

  const handleEdit = (e: MouseEvent<HTMLButtonElement>, contract?: Contract) => {
    e.currentTarget.blur();

    dispatch(
      openModal({
        trigger: ModalTriggers.EDIT_CONTRACT,
        payload: { contract },
      }),
    );
  };

  const { data /* error, isLoading*/ } = useGetContractByIdQuery(contractId);

  return (
    <div className="w-[150px] mb-5">
      <Button onClick={e => handleEdit(e, data)} disabled={!data}>
        Відредагувати контракт
      </Button>
    </div>
  );
};

export default UpdateContract;
