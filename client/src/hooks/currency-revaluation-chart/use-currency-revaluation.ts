import { useState, useEffect } from 'react';
import { CurrencyRevaluation } from '@/types/core/currency-revaluation-chart/types';
import { getCurrencyRevaluation } from '@/shared/api/currency-revaluation-chart/currency-revaluation';

interface UseCurrencyRevaluationResult {
  data: CurrencyRevaluation[];
  loading: boolean;
  error: string | null;
}

const LOADING_DELAY = 500;

export const useCurrencyRevaluation = (): UseCurrencyRevaluationResult => {
  const [data, setData] = useState<CurrencyRevaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [apiData] = await Promise.all([
          getCurrencyRevaluation(),
          new Promise(resolve => setTimeout(resolve, LOADING_DELAY)),
        ]);

        setData(apiData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Не вдалося завантажити дані';
        setError(errorMessage);
        console.error('Error fetching currency revaluation:', err);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, []);

  return { data, loading, error };
};
