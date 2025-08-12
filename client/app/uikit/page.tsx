import { ButtonComponent } from '@/components/Examples/ButtonComponent/ButtonComponent';
import { CardComponent } from '@/components/Examples/CardComponent/CardComponent';
import { ControlButtons } from '@/components/Examples/ControlButtons/ControlButtons';
import TabsComponent from '@/components/Examples/TabsComponent/TabsComponent';

export default function Page() {
  return (
    <div className="flex flex-col gap-2">
      <ButtonComponent />
      <CardComponent />
      <ControlButtons />
      <TabsComponent />
    </div>
  );
}
