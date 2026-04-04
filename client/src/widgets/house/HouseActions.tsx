import { DeleteHouse } from './DeleteHouse';
import { UpdateHouse } from './UpdateHouse';

export const HouseActions = () => {
  return (
    <div className="flex gap-2 justify-between w-full py-4 px-0">
      <DeleteHouse />
      <UpdateHouse />
    </div>
  );
};
