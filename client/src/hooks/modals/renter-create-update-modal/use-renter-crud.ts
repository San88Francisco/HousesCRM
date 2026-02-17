import { RenterFormData } from '@/shared/validation/create-update-renter';
import { useCreateRenterMutation, useUpdateRenterMutation } from '@/store/api/renters-api';

export const useRenterCrud = () => {
  const [createRenter, createState] = useCreateRenterMutation();
  const [updateRenter, updateState] = useUpdateRenterMutation();

  const create = (data: RenterFormData) => createRenter(data).unwrap();

  const update = (id: string, data: Partial<RenterFormData>) =>
    updateRenter({ id, ...data }).unwrap();

  return {
    create,
    update,
    isLoading: createState.isLoading || updateState.isLoading,
  };
};
