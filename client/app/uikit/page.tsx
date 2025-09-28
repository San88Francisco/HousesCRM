import { ButtonComponent } from '@/components/Examples/ButtonComponent';
import { CardComponent } from '@/components/Examples/CardComponent';
import { ControlButtons } from '@/components/Examples/ControlButtons';

import { DropDownComponent } from '@/components/Examples/DropDownComponent';
import { InputComponent } from '@/components/Examples/InputComponent';
import { PaymentTable } from '@/components/Examples/PaymentTable';
import { TableComponent } from '@/components/Examples/TableComponent/TableComponent';
import TabsComponent from '@/components/Examples/TabsComponent';
import { Textarea } from '@/components/ui/textarea';
import { mockData } from '@/constants/table/dataTable';

export default function Page() {
  return (
    <div className="flex flex-col gap-2">
      <ButtonComponent />
      <CardComponent />
      <ControlButtons />
      <TableComponent />
      <PaymentTable data={mockData} />
      <TabsComponent />
      <InputComponent />
      <DropDownComponent />
      <Textarea className="w-[400px]" placeholder="Введіть текст тут..." />
      <Textarea maxLength={100} className="w-[400px]" placeholder="Введіть текст тут..." />
    </div>
  );
}
