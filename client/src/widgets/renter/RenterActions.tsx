import { DeleteRenter } from './DeleteRenter';
import { UpdateRenter } from './UpdateRenter';

export const RenterActions = () => {
  return (
    <div className="flex gap-2 justify-between w-full py-4 px-0">
      <DeleteRenter />
      <UpdateRenter />
    </div>
  );
};
