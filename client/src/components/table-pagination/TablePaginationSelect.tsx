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

const limits = [
  { label: 5, value: 5 },
  { label: 10, value: 10 },
  { label: 15, value: 15 },
  { label: 20, value: 20 },
];

export const TablePaginationSelect: FC<Props> = ({ limit, onLimitChange }) => {
  return (
    <Select
      value={`${limit}`}
      onValueChange={selectedLimit => onLimitChange(Number(selectedLimit))}
    >
      <SelectTrigger className="w-auto border-[1px] border-solid rounded-[8px] max-h-[38px] flex gap-1">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Ліміт</SelectLabel>
          {limits.map(limit => (
            <SelectItem key={limit.value} value={`${limit.value}`}>
              {limit.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
