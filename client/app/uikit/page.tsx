import { ButtonComponent } from '@/components/Examples/ButtonComponent';
import { CardComponent } from '@/components/Examples/CardComponent';
import { ControlButtons } from '@/components/Examples/ControlButtons';
import { InputComponent } from '@/components/Examples/InputComponent';
import TabsComponent from '@/components/Examples/TabsComponent';
import { Textarea } from '@/components/ui/textarea';

export default function Page() {
  return (
    <div className="flex flex-col gap-2">
      <ButtonComponent />
      <CardComponent />
      <ControlButtons />
      <TabsComponent />
      <InputComponent />
      <Textarea placeholder="write text here" />
    </div>
  );
}
