import { PAGE_SIZE_OPTIONS } from '@/shared/constants/table/pagination';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { FC } from 'react';

type Props = {
  limit: number;
  onLimitChange: (limit: number) => void;
};
export const TablePaginationSelect: FC<Props> = ({ limit, onLimitChange }) => {
  return (
    <Select
      value={`${limit}`}
      onValueChange={selectedLimit => onLimitChange(Number(selectedLimit))}
    >
      <SelectTrigger className="w-auto border-[1px] border-solid rounded-[8px] max-h-[40px] flex gap-1">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Ліміт</SelectLabel>
          {PAGE_SIZE_OPTIONS.map(limit => (
            <SelectItem key={limit.value} value={`${limit.value}`}>
              {limit.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
