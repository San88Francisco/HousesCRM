import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs';

const meta: Meta<typeof Tabs> = {
  title: 'UI/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: { type: 'radio' },
      options: ['default', 'sm'],
      description: 'Розмір вкладок',
    },
    defaultValue: {
      control: { type: 'text' },
      description: 'Вкладка, вибрана за замовчуванням',
    },
  },
};
export default meta;

type Story = StoryObj<typeof Tabs>;

const tabData = [
  { value: 'account', label: 'Account', content: 'Account Management' },
  { value: 'billing', label: 'Billing', content: 'Billing & Subscription' },
  { value: 'team', label: 'Team', content: 'Team Management' },
  { value: 'settings', label: 'Settings', content: 'Application Settings' },
  { value: 'analytics', label: 'Analytics', content: 'Analytics & Reports' },
];

const Template = (args: React.ComponentProps<typeof Tabs>) => (
  <div className="max-w-2xl mx-auto p-6">
    <Tabs {...args}>
      <TabsList aria-label="Tabs list">
        {tabData.map(tab => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabData.map(tab => (
        <TabsContent key={tab.value} value={tab.value}>
          <div className="p-4 border rounded-md bg-muted/20">
            <h3 className="font-medium mb-2">{tab.content}</h3>
            <p className="text-sm text-muted-foreground">
              Приклад контенту для "{tab.label}" вкладки.
            </p>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  </div>
);

export const Default: Story = {
  render: Template,
  args: {
    size: 'default',
    defaultValue: 'account',
  },
};

export const Small: Story = {
  render: Template,
  args: {
    size: 'sm',
    defaultValue: 'account',
  },
};
