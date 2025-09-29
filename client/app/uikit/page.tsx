import { ButtonComponent } from '@/components/Examples/ButtonComponent';
import { CardComponent } from '@/components/Examples/CardComponent';
import { ControlButtons } from '@/components/Examples/ControlButtons';
import { DropDownComponent } from '@/components/Examples/DropDownComponent';
import { InputComponent } from '@/components/Examples/InputComponent';
import { PaymentTable } from '@/components/Examples/PaymentTable';
import { SelectComponent } from '@/components/Examples/SelectCopmponent';
import { TableComponent } from '@/components/Examples/TableComponent/TableComponent';
import TabsComponent from '@/components/Examples/TabsComponent';
import { ThemeSwitch } from '@/components/ThemeDropDown';
import { Textarea } from '@/components/ui/textarea';
import { mockData } from '@/constants/table/dataTable';

export default function Page() {
  return (
    <div className="flex flex-col gap-2">
      <div className="fixed top-2 right-2  z-10">
        <ThemeSwitch />
      </div>
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
      <SelectComponent />
    </div>
  );
}
