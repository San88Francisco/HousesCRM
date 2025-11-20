import { CurrencyRevaluation } from '@/types/core/currency-revaluation-chart/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL1;
const ENDPOINT = '/api/houses-analytics/currency-revaluation-analytic';
const REQUEST_TIMEOUT = 30000;

const getAuthToken = (): string => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  if (!token) {
    throw new Error('Auth token is missing');
  }
  return token;
};

const handleResponse = async (response: Response): Promise<CurrencyRevaluation[]> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  try {
    return await response.json();
  } catch {
    throw new Error('Invalid JSON response from server');
  }
};

const createAbortController = (signal?: AbortSignal): AbortController => {
  const controller = new AbortController();
  if (signal) {
    if (signal.aborted) {
      controller.abort();
    } else {
      signal.addEventListener('abort', () => controller.abort(), { once: true });
    }
  }
  return controller;
};

const handleFetchError = (error: unknown, didTimeout: boolean): never => {
  if (error instanceof Error && error.name === 'AbortError') {
    throw new Error(didTimeout ? 'Request timeout' : 'Request was aborted');
  }
  throw error;
};

export const getCurrencyRevaluation = async (
  signal?: AbortSignal,
): Promise<CurrencyRevaluation[]> => {
  if (!BASE_URL) {
    throw new Error('NEXT_PUBLIC_API_URL1 is not defined');
  }

  const token = getAuthToken();
  const controller = createAbortController(signal);
  let didTimeout = false;
  const timeoutId = setTimeout(() => {
    didTimeout = true;
    controller.abort();
  }, REQUEST_TIMEOUT);

  try {
    const response = await fetch(`${BASE_URL}${ENDPOINT}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      signal: controller.signal,
    });

    return await handleResponse(response);
  } catch (error) {
    return handleFetchError(error, didTimeout);
  } finally {
    clearTimeout(timeoutId);
  }
};
