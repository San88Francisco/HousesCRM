import { DELETE_ACTION_CONFIG, DeleteAction } from '@/shared/constants/delete-actions';
import { useDeleteContractMutation } from '@/store/api/contracts-api';
import { useDeleteHouseMutation } from '@/store/api/houses-api';
import { useDeleteRenterMutation } from '@/store/api/renters-api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { closeModal } from '@/store/slice/modal-slice';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type DeleteMutationFn = (entityId: string) => { unwrap: () => Promise<void> };

export const useConfirmDelete = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { payload } = useAppSelector(s => s.modal);

  const deleteAction = payload?.deleteAction as DeleteAction | undefined;
  const entityId = payload?.entityId as string | undefined;
  const config = deleteAction ? DELETE_ACTION_CONFIG[deleteAction] : null;

  const [deleteHouse, { isLoading: isDeleteHouseLoading }] = useDeleteHouseMutation();
  const [deleteRenter, { isLoading: isDeleteRenterLoading }] = useDeleteRenterMutation();
  const [deleteContract, { isLoading: isDeleteContractLoading }] = useDeleteContractMutation();

  const deleteMutations: Record<DeleteAction, DeleteMutationFn> = {
    [DeleteAction.HOUSE]: deleteHouse,
    [DeleteAction.RENTER]: deleteRenter,
    [DeleteAction.CONTRACT]: deleteContract,
  };

  const isLoading = isDeleteHouseLoading || isDeleteRenterLoading || isDeleteContractLoading;

  const handleConfirm = async () => {
    if (!deleteAction || !entityId) return;

    try {
      const mutation = deleteMutations[deleteAction];
      await mutation(entityId).unwrap();

      dispatch(closeModal());
      toast.success(config?.successMessage ?? 'Успішно видалено!');
      const skipRedirect =
        payload &&
        typeof payload === 'object' &&
        'skipRedirect' in payload &&
        Boolean((payload as { skipRedirect?: boolean }).skipRedirect);
      if (!skipRedirect && config && 'redirectUrl' in config && config.redirectUrl) {
        router.replace(config.redirectUrl as string);
      }
    } catch (error) {
      toast.error('Помилка при видаленні', {
        description: error instanceof Error ? error.message : 'Невідома помилка',
      });
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      dispatch(closeModal());
    }
  };

  return {
    title: config?.title ?? 'Підтвердження видалення',
    description: config?.description ?? 'Цю дію неможливо буде скасувати. Ви впевнені?',
    isLoading,
    handleConfirm,
    handleClose,
  };
};
