import { TableComponent } from '@/widgets/uikit/table-component/TableComponent';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof TableComponent> = {
  title: 'Components/TableComponent',
  component: TableComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof TableComponent>;

export const Default: Story = {
  args: {},
};
