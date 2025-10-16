import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import React from 'react';

type Props = React.ComponentProps<typeof Card> & {
  title?: string;
  description?: string;
  content?: string;
  footer?: string;
};

const meta: Meta<Props> = {
  title: 'UI/Card',
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
    title: {
      control: 'text',
      description: 'Card title',
    },
    description: {
      control: 'text',
      description: 'Card description',
    },
    content: {
      control: 'text',
      description: 'Card content',
    },
    footer: {
      control: 'text',
      description: 'Card footer',
    },
  },
};

export default meta;
type Story = StoryObj<Props>;

const renderCard: Story['render'] = ({ variant, title, description, content, footer, ...rest }) => (
  <Card variant={variant} className="w-30" {...rest}>
    <CardHeader>
      <CardTitle variant={variant}>{title}</CardTitle>
      {description && <CardDescription variant={variant}>{description}</CardDescription>}
    </CardHeader>

    <CardContent variant={variant} className="grid grid-cols-2 gap-4">
      <div>{content}</div>
      <div>{content}</div>
    </CardContent>

    <CardFooter variant={variant} className="grid grid-rows-2">
      <div>{footer}</div>
      <CardDescription variant={variant}>Footer description</CardDescription>
    </CardFooter>
  </Card>
);

export const Default: Story = {
  args: {
    variant: 'default',
    title: 'Default card',
    description: 'Card description',
    content: 'This is a default card content',
    footer: 'Default footer',
  },
  render: renderCard,
};

export const Sky: Story = {
  args: {
    variant: 'sky',
    title: 'Sky card',
    description: 'Card description for sky',
    content: 'This is a sky card content',
    footer: 'Sky footer',
  },
  render: renderCard,
};

export const Purple: Story = {
  args: {
    variant: 'purple',
    title: 'Purple card',
    description: 'Card description for purple',
    content: 'This is a purple card content',
    footer: 'Purple footer',
  },
  render: renderCard,
};
