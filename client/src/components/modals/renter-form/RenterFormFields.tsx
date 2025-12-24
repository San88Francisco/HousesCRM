import { User } from 'lucide-react';
import { RHFInput } from '@/components/RHF/RHFInput';
import { RHFDateRangePicker } from '@/components/RHF/RHFDateRangePicker';

interface Props {
  isLoading: boolean;
}

export const RenterFormFields = ({ isLoading }: Props) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RHFInput
          name="firstName"
          label="Ім'я"
          placeholder="Петро"
          icon={<User className="w-4 h-4" />}
          required
          disabled={isLoading}
        />

        <RHFInput
          name="lastName"
          label="Прізвище"
          placeholder="Щур"
          icon={<User className="w-4 h-4" />}
          required
          disabled={isLoading}
        />
      </div>

      <RHFDateRangePicker
        nameFrom="occupied"
        nameTo="vacated"
        labelFrom="Дата заселення орендаря"
        labelTo="Дата виселення орендаря"
        placeholderFrom="Оберіть дату заселення"
        placeholderTo="Оберіть дату виселення"
        disabled={isLoading}
      />

      {/* <RHFCalendarRange name="rentPeriod" label="Період оренди" /> */}
    </div>
  );
};
