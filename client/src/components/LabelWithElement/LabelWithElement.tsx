import { FC } from 'react';
import { Label } from '../ui/label';

type Props = {
  children: React.ReactNode;
  text: string;
};

export const LabelWithElement: FC<Props> = ({ children, text }) => {
  return (
    <div className="flex items-center gap-2">
      {children}
      <Label className="text-black/60 dark:text-white/60">{text}</Label>
    </div>
  );
};
