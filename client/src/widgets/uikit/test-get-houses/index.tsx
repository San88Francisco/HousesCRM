'use client';
import { Button } from '@/shared/ui/button';
import { useLazyGetHousesAnalyticsQuery } from '@/store/houses';
import React from 'react';
import { toast } from 'sonner';

export const TestGetHouses = () => {
  const [getHousesAnalytics, { data, error, isLoading }] = useLazyGetHousesAnalyticsQuery();
  const handleClick = async () => {
    try {
      const result = await getHousesAnalytics().unwrap();
      toast('✅ Houses analytics: ' + JSON.stringify(result));
    } catch (error) {
      toast.error('❌ Error: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  return (
    <div className="p-4">
      <Button onClick={handleClick} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Get Houses Analytics'}
      </Button>
      {error && <p className="text-red-500 mt-2">Error: {JSON.stringify(error)}</p>}
      {data && <pre className="mt-2">{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};
