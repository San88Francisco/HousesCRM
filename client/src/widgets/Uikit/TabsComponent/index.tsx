'use client';

import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs';

const tabData = [
  { value: 'account', label: 'Account', content: 'Account Management' },
  { value: 'billing', label: 'Billing', content: 'Billing & Subscription' },
  { value: 'team', label: 'Team', content: 'Team Management' },
  { value: 'settings', label: 'Settings', content: 'Application Settings' },
  { value: 'analytics', label: 'Analytics', content: 'Analytics & Reports' },
];

export default function TabsComponent() {
  return (
    <main className="mx-auto max-w-4xl p-6 space-y-8">
      <section>
        <Tabs defaultValue="account">
          <TabsList aria-label="Default sized tabs">
            {tabData.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabData.map(tab => (
            <TabsContent key={tab.value} value={tab.value}>
              <div>
                <h3 className="font-medium mb-2">{tab.content}</h3>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>
      <section>
        <Tabs size="sm" defaultValue="account">
          <TabsList aria-label="Small sized tabs">
            {tabData.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabData.map(tab => (
            <TabsContent key={tab.value} value={tab.value}>
              <div>
                <h3 className="font-medium mb-2">{tab.content}</h3>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </main>
  );
}
