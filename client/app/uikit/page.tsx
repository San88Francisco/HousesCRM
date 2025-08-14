import { ButtonComponent } from '@/components/Examples/ButtonComponent';
import { CardComponent } from '@/components/Examples/CardComponent';
import { ControlButtons } from '@/components/Examples/ControlButtons';
import { InputComponent } from '@/components/Examples/InputComponent';
import TabsComponent from '@/components/Examples/TabsComponent';

export default function Page() {
  return (
    <div className="flex flex-col gap-2">
      <ButtonComponent />
      <CardComponent />
      <ControlButtons />
      <TabsComponent />
      <InputComponent />
      <div className="text-center">Test text</div>
    </div>
  );
}
