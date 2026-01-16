import { Currencies } from '../currencies';

export type CurrencyDisplay = 'symbol' | 'narrowSymbol' | 'code' | 'name';

export type FormatCurrencyArgs = {
  currency?: Currencies;
  currencyDisplay?: CurrencyDisplay;
  maximumFractionDigits?: number;
  locale?: Intl.LocalesArgument;
};
