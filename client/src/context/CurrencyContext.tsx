import type React from 'react';
import { createContext, useState, useEffect, useCallback } from 'react';
import type { Currencies } from '@/types';

type CurrencyRate = {
  cc: string;
  rate: number;
};

type CurrencyContextType = {
  selectedCurrency: Currencies;
  setSelectedCurrency: (currency: Currencies) => void;
  currencyRate: number | null;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const MILLISECONDS_IN_WEEK = 7 * 24 * 60 * 60 * 1000;
const MILLISECONDS_IN_WEEK1 = 7 * 24 * 60 * 60 * 1000;
const MILLISECONDS_IN_WEEK2 = 7 * 24 * 60 * 60 * 1000;

const fetchCurrencyRates = async (): Promise<CurrencyRate[] | null> => {
  try {
    const response = await fetch(
      'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json',
    );
    const data = await response.json();
    const rates = data.filter((rate: CurrencyRate) =>
      ['USD', 'EUR', 'PLN', 'UAH'].includes(rate.cc),
    );
    return rates;
  } catch (error) {
    console.error('Error fetching currency rates:', error);
    return null;
  }
};

const getCurrencyRatesFromLocalStorage = (): CurrencyRate[] | null => {
  const rates = localStorage.getItem('currencyRates');
  if (rates) {
    return JSON.parse(rates);
  }
  return null;
};

const updateCurrencyRatesInLocalStorage = async (): Promise<void> => {
  const lastUpdate = localStorage.getItem('currencyLastUpdate');
  const currentDate = new Date();

  if (
    !lastUpdate ||
    currentDate.getTime() - new Date(lastUpdate).getTime() > MILLISECONDS_IN_WEEK
  ) {
    const rates = await fetchCurrencyRates();
    if (rates) {
      localStorage.setItem('currencyRates', JSON.stringify(rates));
      localStorage.setItem('currencyLastUpdate', currentDate.toLocaleDateString());
    }
  }
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState<Currencies>('UAH');
  const [currencyRate, setCurrencyRate] = useState<number | null>(null);

  const updateRate = useCallback((rates: CurrencyRate[], currency: Currencies) => {
    const rate = rates.find(rate => rate.cc === currency);
    setCurrencyRate(rate ? rate.rate : null);
  }, []);

  useEffect(() => {
    const loadCurrencyRates = async () => {
      let rates = getCurrencyRatesFromLocalStorage();

      if (!rates) {
        await updateCurrencyRatesInLocalStorage();
        rates = getCurrencyRatesFromLocalStorage();
      }

      if (rates) {
        updateRate(rates, selectedCurrency);
      }
    };

    loadCurrencyRates();
  }, [selectedCurrency, updateRate]);

  const setSelectedCurrencyHandler = useCallback((currency: Currencies) => {
    setSelectedCurrency(currency);
  }, []);

  return (
    <CurrencyContext.Provider
      value={{
        selectedCurrency,
        setSelectedCurrency: setSelectedCurrencyHandler,
        currencyRate,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export { CurrencyContext };
