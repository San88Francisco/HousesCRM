'use client';

import { Input } from '@/shared/ui/input';
import { Search } from 'lucide-react';

export const InputComponent = () => {
  return (
    <div className="w-[400px] flex flex-col gap-2 mb-10">
      <Input name="password" placeholder="Simple Empty" />
      <Input name="password" placeholder="Simple Empty" icon={<Search />} required />
      <Input name="password" placeholder="Simple Empty" disabled />
      <Input name="password" placeholder="Simple Empty" icon={<Search />} disabled />
      <Input
        className="mb-5"
        name="password"
        placeholder="Simple Empty"
        error="Oh snape! There was an error."
      />
      <Input
        className="mb-5"
        name="password"
        placeholder="Simple Empty"
        error="Oh snape! There was an error."
        icon={<Search />}
      />
      <Input
        className="mb-5"
        name="password"
        placeholder="Simple Empty"
        error="Oh snape! There was an error."
        iconWithError={true}
      />
      <Input
        className="mb-5"
        name="password"
        placeholder="Simple Empty"
        error="Oh snape! There was an error."
        iconWithError={true}
        icon={<Search />}
      />
    </div>
  );
};
