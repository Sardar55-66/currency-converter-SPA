import React, { createContext, useContext } from 'react';
import { useRates } from '../hooks/useRates';

type RatesContextType = ReturnType<typeof useRates>;
const RatesContext = createContext<RatesContextType | undefined>(undefined);

export const RatesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ratesState = useRates();
  return <RatesContext.Provider value={ratesState}>{children}</RatesContext.Provider>;
};

export const useRatesContext = () => {
  const ctx = useContext(RatesContext);
  if (!ctx) throw new Error('useRatesContext must be used within RatesProvider');
  return ctx;
};
