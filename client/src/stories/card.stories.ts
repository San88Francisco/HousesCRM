import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from '@/components/ui/card';

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'sky', 'purple'],
      description: 'Card variant',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    children: {
      control: 'text',
      description: 'Card content',
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
    children: 'This is a default card',
  },
};

// export const Sky: Story = {
//   args: {
//     variant: 'sky',
//     children: 'This is a sky card',
//     className: 'p-4 w-64',
//   },
// };

// export const Purple: Story = {
//   args: {
//     variant: 'purple',
//     children: 'This is a purple card',
//     className: 'p-4 w-64',
//   },
// };

// export const CustomClass: Story = {
//   args: {
//     variant: 'default',
//     children: 'Card with custom styling',
//     className: 'p-6 w-80 border-2 border-blue-500',
//   },
// };
