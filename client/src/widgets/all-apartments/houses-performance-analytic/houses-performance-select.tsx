import { FC } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';

type Props = {
  limit: number;
  setLimit: (limit: number) => void;
};

const limits = [
  { label: 1, value: 1 },
  { label: 2, value: 2 },
  { label: 5, value: 5 },
  { label: 10, value: 10 },
  { label: 15, value: 15 },
  { label: 20, value: 20 },
];

export const HousesPerformanceSelect: FC<Props> = ({ limit, setLimit }) => {
  const handleOnValueChange = (selectedLimit: string) => {
    setLimit(Number(selectedLimit));
  };

  return (
    <Select value={`${limit}`} onValueChange={handleOnValueChange}>
      <SelectTrigger className="w-auto">
        <SelectValue placeholder="10" className="pl-4" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Limit</SelectLabel>
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
