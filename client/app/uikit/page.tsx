import { ButtonComponent } from '@/components/Examples/ButtonComponent';
import { CardComponent } from '@/components/Examples/CardComponent';
import { ControlButtons } from '@/components/Examples/ControlButtons';
import { DataTableComponent } from '@/components/Examples/DataTableComponent/DataTableComponent';
import { InputComponent } from '@/components/Examples/InputComponent';
import { TableComponent } from '@/components/Examples/TableComponent/TableComponent';
import TabsComponent from '@/components/Examples/TabsComponent';

export default function Page() {
  return (
    <div className="flex flex-col gap-2">
      <ButtonComponent />
      <CardComponent />
      <ControlButtons />
      <TableComponent />
      <DataTableComponent />
      <TabsComponent />
      <InputComponent />
    </div>
  );
}
