import { ButtonComponent } from '@/components/Examples/ButtonComponent';
import { CardComponent } from '@/components/Examples/CardComponent';
import { ControlButtons } from '@/components/Examples/ControlButtons';
import { InputComponent } from '@/components/Examples/InputComponent';

export default function Page() {
  return (
    <div className="flex flex-col gap-2">
      <ButtonComponent />
      <CardComponent />
      <ControlButtons />
      <InputComponent />
      <div className="text-center">Test text</div>
    </div>
  );
}
