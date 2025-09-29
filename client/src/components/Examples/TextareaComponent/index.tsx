import { Textarea } from '@/components/ui/textarea';

export const TextareaComponent = () => {
  return (
    <div className=" flex flex-wrap gap-10">
      <Textarea className="w-[400px]" placeholder="Введіть текст тут..." />
      <Textarea className="w-[400px]" maxLength={100} placeholder="Введіть текст тут..." />
      <Textarea className="w-[400px]" placeholder="Введіть текст тут..." />
      <Textarea className="w-[400px]" placeholder="Введіть текст тут..." disabled />
      <Textarea className="w-[400px]" placeholder="Введіть текст тут..." error />
      <Textarea className="w-[400px]" maxLength={100} placeholder="Введіть текст тут..." error />
    </div>
  );
};
