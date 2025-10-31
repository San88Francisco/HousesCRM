import type { Meta, StoryObj } from '@storybook/react-vite';
import { TableComponent } from '@/widgets/Uikit/TableComponent/TableComponent';

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
