export const API_CONFIG = {
    // Primary API (VATComply) - free, base usually EUR
    VATCOMPLY_URL: 'https://api.vatcomply.com/rates',
    // Alternative API (fxratesapi.com) with API key
    FXRATES_URL: 'https://api.fxratesapi.com/latest',
    FXRATES_API_KEY: 'fxr_live_e6d3014cfa5157c4c71ff4eea8f5230d3aa5',
    // Custom API URL from env (if provided)
    CUSTOM_URL: import.meta.env.VITE_EXCHANGE_API_URL,
    CACHE_EXPIRY_MINUTES: parseInt(import.meta.env.VITE_CACHE_EXPIRY_MINUTES || '5'),
    CACHE_KEY: 'currency_rates_cache',
    DEBOUNCE_DELAY: 250,
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
    CACHED_RATES: 'currency_rates_cache',
    LAST_CURRENCIES: 'last_currencies',
    LAST_AMOUNT: 'last_amount',
} as const;

// Available currencies in VATComply API
export const AVAILABLE_CURRENCIES = [
    'AUD', 'BGN', 'BRL', 'CAD', 'CHF', 'CNY', 'CZK', 'DKK', 'EUR', 'GBP',
    'HKD', 'HUF', 'IDR', 'ILS', 'INR', 'ISK', 'JPY', 'KRW', 'MXN', 'MYR',
    'NOK', 'NZD', 'PHP', 'PLN', 'RON', 'SEK', 'SGD', 'THB', 'TRY', 'USD', 'ZAR'
] as const;

// Error Messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please check your connection.',
    API_ERROR: 'Failed to fetch exchange rates. Please try again.',
    INVALID_AMOUNT: 'Please enter a valid amount.',
    SAME_CURRENCY: 'Please select different currencies.',
    UNKNOWN_CURRENCY: 'Unknown currency code.',
    CACHE_ERROR: 'Failed to load cached data.',
    CONVERSION_ERROR: 'Unable to convert currencies. Please try again.',
    RATES_UNAVAILABLE: 'Exchange rates are currently unavailable.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
    RATES_UPDATED: 'Exchange rates updated successfully.',
    CONVERSION_SUCCESS: 'Currency conversion completed.',
    CACHE_LOADED: 'Using cached exchange rates.',
} as const;

// Warning Messages
export const WARNING_MESSAGES = {
    CURRENCY_NOT_SUPPORTED: 'This currency is not supported by the current API.',
    USING_CACHED_DATA: 'Using cached data. Rates may be outdated.',
    OFFLINE_MODE: 'You are offline. Using cached exchange rates.',
} as const;

