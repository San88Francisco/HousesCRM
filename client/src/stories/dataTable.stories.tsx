import type { Meta, StoryObj } from '@storybook/react-vite';
import { mockData } from '@/constants/table/dataTable';
import { PaymentTable } from '@/components/Examples/PaymentTable';

const meta: Meta<typeof PaymentTable> = {
  title: 'Components/DataTable',
  component: PaymentTable,
  tags: ['autodocs'],
  args: {
    data: mockData,
  },
};

export default meta;

type Story = StoryObj<typeof PaymentTable>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    data: [],
  },
};
