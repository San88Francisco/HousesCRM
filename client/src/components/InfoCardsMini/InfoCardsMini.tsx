import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/card';
import { DropdownSelect } from '../DropdownSelect/DropdownSelect';
import { DropdownSelectOption } from '@/types/core/dropdownSelectOption';

import { useCurrency } from '@/hooks/useCurrency';
import { getCurrencySymbol } from '@/utils/getCurrencySymbol';

type Currencies = 'UAH' | 'USD' | 'EUR' | 'PLN';

const dateRanges: DropdownSelectOption<Currencies>[] = [
  { label: 'Гривні', value: 'UAH' },
  { label: 'Долари', value: 'USD' },
  { label: 'Євро', value: 'EUR' },
  { label: 'Злоті', value: 'PLN' },
];

const cardData = [
  { title: 'Вартість квартири Хасевича', price: 500000 },
  { title: 'Вартість квартири Бос', price: 600000 },
  { title: 'Вартість квартири Галицького', price: 700000 },
];

const TIMER_ANIMATION = 6000;

const convertPrice = (price: number, selectedCurrency: Currencies, currencyRate: number | null) => {
  if (!currencyRate || selectedCurrency === 'UAH') {
    return price;
  }
  return price / currencyRate;
};

const formatPrice = (price: number, currency: Currencies) => {
  const roundedPrice = Math.round(price);
  return `${roundedPrice.toLocaleString()} ${getCurrencySymbol(currency)}`;
};

export const InfoCardsMini = () => {
  const { selectedCurrency, setSelectedCurrency, currencyRate } = useCurrency();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const timer = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % cardData.length);
    }, TIMER_ANIMATION);

    return () => clearInterval(timer);
  }, []);

  const formattedCardData = cardData.map(card => ({
    ...card,
    convertedPrice: convertPrice(card.price, selectedCurrency, currencyRate),
  }));

  const totalPrice = formattedCardData.reduce((sum, card) => sum + card.price, 0);

  return (
    <div className="flex flex-col lg:flex-row mb-5 gap-5 items-start lg:items-center justify-between">
      <div className="flex flex-col lg:flex-row gap-5 w-full lg:w-auto">
        <Card className="p-3 w-full lg:w-auto flex justify-center items-center">
          <h3 className="text-center">
            Загальна вартість квартир:{' '}
            {isClient
              ? formatPrice(
                  convertPrice(totalPrice, selectedCurrency, currencyRate),
                  selectedCurrency,
                )
              : 'Завантаження...'}
          </h3>
        </Card>
        <Card className="p-3 h-16 w-full lg:w-[300px] overflow-hidden relative">
          <AnimatePresence initial={false}>
            <motion.div
              key={currentIndex}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{
                type: 'spring',
                stiffness: 100,
                damping: 30,
                duration: 1,
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <h3 className="text-center px-2">
                {formattedCardData[currentIndex].title}:{' '}
                <span className="text-nowrap text-lg font-medium text-gray-700">
                  {isClient
                    ? formatPrice(formattedCardData[currentIndex].convertedPrice, selectedCurrency)
                    : 'Завантаження...'}
                </span>
              </h3>
            </motion.div>
          </AnimatePresence>
        </Card>
      </div>
      <Card className="p-3 w-full lg:w-auto ">
        <DropdownSelect<Currencies>
          options={dateRanges}
          value={selectedCurrency}
          onChange={setSelectedCurrency}
          className="w-full lg:w-[150px] bg-card"
        />
      </Card>
    </div>
  );
};
