import { HouseFormData } from '@/shared/validation/create-update-house';
import { useCreateHouseMutation, useUpdateHouseMutation } from '@/store/api/houses-api';

export const useHouseCrud = () => {
  const [createHouse, createState] = useCreateHouseMutation();
  const [updateHouse, updateState] = useUpdateHouseMutation();

  const create = (data: HouseFormData) => createHouse(data).unwrap();

  const update = (id: string, data: Partial<HouseFormData>) =>
    updateHouse({ id, ...data }).unwrap();

  return {
    create,
    update,
    isLoading: createState.isLoading || updateState.isLoading,
  };
};
