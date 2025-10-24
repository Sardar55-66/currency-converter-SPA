// Local storage utilities
export const saveToStorage = <T>(key: string, value: T): void => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.warn('Failed to save to localStorage:', error);
    }
};

export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.warn('Failed to load from localStorage:', error);
        return defaultValue;
    }
};

export const removeFromStorage = (key: string): void => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.warn('Failed to remove from localStorage:', error);
    }
};

// Cache utilities
export const isCacheExpired = (timestamp: number, expiryMinutes: number): boolean => {
    const now = Date.now();
    const expiryTime = expiryMinutes * 60 * 1000;
    return now - timestamp > expiryTime;
};

// Currency conversion utilities
export const convertCurrency = (
    amount: number,
    fromCurrency: string,
    toCurrency: string,
    rates: Record<string, number>
): number | null => {
    if (!rates || amount <= 0) return null;

    // If same currency, return same amount
    if (fromCurrency === toCurrency) return amount;

    // Get rates from base currency
    const fromRate = rates[fromCurrency];
    const toRate = rates[toCurrency];

    if (fromRate == null || toRate == null) return null;

    // Calculate conversion rate: rate(A→B) = rate(Base→B) / rate(Base→A)
    const conversionRate = toRate / fromRate;

    return amount * conversionRate;
};

export const getExchangeRate = (
    fromCurrency: string,
    toCurrency: string,
    rates: Record<string, number>
): number | null => {
    if (!rates) return null;

    if (fromCurrency === toCurrency) return 1;

    const fromRate = rates[fromCurrency];
    const toRate = rates[toCurrency];

    if (fromRate == null || toRate == null) return null;

    return toRate / fromRate;
};

export const formatCurrencyAmount = (amount: number, currencyCode: string, locale = 'en-US'): string => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 6
    }).format(amount);
};

export const formatNumber = (value: number, locale = 'en-US', fractionDigits = 2): string => {
    return new Intl.NumberFormat(locale, {
        maximumFractionDigits: fractionDigits,
        minimumFractionDigits: 0
    }).format(value);
};
