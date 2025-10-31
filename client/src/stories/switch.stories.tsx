import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from '@/shared/ui/switch';

const meta: Meta<typeof Switch> = {
  title: 'UI/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Вимикає можливість змінювати стан',
    },
    onCheckedChange: { action: 'changed' },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Interactive: Story = {
  render: args => {
    const [checked, setChecked] = useState(false);

    return (
      <div className="flex items-center gap-2">
        <Switch
          {...args}
          checked={checked}
          onCheckedChange={value => {
            setChecked(!!value);
            args.onCheckedChange?.(value);
          }}
        />
        <span>{checked ? 'Увімкнено' : 'Вимкнено'}</span>
      </div>
    );
  },
  args: {
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
