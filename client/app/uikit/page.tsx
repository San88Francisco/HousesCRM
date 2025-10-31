import { ButtonComponent } from '@/widgets/Uikit/ButtonComponent';
import { CalendarComponent } from '@/widgets/Uikit/CalendarComponent';
import { CardComponent } from '@/widgets/Uikit/CardComponent';
import { ControlButtons } from '@/widgets/Uikit/ControlButtons';
import { DropDownComponent } from '@/widgets/Uikit/DropDownComponent';
import { InputComponent } from '@/widgets/Uikit/InputComponent';
import { PaymentTable } from '@/widgets/Uikit/PaymentTable';
import { SelectComponent } from '@/widgets/Uikit/SelectCopmponent';
import { TableComponent } from '@/widgets/Uikit/TableComponent/TableComponent';
import TabsComponent from '@/widgets/Uikit/TabsComponent';
import { TextareaComponent } from '@/widgets/Uikit/TextareaComponent';
import { mockData } from '@/shared/constants/table/dataTable';
import { ThemeSwitch } from '@/widgets/Uikit/ThemeDropDown';

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
      <CalendarComponent />
      <DropDownComponent />
      <TextareaComponent />
      <SelectComponent />
    </div>
  );
}
