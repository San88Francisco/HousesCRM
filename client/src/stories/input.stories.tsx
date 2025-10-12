import { Input } from '@/components/ui/input';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Mail, Lock, Search } from 'lucide-react';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    type: {
      control: { type: 'text' },
      description: 'Тип інпуту (text, password, email тощо)',
    },
    helperText: {
      control: { type: 'text' },
      description: 'Допоміжний текст під інпутом',
    },
    error: {
      control: { type: 'boolean' },
      description: 'Стан помилки',
    },
    iconWithError: {
      control: { type: 'boolean' },
      description: 'Показувати іконку помилки поруч з інпутом',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Деактивує інпут',
    },
  },
  decorators: [
    Story => (
      <div style={{ width: '320px', maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Enter your name',
  },
};

export const WithIcon: Story = {
  args: {
    placeholder: 'Email address',
    icon: <Mail />,
  },
};

export const WithHelperText: Story = {
  args: {
    placeholder: 'Search...',
    icon: <Search />,
    helperText: 'You can search by keyword or email',
  },
};

export const ErrorState: Story = {
  args: {
    placeholder: 'Password',
    type: 'password',
    icon: <Lock />,
    error: true,
    iconWithError: true,
    helperText: 'Incorrect password',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    icon: <Mail />,
    disabled: true,
  },
};
