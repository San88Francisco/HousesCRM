import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../ui/card";
import { DropdownSelect, type DropdownSelectOption } from "../DropdownSelect/DropdownSelect";

type Currencies = "UAH" | "USD" | "EUR" | "PLN";

const fetchCurrencyRates = async () => {
  try {
    const response = await fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json');
    const data = await response.json();
    const rates = data.filter((rate: any) =>
      ["USD", "EUR", "PLN", "UAH"].includes(rate.cc)
    );
    return rates;
  } catch (error) {
    console.error("Error fetching currency rates:", error);
    return null;
  }
};

const updateCurrencyRatesInLocalStorage = async () => {
  const lastUpdate = localStorage.getItem("currencyLastUpdate");
  const currentDate = new Date();

  if (!lastUpdate || (currentDate.getTime() - new Date(lastUpdate).getTime()) > 7 * 24 * 60 * 60 * 1000) {
    const rates = await fetchCurrencyRates();
    if (rates) {
      localStorage.setItem("currencyRates", JSON.stringify(rates));
      localStorage.setItem("currencyLastUpdate", currentDate.toLocaleDateString());
    }
  }
};

const getCurrencyRatesFromLocalStorage = () => {
  const rates = localStorage.getItem("currencyRates");
  if (rates) {
    return JSON.parse(rates);
  }
  return null;
};

const dateRanges: DropdownSelectOption<Currencies>[] = [
  { label: "Гривні", value: "UAH" },
  { label: "Долари", value: "USD" },
  { label: "Євро", value: "EUR" },
  { label: "Злоті", value: "PLN" },
];

const cardData = [
  { title: "Вартість квартири Хасевича", price: 500000 },
  { title: "Вартість квартири Бос", price: 600000 },
  { title: "Вартість квартири Галицького", price: 700000 },
];

const TIMER_ANIMATION = 6000;

const getCurrencySymbol = (currency: Currencies) => {
  switch (currency) {
    case "UAH":
      return "₴";
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "PLN":
      return "zł";
    default:
      return "";
  }
};

// Функція для конвертації ціни в залежності від вибраної валюти
const convertPrice = (price: number, selectedCurrency: Currencies, currencyRates: any) => {
  // Якщо currencyRates не доступні, повертаємо оригінальну ціну
  if (!currencyRates) return price;

  // Знаходимо курс для вибраної валюти
  const rate = currencyRates.find((rate: any) => rate.cc === selectedCurrency);
  if (!rate) return price; // Якщо курс не знайдений, повертаємо оригінальну ціну

  if (selectedCurrency === "UAH") {
    return price; // Якщо вибрана гривня, повертаємо без змін
  }

  // Переводимо гривню в іншу валюту
  const uahToSelectedCurrencyRate = rate.rate; // Курс гривні до обраної валюти
  return price / uahToSelectedCurrencyRate; // Перераховуємо з гривні в обрану валюту
};

const formatPrice = (price: number, currency: Currencies) => {
  // Округляємо ціну до цілих одиниць
  const roundedPrice = Math.round(price);
  return `${roundedPrice.toLocaleString()} ${getCurrencySymbol(currency)}`;
};

export const InfoCardsMini = () => {
  const [selectedRange, setSelectedRange] = useState<Currencies>("UAH");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currencyRates, setCurrencyRates] = useState<any>([]); // ініціалізація як порожній масив
  const [formattedCardData, setFormattedCardData] = useState(cardData); // Додаємо formattedCardData
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedRates = getCurrencyRatesFromLocalStorage();
    if (!storedRates) {
      updateCurrencyRatesInLocalStorage();
    } else {
      setCurrencyRates(storedRates);
    }

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % cardData.length);
    }, TIMER_ANIMATION);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      updateCurrencyRatesInLocalStorage();
    }, 60 * 60 * 1000); // Оновлення кожну годину
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Перераховуємо ціни після вибору нової валюти
    if (currencyRates.length > 0) {
      const updatedFormattedCardData = cardData.map((card) => {
        const convertedPrice = convertPrice(card.price, selectedRange, currencyRates);
        return { ...card, convertedPrice };
      });
      setFormattedCardData(updatedFormattedCardData);
    }
  }, [selectedRange, currencyRates]);

  const totalPrice = formattedCardData.reduce((sum, card) => sum + card.price, 0);

  return (
    <div className="flex flex-col lg:flex-row mb-5 gap-5 items-start lg:items-center justify-between">
      <div className="flex flex-col lg:flex-row gap-5 w-full lg:w-auto">
        <Card className="p-3 w-full lg:w-auto flex justify-center items-center">
          <h3 className="text-center">
            Загальна вартість квартир:{" "}
            {isClient
              ? formatPrice(convertPrice(totalPrice, selectedRange, currencyRates), selectedRange)
              : "Завантаження..."}
          </h3>
        </Card>
        <Card className="p-3 h-16 w-full lg:w-[300px] overflow-hidden relative">
          <AnimatePresence initial={false}>
            <motion.div
              key={currentIndex}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 30,
                duration: 1,
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <h3 className="text-center px-2">
                {formattedCardData[currentIndex].title}:{" "}
                {isClient
                  ? formatPrice(
                    convertPrice(formattedCardData[currentIndex].price, selectedRange, currencyRates),
                    selectedRange
                  )
                  : "Завантаження..."}
              </h3>
            </motion.div>
          </AnimatePresence>
        </Card>
      </div>
      <Card className="p-3 w-full lg:w-auto">
        <DropdownSelect<Currencies>
          options={dateRanges}
          value={selectedRange}
          onChange={setSelectedRange}
          className="w-full lg:w-[150px] bg-card"
        />
      </Card>
    </div>
  );
};
