import { HousesAnalyticsResponse } from '@/types/core/payback-chart/analytics';

export const getHousesAnalytics = async (): Promise<HousesAnalyticsResponse> => {
  try {
    const response = await fetch('/houses/analytics', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data: HousesAnalyticsResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch houses analytics:', error);
    throw error;
  }
};
