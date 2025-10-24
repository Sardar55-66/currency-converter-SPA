// src/types/api.ts

// VATComply API response format
export interface VATComplyResponse {
  base: string;
  date?: string;
  rates: Record<string, number>;
}

// fxratesapi.com API response format
export interface FxRatesApiResponse {
  success: boolean;
  terms?: string;
  privacy?: string;
  timestamp?: number;
  date: string;
  base: string;
  rates: Record<string, number>;
}

// Unified response format
export interface RatesApiResponse {
  base: string;
  date?: string;
  rates: Record<string, number>;
}
