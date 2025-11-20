import { CurrencyRevaluation } from '@/types/core/currency-revaluation-chart/types';

interface CurrencyRevaluationResponse {
  purchaseRate: number;
  currentRate: number;
  revaluationAmountUah: number;
  purchaseAmountUah: number;
  id: string;
  apartmentName: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL1;
const ENDPOINT = '/api/houses-analytics/currency-revaluation-analytic';

const getAuthToken = (): string => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  if (!token) {
    throw new Error('Auth token is missing');
  }
  return token;
};

const handleResponse = async (response: Response): Promise<CurrencyRevaluationResponse[]> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `API Error: ${response.status}`);
  }
  return response.json();
};

export const getCurrencyRevaluation = async (): Promise<CurrencyRevaluation[]> => {
  if (!BASE_URL) {
    throw new Error('NEXT_PUBLIC_API_URL1 is not defined');
  }

  const token = getAuthToken();

  const response = await fetch(`${BASE_URL}${ENDPOINT}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await handleResponse(response);
  return data as CurrencyRevaluation[];
};
