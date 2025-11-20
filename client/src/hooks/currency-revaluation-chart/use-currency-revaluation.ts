import { useState, useEffect } from 'react';
import { CurrencyRevaluation } from '@/types/core/currency-revaluation-chart/types';
import { getCurrencyRevaluation } from '@/shared/api/currency-revaluation-chart/currency-revaluation';

interface UseCurrencyRevaluationResult {
  data: CurrencyRevaluation[];
  loading: boolean;
  error: string | null;
}

export const useCurrencyRevaluation = (): UseCurrencyRevaluationResult => {
  const [data, setData] = useState<CurrencyRevaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiData = await getCurrencyRevaluation(controller.signal);

        setData(apiData);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        const errorMessage = err instanceof Error ? err.message : 'Не вдалося завантажити дані';
        setError(errorMessage);
        console.error('Error fetching currency revaluation:', err);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();

    return () => {
      controller.abort();
    };
  }, []);

  return { data, loading, error };
};
