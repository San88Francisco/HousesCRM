'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export const InputComponent = () => {
  return (
    <div className="w-[400px] flex flex-col gap-2">
      <Input name="password" placeholder="Simple Empty" />
      <Input name="password" placeholder="Simple Empty" icon={<Search />} required />
      <Input name="password" placeholder="Simple Empty" disabled />
      <Input name="password" placeholder="Simple Empty" icon={<Search />} disabled />
      <Input name="password" placeholder="Simple Empty" error={true} />
      <Input name="password" placeholder="Simple Empty" error={true} icon={<Search />} />
      <Input name="password" placeholder="Simple Empty" error={true} iconWithError={true} />
      <Input
        name="password"
        placeholder="Simple Empty"
        error={true}
        iconWithError={true}
        icon={<Search />}
      />
    </div>
  );
};
