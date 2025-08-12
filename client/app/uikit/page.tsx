import { ButtonComponent } from '@/components/Examples/ButtonComponent/ButtonComponent';
import { CardComponent } from '@/components/Examples/CardComponent/CardComponent';
import { ControlButtons } from '@/components/Examples/ControlButtons/ControlButtons';
import { DataTableComponent } from '@/components/Examples/DataTableComponent/DataTableComponent';
import { TableComponent } from '@/components/Examples/TableComponent/TableComponent';

export default function Page() {
  return (
    <div className="flex flex-col gap-2">
      <ButtonComponent />
      <CardComponent />
      <ControlButtons />
      <TableComponent />
      <DataTableComponent />
    </div>
  );
}
