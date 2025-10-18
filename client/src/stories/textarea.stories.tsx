import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from '@/components/ui/textarea';

const meta: Meta<typeof Textarea> = {
  title: 'UI/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Мультистроковий текстовий інпут із автозміною висоти, підрахунком символів, повідомленням про помилку та допоміжним текстом.',
      },
    },
  },
  argTypes: {
    placeholder: { control: 'text', description: 'Підказка в полі вводу' },
    maxLength: { control: 'number', description: 'Максимальна кількість символів' },
    error: { control: 'boolean', description: 'Показати стан помилки' },
    helperText: { control: 'text', description: 'Текст під полем вводу' },
    disabled: { control: 'boolean', description: 'Вимкнене поле' },
  },
  args: {
    placeholder: 'Enter your message...',
    maxLength: 120,
    error: false,
    helperText: '',
    disabled: false,
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
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Базовий приклад текстової області з автозміною висоти та лічильником символів.',
      },
    },
  },
  args: {
    placeholder: 'Write something...',
  },
  render: args => <Textarea {...args} />,
};

export const WithHelperText: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Textarea із допоміжним текстом, який пояснює користувачу контекст поля.',
      },
    },
  },
  args: {
    helperText: 'You can describe your issue here.',
    placeholder: 'Describe your issue...',
  },
  render: args => <Textarea {...args} />,
};

export const WithError: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Textarea у стані помилки — змінюється колір рамки та з’являється іконка попередження.',
      },
    },
  },
  args: {
    error: true,
    helperText: 'This field is required.',
    placeholder: 'Enter something...',
  },
  render: args => <Textarea {...args} />,
};

export const WithCounter: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Textarea з обмеженням кількості символів та лічильником, який показує скільки залишилось.',
      },
    },
  },
  args: {
    maxLength: 60,
    placeholder: 'Type your feedback...',
  },
  render: args => <Textarea {...args} />,
};
