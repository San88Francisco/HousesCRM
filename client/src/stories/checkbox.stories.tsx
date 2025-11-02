import { Checkbox } from '@/shared/ui/checkbox';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof Checkbox> = {
  title: 'UI/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Текст біля чекбоксу',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Розмір чекбоксу',
    },
    disabled: {
      control: 'boolean',
      description: 'Вимикає чекбокс',
    },
    checked: {
      control: 'boolean',
      description: 'Статус вибору',
    },
    onCheckedChange: { action: 'changed' },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    label: 'Згоден з умовами',
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    label: 'Малий чекбокс',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    label: 'Великий чекбокс',
    size: 'lg',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Недоступний чекбокс',
    disabled: true,
  },
};

export const Checked: Story = {
  args: {
    label: 'Увімкнений чекбокс',
    checked: true,
  },
};
