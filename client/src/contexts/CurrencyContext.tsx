import React, { createContext, useContext, useEffect, useState } from "react";

export type Currency = "BRL" | "ARS" | "PYG";

interface ExchangeRates {
  BRL: number;
  ARS: number;
  PYG: number;
}

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  rates: ExchangeRates;
  convertPrice: (priceInBRL: number) => number;
  formatPrice: (price: number) => string;
  getCurrencySymbol: () => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Taxas de câmbio aproximadas (em produção, usar API de câmbio em tempo real)
// Última atualização: Janeiro 2026
const DEFAULT_RATES: ExchangeRates = {
  BRL: 1,
  ARS: 45, // 1 BRL ≈ 45 ARS
  PYG: 7500, // 1 BRL ≈ 7500 PYG
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("BRL");
  const [rates, setRates] = useState<ExchangeRates>(DEFAULT_RATES);

  // Detectar localização do usuário e definir moeda padrão
  useEffect(() => {
    const detectCurrency = async () => {
      try {
        // Usar geolocalização do navegador ou API de IP
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        const country = data.country_code;

        if (country === "AR") {
          setCurrency("ARS");
        } else if (country === "PY") {
          setCurrency("PYG");
        } else {
          setCurrency("BRL");
        }
      } catch (error) {
        // Em caso de erro, manter BRL como padrão
        setCurrency("BRL");
      }
    };

    detectCurrency();
  }, []);

  // Buscar taxas de câmbio em tempo real (opcional)
  useEffect(() => {
    const fetchRates = async () => {
      try {
        // Usar uma API de câmbio em tempo real
        // Exemplo: https://api.exchangerate-api.com/v4/latest/BRL
        const response = await fetch("https://api.exchangerate-api.com/v4/latest/BRL");
        const data = await response.json();
        
        if (data.rates) {
          setRates({
            BRL: 1,
            ARS: data.rates.ARS || DEFAULT_RATES.ARS,
            PYG: data.rates.PYG || DEFAULT_RATES.PYG,
          });
        }
      } catch (error) {
        // Manter taxas padrão em caso de erro
        setRates(DEFAULT_RATES);
      }
    };

    fetchRates();
  }, []);

  const convertPrice = (priceInBRL: number): number => {
    const rate = rates[currency];
    return Math.round(priceInBRL * rate * 100) / 100;
  };

  const formatPrice = (price: number): string => {
    if (currency === "BRL") {
      return `R$ ${price.toFixed(2).replace(".", ",")}`;
    } else if (currency === "ARS") {
      return `$${price.toFixed(2).replace(".", ",")}`;
    } else {
      return `₲ ${Math.round(price).toLocaleString("es-PY")}`;
    }
  };

  const getCurrencySymbol = (): string => {
    if (currency === "BRL") return "R$";
    if (currency === "ARS") return "$";
    return "₲";
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        rates,
        convertPrice,
        formatPrice,
        getCurrencySymbol,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return context;
}
