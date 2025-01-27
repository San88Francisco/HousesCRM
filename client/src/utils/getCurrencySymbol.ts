import { Currencies } from "@/types";

const currencySymbols: { [key in Currencies]: string } = {
  UAH: "₴",
  USD: "$",
  EUR: "€",
  PLN: "zł",
};

export const getCurrencySymbol = (currency: Currencies) => {
  return currencySymbols[currency] || "";
};
