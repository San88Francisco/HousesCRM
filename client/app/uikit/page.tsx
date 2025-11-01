import { mockData } from '@/shared/constants/table/dataTable';
import { ButtonComponent } from '@/widgets/uikit/button-component';
import { CalendarComponent } from '@/widgets/uikit/calendar-component';
import { CardComponent } from '@/widgets/uikit/card-component';
import { ControlButtons } from '@/widgets/uikit/control-buttons';
import { DropDownComponent } from '@/widgets/uikit/drop-down-component';
import { InputComponent } from '@/widgets/uikit/input-component';
import { PaymentTable } from '@/widgets/uikit/payment-table';
import { SelectComponent } from '@/widgets/uikit/select-copmponent';
import { TableComponent } from '@/widgets/uikit/table-component/TableComponent';
import TabsComponent from '@/widgets/uikit/tabs-component';
import { TextareaComponent } from '@/widgets/uikit/textarea-component';
import { ToastCopmponent } from '@/widgets/uikit/toast-component';
import { ThemeSwitch } from '@/widgets/uikit/theme-drop-down';

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
      <ToastCopmponent />
      <SelectComponent />
    </div>
  );
}
