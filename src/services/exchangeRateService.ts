import type { ExchangeRatesResponse, CachedRates } from '../types';
import { API_CONFIG, STORAGE_KEYS, ERROR_MESSAGES } from '../constants';
import { saveToStorage, loadFromStorage, isCacheExpired } from '../utils';

class ExchangeRateService {
    private cache: CachedRates | null = null;

    constructor() {
        this.loadCache();
    }

    private loadCache(): void {
        try {
            this.cache = loadFromStorage<CachedRates | null>(STORAGE_KEYS.CACHED_RATES, null);
        } catch (error) {
            console.warn('Failed to load cache:', error);
            this.cache = null;
        }
    }

    private saveCache(data: ExchangeRatesResponse): void {
        const cachedData: CachedRates = {
            rates: data.rates,
            base: data.base,
            timestamp: Date.now(),
            date: data.date,
        };

        this.cache = cachedData;
        saveToStorage(STORAGE_KEYS.CACHED_RATES, cachedData);
    }

    private isCacheValid(): boolean {
        if (!this.cache) return false;
        return !isCacheExpired(this.cache.timestamp, API_CONFIG.CACHE_EXPIRY_MINUTES);
    }

    async fetchExchangeRates(): Promise<ExchangeRatesResponse> {
        try {
            const response = await fetch(API_CONFIG.VATCOMPLY_URL);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: ExchangeRatesResponse = await response.json();

            if (!data.base || !data.rates || typeof data.rates !== 'object') {
                throw new Error('Invalid API response format');
            }

            this.saveCache(data);
            return data;
        } catch (error) {
            console.error('API fetch error:', error);

            if (this.isCacheValid() && this.cache) {
                return {
                    base: this.cache.base,
                    date: this.cache.date,
                    rates: this.cache.rates,
                };
            }

            throw new Error(error instanceof Error ? error.message : ERROR_MESSAGES.API_ERROR);
        }
    }

    getCachedRates(): ExchangeRatesResponse | null {
        if (this.isCacheValid() && this.cache) {
            return {
                base: this.cache.base,
                date: this.cache.date,
                rates: this.cache.rates,
            };
        }
        return null;
    }

    getLastUpdateTime(): number | null {
        return this.cache?.timestamp || null;
    }

    isOnline(): boolean {
        return navigator.onLine;
    }

    async refreshRates(): Promise<ExchangeRatesResponse> {
        if (!this.isOnline()) {
            throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
        }

        return this.fetchExchangeRates();
    }

    // Get available currencies from rates
    getAvailableCurrencies(): string[] {
        if (this.cache?.rates) {
            return Object.keys(this.cache.rates);
        }
        return [];
    }

    // Clear cache
    clearCache(): void {
        this.cache = null;
        localStorage.removeItem(STORAGE_KEYS.CACHED_RATES);
    }
}

export const exchangeRateService = new ExchangeRateService();
