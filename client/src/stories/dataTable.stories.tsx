import { PaymentTable } from '@/widgets/Uikit/PaymentTable';
import { mockData } from '@/shared/constants/table/dataTable';

const meta = {
  title: 'Components/DataTable',
  component: PaymentTable,
  tags: ['autodocs'],
  args: {
    data: mockData,
  },
};

export default meta;

export const Default = {};

export const Empty = {
  args: {
    data: [],
  },
};
