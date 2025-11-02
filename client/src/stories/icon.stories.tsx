import { Button } from '@/shared/ui/button';
import { KeySquareIcon } from '@/shared/ui/key';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { User } from 'lucide-react';
import React from 'react';

const meta: Meta<typeof Button> = {
  title: 'UI/Icon',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline', 'destructive', 'icon'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    children: {
      control: false,
      description: 'Іконка',
    },
    disabled: {
      control: 'boolean',
    },
    asChild: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Стандартна кнопка',
      },
    },
  },
  args: {
    variant: 'default',
    children: <User />,
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: <User />,
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: <User />,
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: <User />,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: <User />,
  },
};

export const KeyIcon: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Стандартна кнопка',
      },
    },
  },
  args: {
    variant: 'default',
    children: <KeySquareIcon />,
  },
};
