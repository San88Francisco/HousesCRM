import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group';

const meta: Meta<typeof RadioGroup> = {
  title: 'UI/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="option1">
      <div className="flex items-center gap-3">
        <RadioGroupItem value="option1" id="r1" />
        <RadioGroupItem value="option2" id="r2" />
        <RadioGroupItem value="option3" id="r3" />
      </div>
    </RadioGroup>
  ),
};

export const Vertical: Story = {
  render: () => (
    <RadioGroup defaultValue="option1">
      <RadioGroupItem value="option1" />
      <RadioGroupItem value="option2" />
      <RadioGroupItem value="option3" />
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="option1">
      <div className="flex items-center gap-3">
        <RadioGroupItem value="option1" id="d1" />
        <RadioGroupItem value="option2" id="d2" disabled />
        <RadioGroupItem value="option3" id="d3" />
      </div>
    </RadioGroup>
  ),
};
