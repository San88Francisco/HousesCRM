import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@/components/ui/button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
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
      control: 'text',
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
        story: 'Звичайна кнопка',
      },
    },
  },
  args: {
    children: 'Button',
  },
};

// export const Secondary: Story = {
//   args: {
//     variant: 'secondary',
//     children: 'Secondary',
//   },
// };

// export const Outline: Story = {
//   args: {
//     variant: 'outline',
//     children: 'Outline',
//   },
// };

// export const Destructive: Story = {
//   args: {
//     variant: 'destructive',
//     children: 'Destructive',
//   },
// };

// export const Icon: Story = {
//   args: {
//     variant: 'icon',
//     children: '🔥',
//   },
// };

// export const ExtraSmall: Story = {
//   args: {
//     size: 'xs',
//     children: 'XS',
//   },
// };

// export const Small: Story = {
//   args: {
//     size: 'sm',
//     children: 'Small',
//   },
// };

// export const Medium: Story = {
//   args: {
//     size: 'md',
//     children: 'Medium',
//   },
// };

// export const Large: Story = {
//   args: {
//     size: 'lg',
//     children: 'Large',
//   },
// };

// export const ExtraLarge: Story = {
//   args: {
//     size: 'xl',
//     children: 'XL',
//   },
// };

// export const Disabled: Story = {
//   args: {
//     disabled: true,
//     children: 'Disabled',
//   },
// };
