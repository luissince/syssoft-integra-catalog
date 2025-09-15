"use client";

import { Currency } from "@/types/api-type";
import { createContext, useContext, ReactNode, useState } from "react";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children, initialCurrency }: { children: ReactNode,  initialCurrency: Currency; }) {
  const [currency, setCurrency] = useState<Currency>(initialCurrency);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency debe usarse dentro de un CurrencyProvider");
  }
  return context;
}
