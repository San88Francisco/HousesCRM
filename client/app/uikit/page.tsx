'use client';
import { UpdateHouse } from '@/widgets/house/UpdateHouse';
import { PdfContractTrigger } from '@/widgets/modals/pdf-contract-content-modal/PdfContractTrigger';
import { ButtonComponent } from '@/widgets/uikit/button-component';
import { CalendarComponent } from '@/widgets/uikit/calendar-component';
import { CardComponent } from '@/widgets/uikit/card-component';
import { ControlButtons } from '@/widgets/uikit/control-buttons';
import { DropDownComponent } from '@/widgets/uikit/drop-down-component';
import { InputComponent } from '@/widgets/uikit/input-component';
import { ModalTrigger } from '@/widgets/uikit/modal';
import { SelectComponent } from '@/widgets/uikit/select-component';
import TabsComponent from '@/widgets/uikit/tabs-component';
import { TextareaComponent } from '@/widgets/uikit/textarea-component';
import { ToastComponent } from '@/widgets/uikit/toast-component';
import UpdateContract from '@/widgets/uikit/update-contract';
export default function Page() {
  return (
    <div className="flex flex-col gap-2 min-w-screen">
      <ButtonComponent />
      <CardComponent />
      <ControlButtons />
      <TabsComponent />
      <InputComponent />
      <CalendarComponent />
      <DropDownComponent />
      <TextareaComponent />
      <ToastComponent />
      <SelectComponent />
      <PdfContractTrigger id="e9d638de-1872-4ac0-acc5-c4f767e9fa66" />
      <ModalTrigger />
      <UpdateHouse />
      <UpdateContract />
    </div>
  );
}
