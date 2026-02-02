import DeleteHouse from './DeleteHouse';
import UpdateHouse from './UpdateHouse';

export const HouseActions = () => {
  return (
    <div className="flex gap-2 justify-between w-full p-4">
      <DeleteHouse />
      <UpdateHouse />
    </div>
  );
};
