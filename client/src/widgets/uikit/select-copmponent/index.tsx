'use client';

import {
  SelectValue,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from '@/shared/ui/select';
import { Apple, Banana, Cherry, Grape, Citrus } from 'lucide-react';

const fruits = [
  { value: 'apple', label: 'Apple', icon: <Apple /> },
  { value: 'banana', label: 'Banana', icon: <Banana /> },
  { value: 'cherry', label: 'Cherry', icon: <Cherry /> },
  { value: 'grapes', label: 'Grapes', icon: <Grape /> },
  { value: 'orange', label: 'Citrus', icon: <Citrus /> },
];

export const SelectComponent = () => {
  return (
    <div className="m-auto mt-5 mb-5 flex gap-2">
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            {fruits.map(fruit => (
              <SelectItem key={fruit.value} value={fruit.value}>
                {fruit.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger disabled className="w-[180px]">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            {fruits.map(fruit => (
              <SelectItem key={fruit.value} value={fruit.value}>
                {fruit.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger error className="w-[180px]">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            {fruits.map(fruit => (
              <SelectItem key={fruit.value} value={fruit.value} icon={fruit.icon}>
                {fruit.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
