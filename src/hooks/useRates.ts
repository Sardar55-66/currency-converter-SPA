import { useCallback, useEffect, useState } from 'react';
import type { RatesApiResponse, VATComplyResponse, FxRatesApiResponse } from '../types/api';
import { API_CONFIG } from '../constants';

const CACHE_KEY = 'rates_cache_v1';
const TTL = 5 * 60 * 1000;

const API_ENDPOINTS = [
  {
    url: API_CONFIG.VATCOMPLY_URL,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  },
  {
    url: `${API_CONFIG.FXRATES_URL}?access_key=${API_CONFIG.FXRATES_API_KEY}`,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  }
];

function normalizeApiResponse(data: any): RatesApiResponse {
  // Check if it's fxratesapi.com format
  if (data.success !== undefined) {
    const fxData = data as FxRatesApiResponse;
    return {
      base: fxData.base,
      date: fxData.date,
      rates: fxData.rates
    };
  }

  // VATComply format (or other compatible format)
  const vatData = data as VATComplyResponse;
  return {
    base: vatData.base,
    date: vatData.date,
    rates: vatData.rates
  };
}

function saveCache(payload: { base: string; rates: Record<string, number>; timestamp: number }) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch { }
}
function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) as { base: string; rates: Record<string, number>; timestamp: number } : null;
  } catch { return null; }
}

export function useRates() {
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [base, setBase] = useState<string>('EUR');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const fetchRates = useCallback(async () => {
    setLoading(true);
    setError(null);

    const endpoints = API_CONFIG.CUSTOM_URL
      ? [{ url: API_CONFIG.CUSTOM_URL, headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } }, ...API_ENDPOINTS]
      : API_ENDPOINTS;
    let lastError: Error | null = null;

    for (const endpoint of endpoints) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 секунд таймаут

      try {
        const res = await fetch(endpoint.url, {
          signal: controller.signal,
          headers: endpoint.headers
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const rawData = await res.json();

        const data = normalizeApiResponse(rawData);

        if (!data.rates || typeof data.rates !== 'object') {
          throw new Error('Invalid API response format');
        }

        setRates(data.rates);
        setBase(data.base ?? 'EUR');
        const ts = Date.now();
        setLastUpdated(ts);
        saveCache({ base: data.base ?? 'EUR', rates: data.rates, timestamp: ts });
        setLoading(false);
        return;

      } catch (e: any) {
        clearTimeout(timeoutId);
        lastError = e;
        console.warn('Failed to fetch from:', endpoint.url, e.message);

        if (endpoint !== endpoints[endpoints.length - 1]) {
          continue;
        }
      }
    }

    if (lastError) {
      if (lastError.name === 'AbortError') {
        setError('All APIs timed out - please check your internet connection');
      } else if (lastError.message.includes('Failed to fetch')) {
        setError('Network error - all APIs are unreachable');
      } else {
        setError(`Failed to fetch exchange rates: ${lastError.message}`);
      }
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const cache = loadCache();
    if (cache) {
      setRates(cache.rates);
      setBase(cache.base);
      setLastUpdated(cache.timestamp);

      // если устарел — обновим в фоне
      if (Date.now() - cache.timestamp > TTL && navigator.onLine) {
        fetchRates();
      }
    } else {
      fetchRates();
    }
  }, [fetchRates]);

  return {
    rates,
    base,
    loading,
    error,
    lastUpdated,
    refresh: fetchRates,
    isCacheStale: lastUpdated ? Date.now() - lastUpdated > TTL : true,
  };
}
