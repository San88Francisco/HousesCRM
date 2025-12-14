'use client';
import { mockData } from '@/shared/constants/table/dataTable';
import { ButtonComponent } from '@/widgets/uikit/button-component';
import { CalendarComponent } from '@/widgets/uikit/calendar-component';
import { CardComponent } from '@/widgets/uikit/card-component';
import { ControlButtons } from '@/widgets/uikit/control-buttons';
import { InputComponent } from '@/widgets/uikit/input-component';
import { PaymentTable } from '@/widgets/uikit/payment-table';
import { SelectComponent } from '@/widgets/uikit/select-copmponent';
import { TableComponent } from '@/widgets/uikit/table-component/TableComponent';
import TabsComponent from '@/widgets/uikit/tabs-component';
import { TextareaComponent } from '@/widgets/uikit/textarea-component';
import { ToastCopmponent } from '@/widgets/uikit/toast-component';
import { DropDownComponent } from '@/widgets/uikit/drop-down-component';
import { ModalTrigger } from '@/widgets/uikit/modal';
import { PdfContractTrigger } from '@/widgets/pdf-contract-content/pdf-contract-trigger';
import UpdateApartment from '@/widgets/uikit/update-apartment';

export default function Page() {
  return (
    <div className="flex flex-col gap-2 min-w-screen">
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
      <PdfContractTrigger id="e9d638de-1872-4ac0-acc5-c4f767e9fa66" />
      <ModalTrigger />
      <UpdateApartment />
    </div>
  );
}
