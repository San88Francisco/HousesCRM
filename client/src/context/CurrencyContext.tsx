import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { Currencies } from "@/types"

type CurrencyContextType = {
  selectedCurrency: Currencies
  setSelectedCurrency: (currency: Currencies) => void
  currencyRate: number | null
  currencyRates: any[]
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

const fetchCurrencyRates = async () => {
  try {
    const response = await fetch("https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json")
    const data = await response.json()
    const rates = data.filter((rate: any) => ["USD", "EUR", "PLN", "UAH"].includes(rate.cc))
    return rates
  } catch (error) {
    console.error("Error fetching currency rates:", error)
    return null
  }
}

const getCurrencyRatesFromLocalStorage = () => {
  const rates = localStorage.getItem("currencyRates")
  if (rates) {
    return JSON.parse(rates)
  }
  return null
}

const updateCurrencyRatesInLocalStorage = async () => {
  const lastUpdate = localStorage.getItem("currencyLastUpdate")
  const currentDate = new Date()

  if (!lastUpdate || currentDate.getTime() - new Date(lastUpdate).getTime() > 7 * 24 * 60 * 60 * 1000) {
    const rates = await fetchCurrencyRates()
    if (rates) {
      localStorage.setItem("currencyRates", JSON.stringify(rates))
      localStorage.setItem("currencyLastUpdate", currentDate.toLocaleDateString())
    }
  }
}

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState<Currencies>("UAH")
  const [currencyRate, setCurrencyRate] = useState<number | null>(null)
  const [currencyRates, setCurrencyRates] = useState<any[]>([])

  useEffect(() => {
    const storedRates = getCurrencyRatesFromLocalStorage()
    if (!storedRates) {
      updateCurrencyRatesInLocalStorage().then(() => {
        const updatedRates = getCurrencyRatesFromLocalStorage()
        if (updatedRates) {
          setCurrencyRates(updatedRates)
          updateRate(updatedRates, selectedCurrency)
        }
      })
    } else {
      setCurrencyRates(storedRates)
      updateRate(storedRates, selectedCurrency)
    }
  }, [])

  const updateRate = useCallback((rates: any[], currency: Currencies) => {
    const rate = rates.find((rate) => rate.cc === currency)
    setCurrencyRate(rate ? rate.rate : null)
  }, [])

  useEffect(() => {
    if (currencyRates.length > 0) {
      updateRate(currencyRates, selectedCurrency)
    }
  }, [selectedCurrency, currencyRates, updateRate])

  const setSelectedCurrencyAndUpdateRate = useCallback(
    (currency: Currencies) => {
      setSelectedCurrency(currency)
      updateRate(currencyRates, currency)
    },
    [currencyRates, updateRate],
  )

  return (
    <CurrencyContext.Provider
      value={{
        selectedCurrency,
        setSelectedCurrency: setSelectedCurrencyAndUpdateRate,
        currencyRate,
        currencyRates,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export const useCurrency = () => {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}

